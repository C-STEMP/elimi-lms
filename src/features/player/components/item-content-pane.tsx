"use client";

import React, { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { useToast } from "@/shared/components/ui/toast";
import { useLaunchItem, useRecordItemProgress, useScormSession } from "@/features/player/hooks";
import { ScormPlayer } from "@/features/player/components/scorm-player";
import { QuizRunner } from "@/features/player/components/quiz-runner";
import type { CourseOutlineItem } from "@/features/courses/types";

export interface ItemContentPaneProps {
  enrollmentId: string;
  item: CourseOutlineItem;
  learnerId: string;
  learnerName: string;
  onProgress: () => void;
}

export const ItemContentPane: React.FC<ItemContentPaneProps> = ({
  enrollmentId,
  item,
  learnerId,
  learnerName,
  onProgress,
}) => {
  const { toast } = useToast();
  const isCompleted = item.progressStatus === "completed";
  const [launchUrl, setLaunchUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [markedComplete, setMarkedComplete] = useState(isCompleted);

  const { mutate: launchItem, isPending: isLaunching } = useLaunchItem(enrollmentId);
  const { mutate: recordProgress, isPending: isMarking } = useRecordItemProgress(enrollmentId);
  const { data: scormSession, isLoading: isLoadingSession } = useScormSession(sessionId ?? "");

  useEffect(() => {
    // Resetting local view state for the newly selected item, not re-derivable during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLaunchUrl(null);
    setSessionId(null);
    setMarkedComplete(isCompleted);

    if (item.type === "quiz") return;

    launchItem(item.id, {
      onSuccess: (launch) => {
        if (launch.type === "scorm_package") {
          setSessionId(launch.sessionId ?? null);
        } else {
          setLaunchUrl(launch.launchUrl ?? null);
        }
      },
      onError: () => {
        toast({
          type: "error",
          title: "Couldn't Load Content",
          description: "Unable to open this item right now. Please try again.",
        });
      },
    });
    // Re-launch whenever the selected item changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.type]);

  const handleMarkComplete = () => {
    recordProgress(
      { itemId: item.id, input: { status: "completed" } },
      {
        onSuccess: () => {
          setMarkedComplete(true);
          toast({ type: "success", title: "Item Complete", description: "Nice work — moving on." });
          onProgress();
        },
        onError: (error) => {
          if (error.code === "lms.sequencing.locked") {
            toast({
              type: "error",
              title: "Locked",
              description: "Complete the previous item first.",
            });
            return;
          }
          toast({
            type: "error",
            title: "Couldn't Save Progress",
            description: error.message || "Please try again.",
          });
        },
      }
    );
  };

  if (item.type === "quiz") {
    return <QuizRunner enrollmentId={enrollmentId} itemId={item.id} onProgress={onProgress} />;
  }

  if (item.type === "scorm_package") {
    if (isLaunching || (sessionId && isLoadingSession) || !scormSession) {
      return <InlineSpinner className="h-full" />;
    }
    return (
      <div className="h-full min-h-125 flex flex-col">
        <ScormPlayer
          enrollmentId={enrollmentId}
          session={scormSession}
          learnerId={learnerId}
          learnerName={learnerName}
        />
      </div>
    );
  }

  if (isLaunching || !launchUrl) {
    return <InlineSpinner className="h-full" />;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 min-h-100 rounded-xl overflow-hidden bg-black/5">
        {item.type === "video" ? (
          <video src={launchUrl} controls className="w-full h-full" />
        ) : (
          <iframe title={item.title} src={launchUrl} className="w-full h-full min-h-100 border-0" />
        )}
      </div>

      <Button
        type="button"
        variant={markedComplete ? "outline" : "secondary"}
        size="md"
        loading={isMarking}
        disabled={markedComplete}
        leftIcon={markedComplete ? <FiCheckCircle className="w-4 h-4" /> : undefined}
        onClick={handleMarkComplete}
        className="self-start"
      >
        {markedComplete ? "Completed" : "Mark as Complete"}
      </Button>
    </div>
  );
};
