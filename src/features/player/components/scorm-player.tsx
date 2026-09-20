"use client";

import { useEffect, useRef } from "react";
import { ScormRuntime } from "@/features/player/lib/scorm-rte";
import { useCommitScormCmi } from "@/features/player/hooks";
import type { ScormSession } from "@/features/player/types";

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
};

/**
 * Hosts a SCORM 1.2 SCO in an iframe and exposes `window.API` for it to call.
 *
 * A SCO finds the API by walking `window` then `window.parent`/`window.opener`
 * looking for an object with `LMSInitialize`. That walk only crosses the
 * iframe boundary if the iframe is same-origin with this page — if the LMS
 * player serves extracted packages from a different host than the frontend,
 * this needs a same-origin proxy (e.g. a Next.js rewrite) in front of the
 * player URL, or the SCO's API discovery will fail silently.
 */
function toProxiedUrl(url: string): string {
  if (typeof window === "undefined" || !url) return url;
  try {
    const target = new URL(url, window.location.href);
    if (target.origin !== window.location.origin) {
      return `/scorm-proxy${target.pathname}${target.search}${target.hash}`;
    }
  } catch {
    // Keep original URL if parsing fails
  }
  return url;
}

export function ScormPlayer({
  enrollmentId,
  session,
  learnerId,
  learnerName,
}: ScormPlayerProps) {
  const commitCmi = useCommitScormCmi(enrollmentId);
  const runtimeRef = useRef<ScormRuntime | null>(null);

  useEffect(() => {
    const runtime = new ScormRuntime({
      learnerId,
      learnerName,
      onCommit: (snapshot) => {
        commitCmi.mutate({ sessionId: session.sessionId, input: snapshot });
      },
    });
    runtimeRef.current = runtime;

    window.API = {
      LMSInitialize: (param) => runtime.LMSInitialize(param),
      LMSFinish: (param) => runtime.LMSFinish(param),
      LMSGetValue: (element) => runtime.LMSGetValue(element),
      LMSSetValue: (element, value) => runtime.LMSSetValue(element, value),
      LMSCommit: (param) => runtime.LMSCommit(param),
      LMSGetLastError: () => runtime.LMSGetLastError(),
      LMSGetErrorString: (errorCode) => runtime.LMSGetErrorString(errorCode),
      LMSGetDiagnostic: (errorCode) => runtime.LMSGetDiagnostic(errorCode),
    };

    return () => {
      runtime.LMSFinish("");
      delete window.API;
      runtimeRef.current = null;
    };
    // Re-running for a new session (new sessionId) is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.sessionId]);

  return (
    <iframe
      title="SCORM content"
      src={toProxiedUrl(session.launchUrl)}
      className="h-full w-full border-0"
      allow="fullscreen"
    />
  );
}
