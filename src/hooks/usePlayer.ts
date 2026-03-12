import { useState, useEffect, useCallback } from 'react';

interface UsePlayerProps {
  maxSteps: number;
  onStepChange?: (step: number | ((prev: number) => number)) => void;
  initialStep?: number;
}

export interface UsePlayerReturn {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  handleFirst: () => void;
  handlePrev: () => void;
  handlePlayPause: () => void;
  handleNext: () => void;
  handleLast: () => void;
  handleSlider: (val: number) => void;
  handleSpeedChange: (val: number) => void;
}

export function usePlayer({ 
  maxSteps, 
  onStepChange, 
  initialStep = 0 
}: UsePlayerProps): UsePlayerReturn {
  const [currentStep, setCurrentStepInternal] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const setCurrentStep = useCallback((value: number | ((prev: number) => number)) => {
    setCurrentStepInternal(value);
    if (onStepChange) {
      onStepChange(value);
    }
  }, [onStepChange]);

  // Player loop
  useEffect(() => {
    let interval: any;

    if (isPlaying && maxSteps > 0) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            return maxSteps - 1;
          }
          return prev + 1;
        });
      }, 500 / speed);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, maxSteps, speed, setCurrentStep]);

  const handleFirst = useCallback(() => setCurrentStep(0), [setCurrentStep]);

  const handlePrev = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1));
  }, [setCurrentStep]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(maxSteps - 1, s + 1));
  }, [maxSteps, setCurrentStep]);

  const handleLast = useCallback(() => {
    setCurrentStep(maxSteps - 1);
  }, [maxSteps, setCurrentStep]);

  const handleSlider = useCallback((val: number) => {
    setIsPlaying(false);
    setCurrentStep(val);
  }, [setCurrentStep]);

  const handleSpeedChange = useCallback((val: number) => {
    setSpeed(val);
  }, []);

  return {
    currentStep,
    isPlaying,
    speed,
    setCurrentStep,
    setIsPlaying,
    setSpeed,
    handleFirst,
    handlePrev,
    handlePlayPause,
    handleNext,
    handleLast,
    handleSlider,
    handleSpeedChange,
  };
}