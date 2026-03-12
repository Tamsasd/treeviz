import React from "react";
import { t } from "../../i18n/translations";

interface TimeControllerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed?: number;
  onFirst: () => void;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onLast: () => void;
  onStepChange: (step: number) => void;
  onSpeedChange?: (speed: number) => void;
}

const TimeController: React.FC<TimeControllerProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed = 1,
  onFirst,
  onPrev,
  onPlayPause,
  onNext,
  onLast,
  onStepChange,
  onSpeedChange,
}) => {
  const maxIndex = Math.max(0, totalSteps - 1);
  const speeds = [0.25, 0.5, 1, 1.5, 2];
  const currentSpeedIndex = speeds.indexOf(speed);

  const handleSpeedClick = () => {
    if (!onSpeedChange) return;
    const nextIndex = (currentSpeedIndex + 1) % speeds.length;
    onSpeedChange(speeds[nextIndex]);
  };

  const isDisabled = totalSteps === 0;

  return (
    <div
      className="time-control"
      role="region"
      aria-label={t('controls.playbackSpeed')}
      style={{ display: "flex", alignItems: "center", gap: "8px" }}
    >
      {/* JUMP TO START */}
      <button
        onClick={onFirst}
        title={t('controls.jumpToStart')}
        aria-label={t('controls.jumpToStart')}
        disabled={isDisabled || currentStep === 0}
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
          <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z" />
        </svg>
      </button>

      {/* PREVIOUS */}
      <button
        onClick={onPrev}
        title={t('controls.previousStep')}
        aria-label={t('controls.previousStep')}
        disabled={isDisabled || currentStep === 0}
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
          <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
        </svg>
      </button>

      {/* PLAY / PAUSE*/}
      <button
        onClick={onPlayPause}
        title={isPlaying ? t('controls.pause') : t('controls.play')}
        aria-label={isPlaying ? t('controls.pause') : t('controls.play')}
        aria-pressed={isPlaying}
        disabled={isDisabled}
        type="button"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
          </svg>
        )}
      </button>

      {/* NEXT */}
      <button
        onClick={onNext}
        title={t('controls.nextStep')}
        aria-label={t('controls.nextStep')}
        disabled={isDisabled || currentStep === maxIndex}
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
          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
        </svg>
      </button>

      {/* JUMP TO END */}
      <button
        onClick={onLast}
        title={t('controls.jumpToEnd')}
        aria-label={t('controls.jumpToEnd')}
        disabled={isDisabled || currentStep === maxIndex}
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
          <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z" />
        </svg>
      </button>

      {/* SLIDER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: "200px",
        }}
      >
        <input
          type="range"
          min="0"
          max={maxIndex}
          value={currentStep}
          onChange={(e) => onStepChange(parseInt(e.target.value))}
          disabled={isDisabled}
          aria-label={t('controls.selectStep')}
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={currentStep}
          aria-valuetext={`${currentStep + 1} / ${totalSteps}`}
          style={{
            cursor: isDisabled ? "not-allowed" : "pointer",
            flex: 1,
          }}
        />
        <span
          style={{ minWidth: "60px", textAlign: "center", fontSize: "14px" }}
          aria-live="polite"
          aria-atomic="true"
        >
          {currentStep + 1}/{totalSteps}
        </span>
      </div>

      {/* SPEED CONTROL */}
      <button
        onClick={handleSpeedClick}
        title={`${t('controls.playbackSpeed')}: ${speed}x`}
        aria-label={`${t('controls.playbackSpeed')}: ${speed}x`}
        disabled={isDisabled}
        type="button"
        style={{
          fontSize: "12px",
          minWidth: "6ch",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        <span aria-hidden="true">{speed}x</span>
      </button>
    </div>
  );
};

export default TimeController;