import { type BinaryNode } from "../core/interfaces/INode";

export const getPreorder = (node: BinaryNode | null): string => {
  if (!node) return "";
  const values: number[] = [];
  const traverse = (n: BinaryNode | null) => {
    if (!n) return;
    values.push(n.value); // Root
    traverse(n.left);     // Left
    traverse(n.right);    // Right
  };
  traverse(node);
  return values.join(", ");
};

export const getInorder = (node: BinaryNode | null): string => {
  if (!node) return "";
  const values: number[] = [];
  const traverse = (n: BinaryNode | null) => {
    if (!n) return;
    traverse(n.left);     // Left
    values.push(n.value); // Root
    traverse(n.right);    // Right
  };
  traverse(node);
  return values.join(", ");
};

export const getPostorder = (node: BinaryNode | null): string => {
  if (!node) return "";
  const values: number[] = [];
  const traverse = (n: BinaryNode | null) => {
    if (!n) return;
    traverse(n.left);     // Left
    traverse(n.right);    // Right
    values.push(n.value); // Root
  };
  traverse(node);
  return values.join(", ");
};