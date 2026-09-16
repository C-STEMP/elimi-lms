import type { ScormCmiCommit, ScormLessonStatus } from "@/features/player/types";

type ScormErrorCode =
  | "0" // No error
  | "101" // General exception
  | "201" // Invalid argument error
  | "301" // Not initialized
  | "402" // Invalid set value, element is a keyword
  | "403" // Element is read only
  | "404"; // Element is write only

const ERROR_STRINGS: Record<ScormErrorCode, string> = {
  "0": "No error",
  "101": "General exception",
  "201": "Invalid argument error",
  "301": "Not initialized",
  "402": "Invalid set value, element is a keyword",
  "403": "Element is read only",
  "404": "Element is write only",
};

const TRUE = "true";
const FALSE = "false";

type CmiAccess = "read" | "write" | "read-write";

type CmiField = {
  value: string;
  access: CmiAccess;
};

const VALID_LESSON_STATUS = new Set([
  "passed",
  "completed",
  "failed",
  "incomplete",
  "browsed",
  "not attempted",
]);

function buildInitialCmi(learnerId: string, learnerName: string): Record<string, CmiField> {
  return {
    "cmi.core.student_id": { value: learnerId, access: "read" },
    "cmi.core.student_name": { value: learnerName, access: "read" },
    "cmi.core.lesson_status": { value: "not attempted", access: "read-write" },
    "cmi.core.credit": { value: "credit", access: "read" },
    "cmi.core.entry": { value: "ab-initio", access: "read" },
    "cmi.core.total_time": { value: "0000:00:00.00", access: "read" },
    "cmi.core.lesson_mode": { value: "normal", access: "read" },
    "cmi.core.exit": { value: "", access: "write" },
    "cmi.core.session_time": { value: "", access: "write" },
    "cmi.core.score.raw": { value: "", access: "read-write" },
    "cmi.core.score.min": { value: "", access: "read-write" },
    "cmi.core.score.max": { value: "100", access: "read-write" },
    "cmi.core.lesson_location": { value: "", access: "read-write" },
    "cmi.suspend_data": { value: "", access: "read-write" },
    "cmi.launch_data": { value: "", access: "read" },
    "cmi.comments": { value: "", access: "read-write" },
    "cmi.comments_from_lms": { value: "", access: "read" },
    "cmi.student_data.mastery_score": { value: "", access: "read" },
    "cmi.student_data.max_time_allowed": { value: "", access: "read" },
    "cmi.student_data.time_limit_action": { value: "continue,no message", access: "read" },
    "cmi.student_preference.audio": { value: "0", access: "read-write" },
    "cmi.student_preference.language": { value: "", access: "read-write" },
    "cmi.student_preference.speed": { value: "0", access: "read-write" },
    "cmi.student_preference.text": { value: "0", access: "read-write" },
  };
}

export type ScormRuntimeOptions = {
  learnerId: string;
  learnerName: string;
  /**
   * Prior CMI state for resuming a session. The current `GET
   * /player/scorm/{sessionId}` contract doesn't return this (only launch
   * metadata), so these are always empty until that endpoint is extended —
   * every launch effectively starts a fresh attempt.
   */
  initialLessonStatus?: ScormLessonStatus;
  initialSuspendData?: string;
  initialLessonLocation?: string;
  onCommit: (snapshot: ScormCmiCommit) => void;
};

/**
 * SCORM 1.2 Run-Time Environment: the 8-function `LMS*` API a SCO expects on
 * `window.API`. Only the subset of CMI the backend persists (lesson_status,
 * score, session_time, suspend_data, location) is forwarded on commit — the
 * rest of the data model lives in-memory purely so well-behaved packages
 * that read/write it don't error out.
 */
export class ScormRuntime {
  private cmi: Record<string, CmiField>;
  private initialized = false;
  private terminated = false;
  private lastError: ScormErrorCode = "0";
  private readonly onCommit: ScormRuntimeOptions["onCommit"];
  private readonly startedAt = Date.now();

