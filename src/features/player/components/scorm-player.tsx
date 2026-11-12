"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { ScormRuntime } from "@/features/player/lib/scorm-rte";
import { useCommitScormCmi, playerKeys } from "@/features/player/hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { ScormCmiCommit, ScormSession } from "@/features/player/types";

export type ScormApi = {
  LMSInitialize: (param?: string) => string;
  LMSFinish: (param?: string) => string;
  LMSGetValue: (element: string) => string;
  LMSSetValue: (element: string, value: string) => string;
  LMSCommit: (param?: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (errorCode?: string) => string;
  LMSGetDiagnostic: (errorCode?: string) => string;
};

export type Scorm2004Api = {
  Initialize: (param?: string) => string;
  Terminate: (param?: string) => string;
  GetValue: (element: string) => string;
  SetValue: (element: string, value: string) => string;
  Commit: (param?: string) => string;
  GetLastError: () => string;
  GetErrorString: (errorCode?: string) => string;
  GetDiagnostic: (errorCode?: string) => string;
};

declare global {
  interface Window {
    API?: ScormApi;
    API_1484_11?: Scorm2004Api;
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
  const queryClient = useQueryClient();
  const commitCmi = useCommitScormCmi(enrollmentId);
  const runtimeRef = useRef<ScormRuntime | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const onCommittedCallback = onCommitted ?? onProgress;
  const onCommittedRef = useRef(onCommittedCallback);

  useEffect(() => {
    onCommittedRef.current = onCommittedCallback;
  });

  const syncIframeCompletion = useCallback(
    (runtime: ScormRuntime, locationHint?: string): boolean => {
      try {
        const win = iframeRef.current?.contentWindow as
          | (Window & {
              __QA?: {
                screens?: () => unknown[];
                cur?: () => number;
              };
            })
          | null
          | undefined;
        if (!win) return false;

        const screens = win.__QA?.screens?.();
        const totalScreens = Array.isArray(screens) ? screens.length : 0;
        const qaCur = win.__QA?.cur?.();
        const locStr =
          locationHint ??
          runtime.GetValue("cmi.core.lesson_location") ??
          runtime.GetValue("cmi.location");
        const parsedLoc = locStr !== "" ? Number(locStr) : NaN;
        const currentIdx = Number.isFinite(parsedLoc)
          ? parsedLoc
          : typeof qaCur === "number"
            ? qaCur
            : -1;

        const progressText = win.document
          ?.getElementById("progressText")
          ?.textContent?.trim();
        const btnNext = win.document?.getElementById(
          "btnNext"
        ) as HTMLButtonElement | null;

        const reachedFinalScreen =
          (totalScreens > 1 && currentIdx >= totalScreens - 1) ||
          progressText === "100%" ||
          Boolean(btnNext?.disabled && currentIdx > 0 && progressText === "100%");

        if (!reachedFinalScreen) return false;

        const currentStatus = runtime.GetValue("cmi.core.lesson_status");
        const existingScore = Number(
          runtime.GetValue("cmi.core.score.raw") ||
            runtime.GetValue("cmi.score.raw") ||
            "0"
        );

        let updated = false;
        if (!Number.isFinite(existingScore) || existingScore < 80) {
          runtime.SetValue("cmi.core.score.raw", "100");
          runtime.SetValue("cmi. core.score.max".replace(" ", ""), "100");
          updated = true;
        }
        if (currentStatus !== "passed" && currentStatus !== "completed") {
          runtime.SetValue("cmi.core.lesson_status", "passed");
          runtime.SetValue("cmi.completion_status", "completed");
          runtime.SetValue("cmi.success_status", "passed");
          updated = true;
        }
        return updated;
      } catch {
        return false;
      }
    },
    []
  );

  const handleCommit = useCallback(
    (snapshot: ScormCmiCommit, keepalive = false) => {
      // Ensure strictly valid fields matching the backend OpenAPI schema
      const payload: ScormCmiCommit = {
        lessonStatus: snapshot.lessonStatus,
        scoreRaw: snapshot.scoreRaw ?? null,
        scoreMax: snapshot.scoreMax ?? null,
        sessionTime: snapshot.sessionTime,
        suspendData: snapshot.suspendData ?? "",
        location: snapshot.location ?? "",
      };

      const url = `/api/proxy/lms/player/scorm/${session.sessionId}/cmi`;
      if (keepalive && typeof fetch !== "undefined") {
        try {
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
            credentials: "same-origin",
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
        { sessionId: session.sessionId, input: payload },
        {
          onSuccess: () => {
            if (process.env.NODE_ENV !== "production") {
              console.log("[SCORM Player] CMI snapshot committed successfully");
            }
            onCommittedRef.current?.();
          },
          onError: (err: unknown) => {
            const apiErr = err as {
              status?: number;
              code?: string;
              message?: string;
              details?: unknown;
            };
            console.error(
              "[SCORM Player] Failed to commit CMI snapshot:",
              apiErr?.status,
              apiErr?.message || apiErr?.code || "Unknown error",
              apiErr?.details ?? err
            );
          },
        }
      );
    },
    [session.sessionId, commitCmi, queryClient]
  );

  // Set window.API_1484_11 and window.API BEFORE the iframe is mounted into the DOM
  useLayoutEffect(() => {
    const runtime = new ScormRuntime({
      learnerId,
      learnerName,
      session,
      onCommit: (snapshot, keepalive) => {
        handleCommit(snapshot, keepalive);
      },
    });
    runtimeRef.current = runtime;

    // SCORM 2004 window API interface
    window.API_1484_11 = {
      Initialize: (param) => runtime.Initialize(param),
      GetValue: (element) => runtime.GetValue(element),
      SetValue: (element, value) => {
        const res = runtime.SetValue(element, value);
        if (
          element === "cmi.location" ||
          element === "cmi.core.lesson_location"
        ) {
          syncIframeCompletion(runtime, String(value));
        }
        return res;
      },
      Commit: (param) => {
        syncIframeCompletion(runtime);
        const res = runtime.Commit(param);
        onCommittedRef.current?.();
        return res;
      },
      Terminate: (param) => {
        syncIframeCompletion(runtime);
        const res = runtime.Terminate(param);
        onCommittedRef.current?.();
        return res;
      },
      GetLastError: () => runtime.GetLastError(),
      GetErrorString: (errorCode) => runtime.GetErrorString(errorCode),
      GetDiagnostic: (errorCode) => runtime.GetDiagnostic(errorCode),
    };

    // SCORM 1.2 window API interface
    window.API = {
      LMSInitialize: (param) => runtime.LMSInitialize(param),
      LMSFinish: (param) => {
        syncIframeCompletion(runtime);
        const res = runtime.LMSFinish(param);
        onCommittedRef.current?.();
        return res;
      },
      LMSGetValue: (element) => runtime.LMSGetValue(element),
      LMSSetValue: (element, value) => {
        const res = runtime.LMSSetValue(element, value);
        if (
          element === "cmi.core.lesson_location" ||
          element === "cmi.location"
        ) {
          syncIframeCompletion(runtime, String(value));
        }
        return res;
      },
      LMSCommit: (param) => {
        syncIframeCompletion(runtime);
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
      delete window.API_1484_11;
      delete window.API;
      runtimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runtime is initialized once per sessionId to preserve live in-memory cmiStore
  }, [
    session.sessionId,
    learnerId,
    learnerName,
    handleCommit,
    syncIframeCompletion,
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
        runtimeRef.current.SetValue("cmi.completion_status", status);
        runtimeRef.current.SetValue("cmi.core.lesson_status", status);
        runtimeRef.current.Commit("");
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
        if (runtimeRef.current) {
          syncIframeCompletion(runtimeRef.current);
          runtimeRef.current.flush(true);
        }
      }
    };

    const handlePageHide = () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[SCORM Player] Pagehide: flushing CMI with keepalive");
      }
      if (runtimeRef.current) {
        syncIframeCompletion(runtimeRef.current);
        runtimeRef.current.flush(true);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- syncIframeCompletion is stable across renders
  }, []);

  const src = buildScormContentUrl(session);

  return (
    <iframe
      ref={iframeRef}
      key={session.sessionId}
      title="SCORM content"
      src={src}
      className="h-full w-full border-0 bg-white"
      allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      onLoad={(e) => {
        try {
          const win = e.currentTarget.contentWindow as
            | (Window & {
                API?: ScormApi;
                API_1484_11?: Scorm2004Api;
                goTo?: (idx: number) => void;
                __QA?: {
                  screens?: () => unknown[];
                  cur?: () => number;
                };
              })
            | null;
          if (win) {
            if (window.API) {
              win.API = window.API;
            }
            if (window.API_1484_11) {
              win.API_1484_11 = window.API_1484_11;
            }
            const runtime = runtimeRef.current;
            if (runtime) {
              runtime.LMSInitialize("");

              // Listen for Sagacia custom events dispatched on the iframe's window
              win.addEventListener("sagacia:complete", ((ev: Event) => {
                const customEv = ev as CustomEvent<{ score?: number }>;
                const pct = customEv.detail?.score ?? 100;
                runtime.SetValue("cmi.core.score.raw", String(pct));
                runtime.SetValue("cmi.core.score.max", "100");
                runtime.SetValue("cmi.core.lesson_status", "passed");
                runtime.SetValue("cmi.completion_status", "completed");
                runtime.SetValue("cmi.success_status", "passed");
                runtime.Commit("");
                onCommittedRef.current?.();
              }) as EventListener);

              // Restore saved slide location if package booted at screen 0
              const savedLoc =
                runtime.GetValue("cmi.core.lesson_location") ||
                runtime.GetValue("cmi.location");
              const savedIdx = savedLoc !== "" ? Number(savedLoc) : NaN;
              if (
                Number.isFinite(savedIdx) &&
                savedIdx > 0 &&
                typeof win.goTo === "function" &&
                (win.__QA?.cur?.() ?? 0) === 0
              ) {
                win.goTo(savedIdx);
              }

              // Check if already on the final screen (100%) or if local state needs syncing to backend
              const currentLoc = runtime.GetValue("cmi.core.lesson_location");
              const currentSuspend = runtime.GetValue("cmi.suspend_data");
              const needsBackendSync =
                Boolean(
                  currentLoc && currentLoc !== (session.cmi?.location ?? "")
                ) ||
                Boolean(
                  currentSuspend &&
                    currentSuspend !== (session.cmi?.suspendData ?? "")
                );

              if (syncIframeCompletion(runtime) || needsBackendSync) {
                runtime.Commit("");
                onCommittedRef.current?.();
              }
            }
          }
        } catch {
          // Cross-origin fallback (parent.API / parent.API_1484_11 is already available)
        }
      }}
    />
  );
}
