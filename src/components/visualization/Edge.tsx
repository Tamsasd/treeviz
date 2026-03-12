import { motion } from "framer-motion";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  state?: "default" | "highlighted" | "found";
}

export function Edge({ x1, y1, x2, y2, state = "default" }: EdgeProps) {
  const getStrokeColor = () => {
    switch (state) {
      case "found":
        return "#4ade80";
      case "highlighted":
        return "#facc15";
      default:
        return "var(--edge-stroke)";
    }
  };

  return (
    <motion.line
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: 1,
        opacity: 1,
        stroke: getStrokeColor(),
        strokeWidth: "2"
      }}
      transition={{ duration: 0.1 }}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
    />
  );
}