  constructor(options: ScormRuntimeOptions) {
    this.cmi = buildInitialCmi(options.learnerId, options.learnerName);
    if (options.initialLessonStatus) {
      this.cmi["cmi.core.lesson_status"].value = options.initialLessonStatus;
    }
    if (options.initialSuspendData) {
      this.cmi["cmi.suspend_data"].value = options.initialSuspendData;
    }
    if (options.initialLessonLocation) {
      this.cmi["cmi.core.lesson_location"].value = options.initialLessonLocation;
    }
    this.onCommit = options.onCommit;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- SCORM 1.2 always calls this with "", kept for signature fidelity.
  LMSInitialize(_param: string): string {
    if (this.initialized) {
      this.lastError = "101";
      return FALSE;
    }
    this.initialized = true;
    this.lastError = "0";
    return TRUE;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- SCORM 1.2 always calls this with "", kept for signature fidelity.
  LMSFinish(_param: string): string {
    if (!this.requireActive()) return FALSE;
    this.commit();
    this.terminated = true;
    this.lastError = "0";
    return TRUE;
  }

  LMSGetValue(element: string): string {
    if (!this.requireActive()) return "";

    const field = this.cmi[element];
    if (field) {
      if (field.access === "write") {
        this.lastError = "404";
        return "";
      }
      this.lastError = "0";
      return field.value;
    }

    if (this.isCollectionElement(element)) {
      this.lastError = "0";
      return "";
    }

    this.lastError = "201";
    return "";
  }

  LMSSetValue(element: string, value: string): string {
    if (!this.requireActive()) return FALSE;

    const field = this.cmi[element];
    if (!field) {
      if (this.isCollectionElement(element)) {
        this.cmi[element] = { value, access: "read-write" };
        this.lastError = "0";
        return TRUE;
      }
      this.lastError = "201";
      return FALSE;
    }
    if (field.access === "read") {
      this.lastError = "403";
      return FALSE;
    }
    if (element === "cmi.core.lesson_status" && !VALID_LESSON_STATUS.has(value)) {
      this.lastError = "201";
      return FALSE;
    }
    field.value = value;
    this.lastError = "0";
    return TRUE;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- SCORM 1.2 always calls this with "", kept for signature fidelity.
  LMSCommit(_param: string): string {
    if (!this.requireActive()) return FALSE;
    this.commit();
    this.lastError = "0";
    return TRUE;
  }

  LMSGetLastError(): string {
    return this.lastError;
  }

  LMSGetErrorString(errorCode: string): string {
    return ERROR_STRINGS[errorCode as ScormErrorCode] ?? "Unknown error";
  }

  LMSGetDiagnostic(errorCode: string): string {
    return this.LMSGetErrorString(errorCode);
  }

  private requireActive(): boolean {
    if (!this.initialized || this.terminated) {
      this.lastError = "301";
      return false;
    }
    return true;
  }

  private isCollectionElement(element: string): boolean {
    return /^cmi\.(objectives|interactions)\.\d+\./.test(element);
  }

  private commit(): void {
    const scoreRawText = this.cmi["cmi.core.score.raw"].value;
    const scoreMaxText = this.cmi["cmi.core.score.max"].value;
    const sessionTime =
      this.cmi["cmi.core.session_time"].value || elapsedScormTime(this.startedAt);

    this.onCommit({
      lessonStatus: mapLessonStatus(this.cmi["cmi.core.lesson_status"].value),
      scoreRaw: scoreRawText ? Number(scoreRawText) : null,
      scoreMax: scoreMaxText ? Number(scoreMaxText) : null,
      sessionTime,
      suspendData: this.cmi["cmi.suspend_data"].value,
      location: this.cmi["cmi.core.lesson_location"].value,
    });
  }
}

/** cmi.core.lesson_status has 6 values; the backend's simplified model has 4. */
function mapLessonStatus(status: string): ScormLessonStatus {
  switch (status) {
    case "passed":
      return "passed";
    case "failed":
      return "failed";
    case "completed":
    case "browsed":
      return "completed";
    default:
      return "incomplete";
  }
}

function elapsedScormTime(startedAt: number): string {
  const totalSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(4, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.00`;
}
