"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiLock,
  FiMaximize2,
  FiMinimize2,
  FiRotateCw,
  FiSidebar,
  FiCheckCircle,
} from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { useToast } from "@/shared/components/ui/toast";
import {
  useItemLaunch,
  useScormSession,
  useRecordItemProgress,
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
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 900px) and (orientation: portrait)");
    const update = () => setIsPortraitMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    window.addEventListener("orientationchange", update);
    return () => {
      mql.removeEventListener("change", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

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

  const { mutate: recordProgress } = useRecordItemProgress(enrollmentId);
  const isCompleted = item.progressStatus === "completed";

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

  const toggleFullscreen = async () => {
    if (!stageRef.current) return;
    const orientation = (
      typeof screen !== "undefined" ? screen.orientation : undefined
    ) as (ScreenOrientation & { lock?: (mode: string) => Promise<void>; unlock?: () => void }) | undefined;

    if (!document.fullscreenElement) {
      try {
        await stageRef.current.requestFullscreen();
        await orientation?.lock?.("landscape").catch(() => {});
      } catch {
        // Fallback or ignore when browser disallows fullscreen/orientation lock
      }
    } else {
      try {
        orientation?.unlock?.();
        await document.exitFullscreen();
      } catch {
        // Ignore
      }
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

      {/* Media Player Stage Box: Letterboxed 11:9 landscape canvas */}
      <div
        ref={stageRef}
        className={`relative w-full flex items-center justify-center overflow-hidden ${
          isFullscreen
            ? "fixed inset-0 z-50 h-screen w-screen bg-black p-0"
            : "bg-neutral-950/95 p-2 sm:p-4 min-h-[260px]"
        }`}
      >
        <div
          className={`relative w-full aspect-[11/9] bg-white overflow-hidden flex items-center justify-center ${
            isFullscreen
              ? "max-w-[min(100vw,calc(100vh*11/9))] max-h-screen"
              : "max-w-[min(100%,calc(78vh*11/9))] rounded-lg shadow-lg"
          }`}
        >
          {isLaunching ||
          (item.type === "scorm_package" && (!scormSession && isLoadingSession)) ? (
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
              onProgress={onProgress}
            />
          ) : item.type === "video" && launchUrl ? (
            <video
              src={launchUrl}
              controls
              playsInline
              className="w-full h-full object-contain bg-black"
              onEnded={() => {
                recordProgress(
                  {
                    itemId: item.id,
                    input: { status: "completed", percent: 100 },
                  },
                  {
                    onSuccess: () => {
                      toast({
                        type: "success",
                        title: "Lesson Completed",
                        description: `You have completed "${item.title}".`,
                      });
                      onProgress();
                    },
                  }
                );
              }}
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

        {/* Mobile portrait orientation blocker so 11:9 content is never cut off */}
        {isPortraitMobile && (
          <div className="absolute inset-0 z-20 bg-neutral-950/95 backdrop-blur-xs text-white flex flex-col items-center justify-center text-center p-6 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <FiRotateCw className="w-7 h-7 text-secondary" />
            </div>
            <div className="flex flex-col gap-1 max-w-xs">
              <h3 className="text-base font-extrabold">Rotate Your Device</h3>
              <p className="text-xs text-white/75 leading-relaxed">
                This course player is designed for a landscape (11:9) screen so nothing gets cut off. Please turn your phone sideways to continue.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <FiMaximize2 className="w-3.5 h-3.5" />
              <span>Switch to Landscape Fullscreen</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Bar: Navigation & Completed State */}
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
        </div>

        <div className="flex items-center gap-2.5">
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Completed
            </span>
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
                  ? "Next item is locked until you complete this module"
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
    </div>
  );
};
