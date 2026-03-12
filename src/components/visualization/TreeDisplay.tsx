import React, { useState, useRef } from "react";
import Canvas, { type CanvasHandle } from "./Canvas";
import LogContainer from "../ui/LogContainer";
import FullscreenView from "../../pages/FullScreenView/FullscreenView";
import type { BinaryNode } from "../../core/interfaces/INode";
import type { HistoryStep, ActionGroup } from "../../hooks/useTree";
import { t } from "../../i18n/translations";

interface TreeDisplayProps {
  title: string;
  root: BinaryNode | null;
  history: HistoryStep[];
  actionGroups: ActionGroup[];
  currentStep: number;
  onStepChange?: React.Dispatch<React.SetStateAction<number>>;
}

const TreeDisplay: React.FC<TreeDisplayProps> = ({
  title,
  root,
  history,
  actionGroups,
  currentStep,
  onStepChange,
}) => {
  const [hoveredLogIndex, setHoveredLogIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<CanvasHandle>(null);

  const getCurrentActionGroup = (): ActionGroup | null => {
    if (actionGroups.length === 0) return null;

    const found = actionGroups.find(
      (group) =>
        currentStep >= group.startIndex && currentStep <= group.endIndex,
    );

    return found || actionGroups[actionGroups.length - 1];
  };

  const currentActionGroup = getCurrentActionGroup();

  const getActionSteps = (): HistoryStep[] => {
    if (!currentActionGroup) return [];
    return currentActionGroup.steps;
  };

  const getLocalStepIndex = (): number => {
    if (!currentActionGroup) return 0;

    const localIndex = currentStep - currentActionGroup.startIndex;

    return Math.max(
      0,
      Math.min(localIndex, currentActionGroup.steps.length - 1),
    );
  };

  const actionSteps = getActionSteps();
  const localStepIndex = getLocalStepIndex();

  // Display root based on hover or current step
  const displayRoot =
    hoveredLogIndex !== null && actionSteps[hoveredLogIndex]
      ? actionSteps[hoveredLogIndex].rootSnapshot
      : root;

  const handleDownload = () => {
    if (canvasRef.current) {
      canvasRef.current.download();
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFullscreenStepClick = (globalStepIndex: number) => {
    if (onStepChange) {
      onStepChange(globalStepIndex);
    }
  };

  if (isFullscreen) {
    return (
      <FullscreenView
        title={title}
        root={root}
        history={history} // Full global history
        currentStep={currentStep} // Global step index
        onClose={handleFullscreenToggle}
        onStepClick={handleFullscreenStepClick}
        onStepChange={onStepChange}
      />
    );
  }

  const logMessages = actionSteps.map((h) => h.message);

  return (
    <div className="tree-display">
      <div className="tree-title">{title}</div>

      {/* Fullscreen Button */}
      <button
        className="subtle fullscreen"
        onClick={handleFullscreenToggle}
        title={t("controls.fullscreenMode")}
        aria-label={t("controls.fullscreenMode")}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z" />
        </svg>
      </button>

      {/* Download Button */}
      <button
        className="subtle download"
        onClick={handleDownload}
        title={t("controls.downloadSVG")}
        aria-label={t("controls.downloadSVG")}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
        </svg>
      </button>

      <div className="canvas-wrapper">
        <Canvas ref={canvasRef} root={displayRoot} />
      </div>

      <div className="log-wrapper">
        <LogContainer
          logs={logMessages}
          onHoverLog={setHoveredLogIndex}
          activeStep={localStepIndex}
          isFullscreen={false}
        />
      </div>
    </div>
  );
};

export default TreeDisplay;
