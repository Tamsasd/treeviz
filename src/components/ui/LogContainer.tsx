import React, { useEffect, useRef } from "react";
import { t } from "../../i18n/translations";

interface LogContainerProps {
  logs: string[];
  onHoverLog: (index: number | null) => void;
  activeStep: number;
  isFullscreen: boolean;
  onLogClick?: (index: number) => void;
}

const LogContainer: React.FC<LogContainerProps> = ({
  logs,
  onHoverLog,
  activeStep,
  isFullscreen,
  onLogClick,
}) => {
  const activeRef = useRef<HTMLLIElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLogsLength = useRef(0);

  // Auto-scroll to active step
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeStep]);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (!isFullscreen && logs.length > prevLogsLength.current) {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
    prevLogsLength.current = logs.length;
  }, [logs, isFullscreen]);

  const handleLogClick = (index: number) => {
    if (isFullscreen && onLogClick) {
      onLogClick(index);
    }
  };

  if (isFullscreen) {
    // Fullscreen mode
    return (
      <div
        className="log-container fullscreen-log-container"
        ref={containerRef}
      >
        <ul className="log-list">
          {logs.map((log, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <li
                key={index}
                ref={isActive ? activeRef : null}
                className={`log-item ${isActive ? "active-log" : ""} ${isCompleted ? "completed-log" : ""} ${isFullscreen ? "clickable" : ""}`}
                onMouseEnter={() => onHoverLog(index)}
                onMouseLeave={() => onHoverLog(null)}
                onClick={() => handleLogClick(index)}
                role={isFullscreen ? "button" : undefined}
                tabIndex={isFullscreen ? 0 : undefined}
                onKeyPress={(e) => {
                  if (isFullscreen && (e.key === "Enter" || e.key === " ")) {
                    handleLogClick(index);
                  }
                }}
                aria-label={`${t("logs.step")} ${index + 1}: ${log}`}
                aria-current={isActive ? "step" : undefined}
              >
                <div className="log-item-number">{index + 1}</div>
                <div className="log-item-content">
                  <span className="log-message">{log}</span>
                </div>
                {isActive && <div className="log-item-indicator">▶</div>}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Normal mode
  return (
    <div className="log-container" ref={containerRef}>
      <h3 className="log-title">{t("logs.title")}</h3>
      <ul className="log-list">
        {logs.map((log, index) => {
          const isActive = index === activeStep;
          return (
            <li
              key={index}
              ref={isActive ? activeRef : null}
              className={`log-item ${isActive ? "active-log" : ""}`}
              onMouseEnter={() => onHoverLog(index)}
              onMouseLeave={() => onHoverLog(null)}
              style={{
                fontWeight: isActive ? "bold" : "normal",
              }}
            >
              <span className="arrow">{isActive ? "▶" : "➜"}</span>
              {log}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LogContainer;
