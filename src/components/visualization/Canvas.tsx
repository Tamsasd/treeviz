import { motion, AnimatePresence } from "framer-motion";
import { calculateTreeLayout } from "../../core/layout/TreeLayout";
import { type BinaryNode } from "../../core/interfaces/INode";
import { Edge } from "./Edge";
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { getPreorder } from "../../hooks/treeTraversals";

export interface CanvasHandle {
  download: () => void;
}

interface CanvasProps {
  root: BinaryNode | null;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ root }, ref) => {
  const { nodes, width, height } = calculateTreeLayout(root);

  const getNodeState = (node: any) => {
    if (node.isFound) return "found";
    if (node.isHighlighted) return "highlighted";
    return "default";
  };

  const getFillColor = (node: any) =>
    "color" in node
      ? node.color === "red"
        ? "#ef4444"
        : "var(--node-fill-black)"
      : "var(--node-fill-std)";

  const getTextColor = (node: any) =>
    "color" in node ? "#fff" : "var(--node-text-std)";

  const getStrokeColor = (node: any) =>
    node.isFound
      ? "#4ade80"
      : node.isHighlighted
        ? "#facc15"
        : node.toDelete
          ? "#cb3636"
          : "var(--node-stroke)";

  const getTreeType = (node: BinaryNode | null): string => {
    if (!node) return "Tree";
    if ("color" in node) {
      return "RB";
    }
    if ("parent" in node) {
      return "AVL";
    }
    return "BST";
  };

  const svgRef = useRef<SVGSVGElement | null>(null);

  const downloadSVG = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const clone = svgElement.cloneNode(true) as SVGSVGElement;

    const printColors = {
      nodeFillStd: "#ffffff",
      nodeFillBlack: "#1f2937",
      nodeStroke: "#374151",
      textStd: "#000000",
      textWhite: "#ffffff",
      edgeStroke: "#4b5563",
    };

    const style = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style",
    );
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
      text { font-family: 'Inter', sans-serif !important; }
    `;
    clone.prepend(style);

    // Edges
    const lines = clone.querySelectorAll("line");
    lines.forEach((line) => {
      line.style.stroke = printColors.edgeStroke;
      line.setAttribute("stroke", printColors.edgeStroke);
      line.style.opacity = "1";
      line.setAttribute("opacity", "1");
    });

    // Nodes
    const circles = clone.querySelectorAll("circle");
    circles.forEach((circle) => {
      const currentFill = circle.getAttribute("fill");

      if (currentFill?.includes("var(--node-fill-std)")) {
        circle.setAttribute("fill", printColors.nodeFillStd);
      } else if (currentFill?.includes("var(--node-fill-black)")) {
        circle.setAttribute("fill", printColors.nodeFillBlack);
      }

      circle.setAttribute("stroke", printColors.nodeStroke);
      circle.style.stroke = printColors.nodeStroke;
    });

    // Text
    const texts = clone.querySelectorAll("text");
    texts.forEach((text) => {
      const currentFill = text.getAttribute("fill");

      if (currentFill === "#fff" || currentFill === "#ffffff") {
        text.setAttribute("fill", printColors.textWhite);
        text.style.fill = printColors.textWhite;
      } else {
        text.setAttribute("fill", printColors.textStd);
        text.style.fill = printColors.textStd;
      }

      // Bake Font Properties
      text.setAttribute("font-family", "'Inter', sans-serif");
      text.style.fontFamily = "'Inter', sans-serif";
      text.setAttribute("font-weight", "bold");
      text.style.fontWeight = "bold";
      text.setAttribute("text-anchor", "middle");
      text.style.textAnchor = "middle";
      if (!text.hasAttribute("dy")) text.setAttribute("dy", ".3em");
    });

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(clone);

    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }

    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${getTreeType(root)} (${getPreorder(root)}).svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useImperativeHandle(ref, () => ({
    download: downloadSVG,
  }));

  return (
    <div className="canvas-container">
      <svg width={width} height={height} ref={svgRef}>
        <g className="edges-layer">
          <AnimatePresence>
            {nodes.map((node) => {
              const leftChild = nodes.find((n) => n.id === node.left?.id);
              const rightChild = nodes.find((n) => n.id === node.right?.id);

              return (
                <React.Fragment key={`edges-group-${node.id}`}>
                  {leftChild && (
                    <Edge
                      key={`edge-${node.id}-${leftChild.id}`}
                      x1={node.x}
                      y1={node.y}
                      x2={leftChild.x}
                      y2={leftChild.y}
                      state={getNodeState(leftChild)}
                    />
                  )}
                  {rightChild && (
                    <Edge
                      key={`edge-${node.id}-${rightChild.id}`}
                      x1={node.x}
                      y1={node.y}
                      x2={rightChild.x}
                      y2={rightChild.y}
                      state={getNodeState(rightChild)}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </g>

        <g className="nodes-layer">
          <AnimatePresence>
            {nodes.map((node) => (
              <motion.g
                key={node.id}
                initial={{ scale: 0, x: node.x, y: node.y }}
                animate={{ scale: 1, x: node.x, y: node.y }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <circle
                  r="22"
                  fill={getFillColor(node)}
                  stroke={getStrokeColor(node)}
                  strokeWidth="2"
                />
                <text dy=".3em" fontSize="15" fill={getTextColor(node)}>
                  {node.value}
                </text>
              </motion.g>
            ))}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  );
});

Canvas.displayName = "Canvas";

export default Canvas;
