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

function buildPlayerSrc(session: ScormSession): string {
  return `/api/proxy/lms/player/scorm/${session.sessionId}/player`;
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
      initialLessonStatus: session.cmi?.lessonStatus,
      initialSuspendData: session.cmi?.suspendData,
      initialLessonLocation: session.cmi?.location,
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
  }, [session.sessionId]);

  const src = buildPlayerSrc(session);

  return (
    <iframe
      key={session.sessionId}
      title="SCORM content"
      src={src}
      className="h-full w-full min-h-150 border-0 rounded-xl"
      allow="fullscreen; autoplay"
    />
  );
}
