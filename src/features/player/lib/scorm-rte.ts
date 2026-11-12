import type {
  ScormCmiCommit,
  ScormLessonStatus,
  ScormSession,
} from "../types";

const TRUE = "true";
const FALSE = "false";

export type ScormRuntimeOptions = {
  learnerId: string;
  learnerName: string;
  /** Complete SCORM session returned from GET /player/scorm/{sessionId} */
  session?: ScormSession;
  /** Prior CMI state for resuming a session, from `ScormSession.cmi`. */
  initialLessonStatus?: ScormLessonStatus;
  initialSuspendData?: string;
  initialLessonLocation?: string;
  initialScoreRaw?: number | null;
  initialScoreMax?: number | null;
  onCommit: (
    snapshot: ScormCmiCommit,
    keepalive?: boolean
  ) => void;
};

function nonEmpty(...values: Array<unknown>): string {
  for (const v of values) {
    if (typeof v === "string" && v.trim() !== "") {
      return v;
    }
    if (typeof v === "number" && Number.isFinite(v)) {
      return String(v);
    }
  }
  return "";
}

function pickBestLocation(a: string, b: string): string {
  if (!a) return b;
  if (!b) return a;
  const numA = Number(a);
  const numB = Number(b);
  if (Number.isFinite(numA) && Number.isFinite(numB)) {
    return String(Math.max(numA, numB));
  }
  return a || b;
}

function pickBestSuspendData(backendRaw: string, localRaw: string): string {
  if (!backendRaw) return localRaw;
  if (!localRaw) return backendRaw;
  try {
    const bObj = JSON.parse(backendRaw) as { visited?: unknown[]; maxCur?: number };
    const lObj = JSON.parse(localRaw) as { visited?: unknown[]; maxCur?: number };
    const bVis = Array.isArray(bObj?.visited) ? bObj.visited.length : 0;
    const lVis = Array.isArray(lObj?.visited) ? lObj.visited.length : 0;
    const bMax = typeof bObj?.maxCur === "number" ? bObj.maxCur : -1;
    const lMax = typeof lObj?.maxCur === "number" ? lObj.maxCur : -1;
    if (lVis > bVis || lMax > bMax) {
      return localRaw;
    }
  } catch {
    if (localRaw.length > backendRaw.length) {
      return localRaw;
    }
  }
  return backendRaw;
}

/**
 * Builds the initial in-memory CMI data store, hydrating default values
 * for both SCORM 2004 and SCORM 1.2 data models, merging persisted state
 * from GET /player/scorm/{sessionId} (session.cmi), and falling back to localStorage.
 */
