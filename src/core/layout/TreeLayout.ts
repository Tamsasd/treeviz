import type { BinaryNode } from "../interfaces/INode";

export interface LayoutNode extends BinaryNode {
  x: number;
  y: number;
}

export const calculateTreeLayout = (root: BinaryNode | null) => {
  if (!root) return { nodes: [], width: 0, height: 0 };

  const nodes: LayoutNode[] = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let maxDepth = 0;

  const NODE_GAP = 30;  // Horizontal distance
  const LEVEL_GAP = 60; // Vertical distance
  let counter = 0;

  const traverse = (node: BinaryNode | null, depth: number) => {
    if (!node) return;

    traverse(node.left, depth + 1);

    const x = counter * NODE_GAP;
    const y = depth * LEVEL_GAP + 50;

    nodes.push({ ...node, x, y });

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (depth > maxDepth) maxDepth = depth;

    counter++;
    traverse(node.right, depth + 1);
  };

  traverse(root, 0);

  const totalWidth = maxX - minX + 100;
  const totalHeight = maxDepth * LEVEL_GAP + 100;

  const centeredNodes = nodes.map(n => ({
    ...n,
    x: n.x + 50
  }));

  return {
    nodes: centeredNodes,
    width: totalWidth,
    height: totalHeight
  };
};