"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiLock,
  FiMaximize2,
  FiMinimize2,
  FiSidebar,
} from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { useToast } from "@/shared/components/ui/toast";
import {
  useItemLaunch,
  useScormSession,
} from "@/features/player/hooks";
import { ScormPlayer } from "@/features/player/components/scorm-player";
import { QuizRunner } from "@/features/player/components/quiz-runner";
import type { CourseOutlineItem } from "@/features/courses/types";

export interface ItemContentPaneProps {
  enrollmentId: string;
  item: CourseOutlineItem;
  learnerId: string;
  learnerName: string;
  onProgress: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  previousTitle?: string;
  nextTitle?: string;
  isNextLocked?: boolean;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const ItemContentPane: React.FC<ItemContentPaneProps> = ({
  enrollmentId,
  item,
  learnerId,
  learnerName,
  onProgress,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  previousTitle,
  nextTitle,
  isNextLocked,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const { toast } = useToast();
  const stageRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const shouldLaunch = item.type !== "quiz";
  const {
    data: launch,
    isLoading: isLaunching,
    isError: isLaunchError,
  } = useItemLaunch(enrollmentId, item.id, shouldLaunch);

  const sessionId =
    launch?.type === "scorm_package" ? launch.sessionId ?? null : null;
  const launchUrl = launch?.launchUrl ?? null;

  const { data: scormSession, isLoading: isLoadingSession } = useScormSession(
    sessionId ?? "",
  );

  useEffect(() => {
    if (isLaunchError) {
      toast({
        type: "error",
        title: "Couldn't Load Content",
        description: "Unable to open this item right now. Please try again.",
      });
    }
  }, [isLaunchError, toast]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen().catch(() => {
        // Fallback or ignore
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (item.type === "quiz") {
    return (
      <div className="flex flex-col w-full">
        <div className="px-4 sm:px-6 py-3.5 border-b border-border-gray/50 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                title={isSidebarOpen ? "Hide outline" : "Show outline"}
                className={`py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSidebarOpen
                    ? "bg-primary-solid text-white border-primary-solid"
                    : "bg-white text-neutral-primary border-border-gray/70 hover:bg-input-bg"
                }`}
              >
                <FiSidebar className="w-4 h-4 shrink-0" />
                <span>{isSidebarOpen ? "Hide Outline" : "Show Outline"}</span>
              </button>
            )}
            <h2 className="text-base sm:text-lg font-extrabold text-neutral-primary truncate">
              {item.title}
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <QuizRunner
            enrollmentId={enrollmentId}
            itemId={item.id}
            onProgress={onProgress}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Player Header: Title & View Controls */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-border-gray/50 flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2.5 min-w-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title={isSidebarOpen ? "Hide outline" : "Show outline"}
              className={`py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSidebarOpen
                  ? "bg-primary-solid text-white border-primary-solid"
                  : "bg-white text-neutral-primary border-border-gray/70 hover:bg-input-bg"
              }`}
            >
              <FiSidebar className="w-4 h-4 shrink-0" />
              <span>{isSidebarOpen ? "Hide Outline" : "Show Outline"}</span>
            </button>
          )}

          <h2 className="text-base sm:text-lg font-extrabold text-neutral-primary truncate">
            {item.title}
          </h2>
        </div>

        {/* Right Stage Controls: Fullscreen only */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit full screen" : "Enter full screen"}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-border-gray/70 bg-white text-neutral-secondary hover:text-neutral-primary hover:bg-input-bg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
        >
          {isFullscreen ? (
            <FiMinimize2 className="w-4 h-4" />
          ) : (
            <FiMaximize2 className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </span>
        </button>
      </div>

      {/* Media Player Stage Box: Edge-to-edge full container */}
      <div
        ref={stageRef}
        className={`relative w-full bg-white flex items-center justify-center overflow-hidden ${
          isFullscreen
            ? "fixed inset-0 z-50 h-screen w-screen bg-black"
            : "h-[68vh] sm:h-[75vh] xl:h-[80vh] min-h-[540px]"
        }`}
      >
        {isLaunching ||
        (item.type === "scorm_package" && (!scormSession || isLoadingSession)) ? (
          <div className="flex flex-col items-center justify-center gap-3 text-neutral-secondary p-6">
            <InlineSpinner className="w-8 h-8 text-primary-solid" />
            <span className="text-xs text-neutral-secondary">Loading course player...</span>
          </div>
        ) : item.type === "scorm_package" && scormSession ? (
          <ScormPlayer
            enrollmentId={enrollmentId}
            session={scormSession}
            learnerId={learnerId}
            learnerName={learnerName}
          />
        ) : item.type === "video" && launchUrl ? (
          <video
            src={launchUrl}
            controls
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : launchUrl ? (
          <iframe
            title={item.title}
            src={launchUrl}
            className="w-full h-full border-0 bg-white"
          />
        ) : (
          <div className="text-neutral-secondary text-sm">Content unavailable</div>
        )}
      </div>

      {/* Bottom Bar: Previous / Next Navigation */}
      {(hasPrevious || hasNext) && (
        <div className="px-4 sm:px-6 py-3 border-t border-border-gray/50 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {hasPrevious && onPrevious && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<FiChevronLeft className="w-4 h-4" />}
                onClick={onPrevious}
                title={previousTitle ? `Previous: ${previousTitle}` : "Previous lesson"}
              >
                Previous
              </Button>
            )}

            {hasNext && onNext && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isNextLocked}
                rightIcon={
                  isNextLocked ? (
                    <FiLock className="w-3.5 h-3.5 text-neutral-secondary" />
                  ) : (
                    <FiChevronRight className="w-4 h-4" />
                  )
                }
                onClick={onNext}
                title={
                  isNextLocked
                    ? "Next item is locked"
                    : nextTitle
                    ? `Next: ${nextTitle}`
                    : "Next lesson"
                }
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