export function buildInitialCmiStore(
  options: ScormRuntimeOptions
): Record<string, string> {
  const { learnerId, learnerName, session } = options;
  const cmi = session?.cmi;

  // Check localStorage for client-persisted state (both per-enrollment-item and per-session)
  let localStore: Record<string, string> | null = null;
  if (typeof window !== "undefined" && session) {
    try {
      const itemKey =
        session.enrollmentId && session.itemId
          ? `elimi_scorm_cmi_item_${session.enrollmentId}_${session.itemId}`
          : null;
      const sessionKey = session.sessionId
        ? `elimi_scorm_cmi_${session.sessionId}`
        : null;
      const rawItem = itemKey ? localStorage.getItem(itemKey) : null;
      const rawSession = sessionKey ? localStorage.getItem(sessionKey) : null;
      const parsedItem = rawItem
        ? (JSON.parse(rawItem) as Record<string, string>)
        : null;
      const parsedSession = rawSession
        ? (JSON.parse(rawSession) as Record<string, string>)
        : null;
      if (parsedItem || parsedSession) {
        localStore = { ...(parsedItem ?? {}), ...(parsedSession ?? {}) };
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }

  // Support both camelCase and snake_case properties from backend
  const cmiObj = cmi as (Record<string, unknown> | undefined);

  const backendSuspendData = nonEmpty(
    cmiObj?.suspendData,
    cmiObj?.suspend_data,
    cmiObj?.["cmi.suspend_data"]
  );
  const localSuspendData = nonEmpty(
    localStore?.["cmi.suspend_data"],
    options.initialSuspendData
  );
  const suspendData = pickBestSuspendData(backendSuspendData, localSuspendData);

  const backendLocation = nonEmpty(
    cmiObj?.location,
    cmiObj?.lesson_location,
    cmiObj?.["cmi.location"],
    cmiObj?.["cmi.core.lesson_location"]
  );
  const localLocation = nonEmpty(
    localStore?.["cmi.location"],
    localStore?.["cmi.core.lesson_location"],
    options.initialLessonLocation
  );
  const location = pickBestLocation(backendLocation, localLocation);

  const backendStatus = nonEmpty(
    cmiObj?.lessonStatus,
    cmiObj?.lesson_status,
    cmiObj?.["cmi.core.lesson_status"],
    cmiObj?.["cmi.completion_status"]
  ) as ScormLessonStatus | "";
  const localStatus = nonEmpty(
    localStore?.["cmi.core.lesson_status"],
    localStore?.["cmi.completion_status"],
    options.initialLessonStatus
  ) as ScormLessonStatus | "";

  const lessonStatus: ScormLessonStatus | undefined =
    backendStatus === "passed" || localStatus === "passed"
      ? "passed"
      : backendStatus === "completed" || localStatus === "completed"
        ? "completed"
        : (backendStatus || localStatus || undefined);

  const backendScoreRaw = nonEmpty(
    cmiObj?.scoreRaw,
    cmiObj?.score_raw,
    cmiObj?.["cmi.score.raw"],
    cmiObj?.["cmi.core.score.raw"]
  );
  const localScoreRaw = nonEmpty(
    localStore?.["cmi.score.raw"],
    localStore?.["cmi.core.score.raw"],
    options.initialScoreRaw
  );
  const scoreRaw =
    backendScoreRaw !== "" && localScoreRaw !== ""
      ? String(Math.max(Number(backendScoreRaw), Number(localScoreRaw)))
      : backendScoreRaw || localScoreRaw || null;

  const scoreMax =
    nonEmpty(
      cmiObj?.scoreMax,
      cmiObj?.score_max,
      cmiObj?.["cmi.score.max"],
      cmiObj?.["cmi.core.score.max"],
      localStore?.["cmi.score.max"],
      localStore?.["cmi.core.score.max"],
      options.initialScoreMax
    ) || "100";

  const sessionTime = nonEmpty(
    cmiObj?.sessionTime,
    cmiObj?.session_time,
    cmiObj?.["cmi.session_time"],
    cmiObj?.["cmi.core.session_time"],
    localStore?.["cmi.session_time"],
    localStore?.["cmi.core.session_time"]
  );

  const isResume = Boolean(
    cmi != null ||
      localStore != null ||
      suspendData ||
      location ||
      lessonStatus
  );

  const store: Record<string, string> = {
    // ----------------------------------------------------
    // SCORM 2004 (API_1484_11) default data model
    // ----------------------------------------------------
    "cmi._version": "1.0",
    "cmi.learner_id": learnerId,
    "cmi.learner_name": learnerName,
    "cmi.credit": "credit",
    "cmi.entry": isResume ? "resume" : "ab-initio",
    "cmi.mode": "normal",
    "cmi.scaled_passing_score": "0.7",
    "cmi.total_time": "PT0H0M0S",
    "cmi.completion_status": "incomplete",
    "cmi.success_status": "unknown",
    "cmi.suspend_data": suspendData,
    "cmi.location": location,
    "cmi.session_time": sessionTime || "PT0H0M0S",
    "cmi.exit": "",
    "cmi.score.raw": scoreRaw !== undefined && scoreRaw !== null ? String(scoreRaw) : "",
    "cmi.score.min": "0",
    "cmi.score.max": scoreMax !== undefined && scoreMax !== null ? String(scoreMax) : "100",
    "cmi.score.scaled": "0",

    // ----------------------------------------------------
    // SCORM 1.2 (API) default data model
    // ----------------------------------------------------
    "cmi.core._children":
      "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
    "cmi.core.student_id": learnerId,
    "cmi.core.student_name": learnerName,
    "cmi.core.credit": "credit",
    "cmi.core.entry": isResume ? "resume" : "ab-initio",
    "cmi.core.lesson_mode": "normal",
    "cmi.core.lesson_status": "not attempted",
    "cmi.core.lesson_location": location,
    "cmi.core.total_time": "0000:00:00.00",
    "cmi.core.exit": "",
    "cmi.core.session_time": sessionTime,
    "cmi.core.score.raw": scoreRaw !== undefined && scoreRaw !== null ? String(scoreRaw) : "",
    "cmi.core.score.min": "0",
    "cmi.core.score.max": scoreMax !== undefined && scoreMax !== null ? String(scoreMax) : "100",
    "cmi.launch_data": "",
    "cmi.comments": "",
    "cmi.comments_from_lms": "",
    "cmi.student_data.mastery_score": "",
    "cmi.student_data.max_time_allowed": "",
    "cmi.student_data.time_limit_action": "continue,no message",
    "cmi.student_preference.audio": "0",
    "cmi.student_preference.language": "",
    "cmi.student_preference.speed": "0",
    "cmi.student_preference.text": "0",
  };

  if (lessonStatus) {
    store["cmi.core.lesson_status"] = lessonStatus;
    if (lessonStatus === "passed") {
      store["cmi.success_status"] = "passed";
      store["cmi.completion_status"] = "completed";
    } else if (lessonStatus === "failed") {
      store["cmi.success_status"] = "failed";
      store["cmi.completion_status"] = "completed";
    } else if (lessonStatus === "completed") {
      store["cmi.completion_status"] = "completed";
      store["cmi.success_status"] = "unknown";
    } else {
      store["cmi.completion_status"] = "incomplete";
      store["cmi.success_status"] = "unknown";
    }
  }

  // Load custom properties from backend cmi.cmiStore
  const extraStore = cmiObj?.cmiStore;
  if (extraStore && typeof extraStore === "object") {
    for (const [k, v] of Object.entries(extraStore)) {
      if (v !== undefined && v !== null) {
        store[k] = String(v);
      }
    }
  }

  // Merge full localStore cache if available (excluding exit/entry state and preventing status/score/location/suspendData downgrade)
  if (localStore) {
    const isBackendCompleted =
      lessonStatus === "completed" || lessonStatus === "passed";
    for (const [k, v] of Object.entries(localStore)) {
      if (
        v === undefined ||
        v === null ||
        k === "cmi.entry" ||
        k === "cmi.core.entry" ||
        k === "cmi.exit" ||
        k === "cmi.core.exit" ||
        k === "cmi.location" ||
        k === "cmi.core.lesson_location" ||
        k === "cmi.suspend_data"
      ) {
        continue;
      }
      if (
        isBackendCompleted &&
        (k === "cmi.core.lesson_status" ||
          k === "cmi.completion_status" ||
          k === "cmi.success_status") &&
        v !== "completed" &&
        v !== "passed"
      ) {
        continue;
      }
      if (
        scoreRaw !== undefined &&
        scoreRaw !== null &&
        (k === "cmi.score.raw" || k === "cmi.core.score.raw") &&
        (v === "" || v === "0")
      ) {
        continue;
      }
      store[k] = String(v);
    }
  }

  return store;
}

/**
 * Unified SCORM Run-Time Environment supporting both:
 * - SCORM 2004 (`window.API_1484_11`): Initialize, GetValue, SetValue, Commit, Terminate, GetLastError, GetErrorString, GetDiagnostic
 * - SCORM 1.2 (`window.API`): LMSInitialize, LMSGetValue, LMSSetValue, LMSCommit, LMSFinish, LMSGetLastError, LMSGetErrorString, LMSGetDiagnostic
 */
export class ScormRuntime {
  public cmiStore: Record<string, string>;
  public isDirty = false;
  private readonly sessionId: string;
  private readonly enrollmentId: string;
  private readonly itemId: string;
  private initialized = false;
  private terminated = false;
  private lastError = "0";
  private lastKnownStatus: ScormLessonStatus = "incomplete";
  private readonly onCommit: ScormRuntimeOptions["onCommit"];
  private readonly startedAt = Date.now();
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private intervalTimer: ReturnType<typeof setInterval> | null = null;

  constructor(options: ScormRuntimeOptions) {
    this.sessionId = options.session?.sessionId ?? "";
    this.enrollmentId = options.session?.enrollmentId ?? "";
    this.itemId = options.session?.itemId ?? "";
    this.cmiStore = buildInitialCmiStore(options);
    this.onCommit = options.onCommit;

    const storeStatus = this.cmiStore["cmi.core.lesson_status"] as
      | ScormLessonStatus
      | undefined;
    const initialStatus =
      options.session?.cmi?.lessonStatus ??
      options.initialLessonStatus ??
      storeStatus;
    if (
      storeStatus === "passed" ||
      storeStatus === "completed" ||
      initialStatus === "passed" ||
      initialStatus === "completed"
    ) {
      this.lastKnownStatus =
        storeStatus === "passed" || initialStatus === "passed"
          ? "passed"
          : "completed";
    } else if (initialStatus) {
      this.lastKnownStatus = initialStatus;
    }

    // Auto-commit every 15 seconds if any field changed
    this.intervalTimer = setInterval(() => {
      if (this.isDirty && !this.terminated) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[SCORM RTE] 15s interval auto-committing dirty state");
        }
        this.persistState(true, false);
      }
    }, 15000);
  }

  // ----------------------------------------------------
  // SCORM 2004 (API_1484_11) Interface
  // ----------------------------------------------------

  Initialize(_param = ""): string {
    void _param;
    if (process.env.NODE_ENV !== "production") {
      console.log("[SCORM RTE] API_1484_11.Initialize called");
    }
    if (this.terminated) {
      this.lastError = "101";
      return FALSE;
    }
    this.initialized = true;
    this.lastError = "0";
    return TRUE;
  }

  GetValue(element: string): string {
    const val = this.cmiStore[element];
    if (val !== undefined) {
      this.lastError = "0";
      return String(val);
    }
    this.lastError = "0";
    return "";
  }

  SetValue(element: string, value: string): string {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[SCORM RTE] SetValue(${element}, ${value})`);
    }
    const strVal = String(value);

    // Status downgrade protection: once completed or passed, ignore downgrade attempts
    if (
      element === "cmi.completion_status" ||
      element === "cmi.success_status" ||
      element === "cmi.core.lesson_status"
    ) {
      if (
        this.lastKnownStatus === "completed" ||
        this.lastKnownStatus === "passed"
      ) {
        if (
          strVal === "incomplete" ||
          strVal === "not attempted" ||
          strVal === "unknown" ||
          strVal === "failed"
        ) {
          if (process.env.NODE_ENV !== "production") {
            console.log(
              `[SCORM RTE] Ignoring status downgrade for "${element}" from "${this.lastKnownStatus}" to "${strVal}"`
            );
          }
          this.lastError = "0";
          return TRUE;
        }
      }
    }

    this.cmiStore[element] = strVal;
    this.isDirty = true;
    this.lastError = "0";

    // Mirror updates across SCORM 2004 and 1.2 standards
    this.mirrorElement(element, strVal);

    // Backup to localStorage immediately so no state is lost on instant refresh
    this.backupToLocalStorage();

    // Auto-commit immediately if status transitions to completed or passed
    const isCompletion =
      (element === "cmi.completion_status" && (strVal === "completed" || strVal === "passed")) ||
      (element === "cmi.success_status" && strVal === "passed") ||
      (element === "cmi.core.lesson_status" && (strVal === "completed" || strVal === "passed"));

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (isCompletion) {
      this.persistState(true, false);
    } else {
      // Debounce auto-commit after 800ms of inactivity on ANY SetValue call
      this.debounceTimer = setTimeout(() => {
        if (this.isDirty && !this.terminated) {
          this.persistState(true, false);
        }
      }, 800);
    }

    return TRUE;
  }

  Commit(_param = ""): string {
    void _param;
    if (process.env.NODE_ENV !== "production") {
      console.log("[SCORM RTE] Commit called");
    }
    return this.persistState(true, false);
  }

  Terminate(_param = ""): string {
    void _param;
    if (process.env.NODE_ENV !== "production") {
      console.log("[SCORM RTE] Terminate called");
    }
    const res = this.persistState(false, false);
    this.terminated = true;
    return res;
  }

  GetLastError(): string {
    return this.lastError;
  }

  GetErrorString(_errorCode = ""): string {
    void _errorCode;
    return "No error";
  }

  GetDiagnostic(_errorCode = ""): string {
    void _errorCode;
    return "";
  }

  // ----------------------------------------------------
  // SCORM 1.2 (window.API) Compatibility Aliases
  // ----------------------------------------------------

  LMSInitialize(param = ""): string {
    return this.Initialize(param);
  }

  LMSFinish(param = ""): string {
    return this.Terminate(param);
  }

  LMSGetValue(element: string): string {
    return this.GetValue(element);
  }

  LMSSetValue(element: string, value: string): string {
    return this.SetValue(element, value);
  }

  LMSCommit(param = ""): string {
    return this.Commit(param);
  }

  LMSGetLastError(): string {
    return this.GetLastError();
  }

  LMSGetErrorString(errorCode = ""): string {
    return this.GetErrorString(errorCode);
  }

  LMSGetDiagnostic(errorCode = ""): string {
    return this.GetDiagnostic(errorCode);
  }

  // ----------------------------------------------------
  // State Synchronization & Persistence
  // ----------------------------------------------------

  private mirrorElement(element: string, value: string): void {
    switch (element) {
      case "cmi.completion_status":
        if (value === "completed") {
          this.cmiStore["cmi.core.lesson_status"] = "completed";
        }
        break;
      case "cmi.success_status":
        if (value === "passed") {
          this.cmiStore["cmi.core.lesson_status"] = "passed";
          this.cmiStore["cmi.completion_status"] = "completed";
        } else if (value === "failed") {
          this.cmiStore["cmi.core.lesson_status"] = "failed";
        }
        break;
      case "cmi.core.lesson_status":
        if (value === "passed") {
          this.cmiStore["cmi.success_status"] = "passed";
          this.cmiStore["cmi.completion_status"] = "completed";
        } else if (value === "completed") {
          this.cmiStore["cmi.completion_status"] = "completed";
        } else if (value === "failed") {
          this.cmiStore["cmi.success_status"] = "failed";
        } else if (value === "incomplete") {
          this.cmiStore["cmi.completion_status"] = "incomplete";
        }
        break;
      case "cmi.location":
        this.cmiStore["cmi.core.lesson_location"] = value;
        break;
      case "cmi.core.lesson_location":
        this.cmiStore["cmi.location"] = value;
        break;
      case "cmi.score.raw":
        this.cmiStore["cmi.core.score.raw"] = value;
        break;
      case "cmi.core.score.raw":
        this.cmiStore["cmi.score.raw"] = value;
        break;
      case "cmi.score.max":
        this.cmiStore["cmi.core.score.max"] = value;
        break;
      case "cmi.core.score.max":
        this.cmiStore["cmi.score.max"] = value;
        break;
      case "cmi.score.min":
        this.cmiStore["cmi.core.score.min"] = value;
        break;
      case "cmi.core.score.min":
        this.cmiStore["cmi.score.min"] = value;
        break;
      case "cmi.session_time":
        this.cmiStore["cmi.core.session_time"] = value;
        break;
      case "cmi.core.session_time":
        this.cmiStore["cmi.session_time"] = value;
        break;
    }
  }

  private backupToLocalStorage(): void {
    if (typeof window !== "undefined") {
      try {
        const serialized = JSON.stringify(this.cmiStore);
        if (this.sessionId) {
          localStorage.setItem(`elimi_scorm_cmi_${this.sessionId}`, serialized);
        }
        if (this.enrollmentId && this.itemId) {
          localStorage.setItem(
            `elimi_scorm_cmi_item_${this.enrollmentId}_${this.itemId}`,
            serialized
          );
        }
      } catch {
        // Ignore quota errors
      }
    }
  }

  /**
   * Persists current session data to POST /player/scorm/{sessionId}/cmi.
   */
  persistState(isCommit = true, keepalive = false): string {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    let status: ScormLessonStatus = "incomplete";
    const successStatus = this.cmiStore["cmi.success_status"];
    const completionStatus = this.cmiStore["cmi.completion_status"];
    const status12 = this.cmiStore["cmi.core.lesson_status"];

    if (successStatus === "passed" || status12 === "passed") {
      status = "passed";
    } else if (successStatus === "failed" || status12 === "failed") {
      status = "failed";
    } else if (
      completionStatus === "completed" ||
      status12 === "completed" ||
      status12 === "browsed"
    ) {
      status = "completed";
    } else if (completionStatus === "incomplete" || status12 === "incomplete") {
      status = "incomplete";
    }

    // Downgrade protection
    if (
      (this.lastKnownStatus === "completed" || this.lastKnownStatus === "passed") &&
      (status === "incomplete" || status === "failed")
    ) {
      status = this.lastKnownStatus;
    }
    this.lastKnownStatus = status;

    const rawScore = this.cmiStore["cmi.score.raw"] ?? this.cmiStore["cmi.core.score.raw"];
    const maxScore = this.cmiStore["cmi.score.max"] ?? this.cmiStore["cmi.core.score.max"];

    const scoreRawNum = rawScore !== undefined && rawScore !== "" ? Number(rawScore) : null;
    const scoreMaxNum = maxScore !== undefined && maxScore !== "" ? Number(maxScore) : null;

    let sessionTime = this.cmiStore["cmi.core.session_time"] || "";
    if (!sessionTime || sessionTime.startsWith("PT")) {
      const raw2004 = this.cmiStore["cmi.session_time"];
      if (raw2004 && !raw2004.startsWith("PT")) {
        sessionTime = raw2004;
      } else {
        sessionTime = elapsedScormTime(this.startedAt);
      }
    }

    const suspendData = this.cmiStore["cmi.suspend_data"] ?? "";
    const location =
      this.cmiStore["cmi.location"] ?? this.cmiStore["cmi.core.lesson_location"] ?? "";

    // Strictly conforms to the ScormCmiCommit contract (SCORM 1.2 backend endpoint)
    const snapshot: ScormCmiCommit = {
      lessonStatus: status,
      scoreRaw: Number.isFinite(scoreRawNum) ? scoreRawNum : null,
      scoreMax: Number.isFinite(scoreMaxNum) ? scoreMaxNum : null,
      sessionTime,
      suspendData,
      location,
    };

    this.isDirty = false;
    this.backupToLocalStorage();

    if (process.env.NODE_ENV !== "production") {
      console.log("[SCORM RTE] persistState committing snapshot:", snapshot, {
        isCommit,
        keepalive,
      });
    }

    this.onCommit(snapshot, keepalive);
    return TRUE;
  }

  flush(keepalive = true): void {
    if (this.isDirty && !this.terminated) {
      this.persistState(false, keepalive);
    }
  }

  destroy(keepalive = true): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.isDirty && !this.terminated) {
      this.persistState(false, keepalive);
    }
    this.terminated = true;
  }
}

function elapsedScormTime(startedAt: number): string {
  const totalSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(4, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.00`;
}
