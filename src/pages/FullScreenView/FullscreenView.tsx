import React, { useRef, useState, useEffect } from "react";
import Canvas, {
  type CanvasHandle,
} from "../../components/visualization/Canvas";
import type { BinaryNode } from "../../core/interfaces/INode";
import type { HistoryStep } from "../../hooks/useTree";
import LogContainer from "../../components/ui/LogContainer";
import TimeController from "../../components/controls/TimeController";
import { usePlayer } from "../../hooks/usePlayer";
import { t } from "../../i18n/translations";
import "./FullscreenView.css";
import "../../hooks/treeTraversals.ts";
import {
  getInorder,
  getPostorder,
  getPreorder,
} from "../../hooks/treeTraversals.ts";

interface FullscreenViewProps {
  title: string;
  root: BinaryNode | null;
  history: HistoryStep[];
  currentStep: number;
  onClose: () => void;
  onStepClick: (index: number) => void;
  onStepChange?: React.Dispatch<React.SetStateAction<number>>;
}

const FullscreenView: React.FC<FullscreenViewProps> = ({
  title,
  root,
  history,
  currentStep,
  onClose,
  onStepClick,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const preventScrollPropagation = (e: WheelEvent) => {
      e.stopPropagation();
    };

    overlay.addEventListener("wheel", preventScrollPropagation, {
      passive: true,
    });

    return () => {
      overlay.removeEventListener("wheel", preventScrollPropagation);
    };
  }, []);

  const canvasRef = useRef<CanvasHandle>(null);
  const [hoveredLogIndex, setHoveredLogIndex] = useState<number | null>(null);

  const maxSteps = history.length;

  const player = usePlayer({
    maxSteps,
    initialStep: currentStep,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        if (document.activeElement?.tagName !== "INPUT") {
          e.preventDefault();
        }
      }

      if (e.key === "ArrowLeft") player.handlePrev();
      if (e.key === "ArrowRight") player.handleNext();
      if (e.key === " " && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        player.handlePlayPause();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [player, onClose]);

  const handleDownload = () => {
    if (canvasRef.current) {
      canvasRef.current.download();
    }
  };

  const handleLogJump = (index: number) => {
    player.setIsPlaying(false);
    player.setCurrentStep(index);
    onStepClick(index);
  };

  const displayRoot =
    hoveredLogIndex !== null && history[hoveredLogIndex]
      ? history[hoveredLogIndex].rootSnapshot
      : (history[player.currentStep]?.rootSnapshot ?? root);

  const logMessages = history.map((h) => h.message);

  const preorderStr = getPreorder(displayRoot);
  const inorderStr = getInorder(displayRoot);
  const postorderStr = getPostorder(displayRoot);

  return (
    <div className="fullscreen-overlay" ref={overlayRef}>
      <div className="fullscreen-container">
        <div className="fullscreen-history">
          <div className="fullscreen-history-header">
            <h2>{t("logs.operationHistory")}</h2>
            <button
              className="close-button"
              onClick={onClose}
              aria-label={t("controls.exitFullscreen")}
              title={t("controls.exitFullscreen")}
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
                <path d="m136-80-56-56 264-264H160v-80h320v320h-80v-184L136-80Zm344-400v-320h80v184l264-264 56 56-264 264h184v80H480Z" />
              </svg>
            </button>
          </div>

          <div className="fullscreen-history-list">
            <LogContainer
              logs={logMessages}
              onHoverLog={setHoveredLogIndex}
              activeStep={player.currentStep}
              isFullscreen={true}
              onLogClick={handleLogJump}
            />
          </div>
        </div>

        <div className="fullscreen-tree">
          <div className="fullscreen-tree-header">
            <h1>{title}</h1>
            <button
              className="subtle"
              onClick={handleDownload}
              title={t("controls.downloadSVG")}
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
          </div>

          <div className="fullscreen-tree-canvas">
            <Canvas ref={canvasRef} root={displayRoot} />
          </div>

          <div className="fullscreen-tree-traversal">
            <div id="preorder">
              <p className="traversal-title">{t("controls.preorder")}</p>
              <p className="traversal-content">{preorderStr}</p>
            </div>
            <div id="inorder">
              <p className="traversal-title">{t("controls.inorder")}</p>
              <p className="traversal-content">{inorderStr}</p>
            </div>
            <div id="postorder">
              <p className="traversal-title">{t("controls.postorder")}</p>
              <p className="traversal-content">{postorderStr}</p>
            </div>
          </div>

          <div className="fullscreen-tree-controls">
            <TimeController
              currentStep={player.currentStep}
              totalSteps={maxSteps}
              isPlaying={player.isPlaying}
              onFirst={player.handleFirst}
              onPrev={player.handlePrev}
              onPlayPause={player.handlePlayPause}
              onNext={player.handleNext}
              onLast={player.handleLast}
              onStepChange={player.handleSlider}
              onSpeedChange={player.handleSpeedChange}
              speed={player.speed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenView;
