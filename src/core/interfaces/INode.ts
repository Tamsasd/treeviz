export interface INode {
  id: string;
  value: number;
  isHighlighted?: boolean;
  isFound?: boolean;
  toDelete?: boolean;
}

export interface BinaryNode<T extends BinaryNode<T> = any> extends INode {
  left: T | null;
  right: T | null;
}

export interface RotatableNode<T extends RotatableNode<T> = any>
  extends BinaryNode<T> {
  parent: T | null;
}

export interface AVLNode<T extends AVLNode<T> = any>
  extends RotatableNode<T> {
  // balanceFactor?: number;
}

export interface RBNode<T extends RBNode<T> = any>
  extends RotatableNode<T> {
  color: 'red' | 'black';
}
