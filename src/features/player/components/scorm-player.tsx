"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { ScormRuntime } from "@/features/player/lib/scorm-rte";
import { useCommitScormCmi } from "@/features/player/hooks";
import type { ScormCmiCommit, ScormSession } from "@/features/player/types";

type ScormApi = {
  LMSInitialize: (param: string) => string;
  LMSFinish: (param: string) => string;
  LMSGetValue: (element: string) => string;
  LMSSetValue: (element: string, value: string) => string;
  LMSCommit: (param: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (errorCode: string) => string;
  LMSGetDiagnostic: (errorCode: string) => string;
};

declare global {
  interface Window {
    API?: ScormApi;
  }
}

export type ScormPlayerProps = {
  enrollmentId: string;
  session: ScormSession;
  learnerId: string;
  learnerName: string;
  onProgress?: () => void;
  onCommitted?: () => void;
};

export function buildScormContentUrl(session: ScormSession): string {
  // 1. Extract content token (ct) from playerUrl
  let ct = "";
  if (session.playerUrl) {
    const match = session.playerUrl.match(/[?&]ct=([^&#]+)/);
    if (match) {
      ct = decodeURIComponent(match[1]);
    }
  }

  // 2. Base content path via our proxy (ensures same-origin with parent window)
  const baseProxyContent = `/api/proxy/lms/player/scorm/${session.sessionId}/content`;

  // 3. Resolve the SCO entry file path:
  // The spec describes contentBaseUrl two ways:
  // Option A: ends in /content (scoHref contains the file, e.g. "index.html")
  // Option B: ends in /content/{scoHref} (already has the entry file)
  let subPath = "";
  if (session.contentBaseUrl) {
    const match = session.contentBaseUrl.match(/\/player\/scorm\/[^/]+\/content\/(.+)$/);
    if (match && match[1]) {
      subPath = match[1];
    }
  }

  if (!subPath && session.scoHref) {
    subPath = session.scoHref.replace(/^\.?\//, "");
  }

  if (!subPath) {
    subPath = "index.html";
  }

  let finalUrl = `${baseProxyContent}/${subPath}`;
  if (ct) {
    finalUrl += `?ct=${encodeURIComponent(ct)}`;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[SCORM Player] Direct SCO URL configured:", {
      sessionId: session.sessionId,
      contentBaseUrl: session.contentBaseUrl,
      scoHref: session.scoHref,
      playerUrl: session.playerUrl,
      tokenExtracted: Boolean(ct),
      finalUrl,
    });
  }

  return finalUrl;
}

export function ScormPlayer({
  enrollmentId,
  session,
  learnerId,
  learnerName,
  onProgress,
  onCommitted,
}: ScormPlayerProps) {
  const commitCmi = useCommitScormCmi(enrollmentId);
  const runtimeRef = useRef<ScormRuntime | null>(null);
  const onCommittedCallback = onCommitted ?? onProgress;
  const onCommittedRef = useRef(onCommittedCallback);

  useEffect(() => {
    onCommittedRef.current = onCommittedCallback;
  });

  const handleCommit = useCallback(
    (snapshot: ScormCmiCommit, keepalive = false) => {
      const url = `/api/proxy/lms/player/scorm/${session.sessionId}/cmi`;
      if (keepalive && typeof fetch !== "undefined") {
        try {
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(snapshot),
            keepalive: true,
          }).catch((err) => {
            console.error("[SCORM Player] keepalive commit error:", err);
          });
          onCommittedRef.current?.();
          return;
        } catch (err) {
          console.error("[SCORM Player] keepalive commit failed:", err);
        }
      }

      commitCmi.mutate(
        { sessionId: session.sessionId, input: snapshot },
        {
          onSuccess: () => {
            if (process.env.NODE_ENV !== "production") {
              console.log("[SCORM Player] CMI snapshot committed successfully");
            }
            onCommittedRef.current?.();
          },
          onError: (err) => {
            console.error("[SCORM Player] Failed to commit CMI snapshot:", err);
          },
        }
      );
    },
    [session.sessionId, commitCmi]
  );

  // Set window.API before the iframe content executes scripts
  useLayoutEffect(() => {
    const runtime = new ScormRuntime({
      learnerId,
      learnerName,
      initialLessonStatus: session.cmi?.lessonStatus,
      initialSuspendData: session.cmi?.suspendData,
      initialLessonLocation: session.cmi?.location,
      initialScoreRaw: session.cmi?.scoreRaw,
      initialScoreMax: session.cmi?.scoreMax,
      onCommit: (snapshot, keepalive) => {
        handleCommit(snapshot, keepalive);
      },
    });
    runtimeRef.current = runtime;

    window.API = {
      LMSInitialize: (param) => runtime.LMSInitialize(param),
      LMSFinish: (param) => {
        const res = runtime.LMSFinish(param);
        onCommittedRef.current?.();
        return res;
      },
      LMSGetValue: (element) => runtime.LMSGetValue(element),
      LMSSetValue: (element, value) => runtime.LMSSetValue(element, value),
      LMSCommit: (param) => {
        const res = runtime.LMSCommit(param);
        onCommittedRef.current?.();
        return res;
      },
      LMSGetLastError: () => runtime.LMSGetLastError(),
      LMSGetErrorString: (errorCode) => runtime.LMSGetErrorString(errorCode),
      LMSGetDiagnostic: (errorCode) => runtime.LMSGetDiagnostic(errorCode),
    };

    return () => {
      runtime.destroy(true);
      delete window.API;
      runtimeRef.current = null;
    };
  }, [
    session.sessionId,
    session.cmi?.lessonStatus,
    session.cmi?.suspendData,
    session.cmi?.location,
    session.cmi?.scoreRaw,
    session.cmi?.scoreMax,
    learnerId,
    learnerName,
    handleCommit,
  ]);

  // Handle postMessages from SCORM iframe (e.g. custom completion events)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;
      const isCompletion =
        data === "cmi_commit" ||
        data === "cmi_finish" ||
        data.type === "cmi_commit" ||
        data.type === "scorm_commit" ||
        data.type === "completed" ||
        data.lessonStatus === "completed" ||
        data.lessonStatus === "passed" ||
        data.status === "completed" ||
        data.status === "passed" ||
        data.progress === 100 ||
        data.percent === 100 ||
        data.percentComplete === 100;

      if (isCompletion && runtimeRef.current) {
        const status =
          (typeof data === "object" && (data.lessonStatus || data.status)) ||
          "completed";
        runtimeRef.current.LMSSetValue("cmi.core.lesson_status", status);
        runtimeRef.current.LMSCommit("");
        onCommittedRef.current?.();
      }
    };
    window.addEventListener("message", handleMessage);

    // Commit when tab hides or page closes so progress survives tab close/refresh
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (process.env.NODE_ENV !== "production") {
          console.log("[SCORM Player] Tab hidden: flushing CMI with keepalive");
        }
        runtimeRef.current?.commit(true);
      }
    };

    const handlePageHide = () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[SCORM Player] Pagehide: flushing CMI with keepalive");
      }
      runtimeRef.current?.commit(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, []);

  const src = buildScormContentUrl(session);

  return (
    <iframe
      key={session.sessionId}
      title="SCORM content"
      src={src}
      className="h-full w-full border-0 bg-white"
      allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      onLoad={(e) => {
        try {
          const win = e.currentTarget.contentWindow;
          if (win && window.API) {
            (win as unknown as { API?: ScormApi }).API = window.API;
          }
        } catch {
          // Cross-origin fallback (parent.API is already available)
        }
      }}
    />
  );
}
