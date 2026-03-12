import { t } from "../../i18n/translations";
import type { BinaryNode, RotatableNode } from "../interfaces/INode";
import { AbstractTree } from "./AbstractTree";

export abstract class AbstractBinaryTree<
  T extends BinaryNode<T>
> extends AbstractTree<T> {

  resetVisuals(node: T | null = this.root) {
    if (!node) return;
    node.isHighlighted = false;
    node.isFound = false;
    this.resetVisuals(node.left);
    this.resetVisuals(node.right);
  }

  protected replaceChild(
    parent: T | null,
    oldChild: T,
    newChild: T | null
  ): void {
    if (!parent) {
      this.root = newChild;
      if (newChild && 'parent' in newChild) {
        (newChild as any).parent = null;
      }
    } else if (parent.left === oldChild) {
      parent.left = newChild;
      if (newChild && 'parent' in newChild) {
        (newChild as any).parent = parent;
      }
    } else {
      parent.right = newChild;
      if (newChild && 'parent' in newChild) {
        (newChild as any).parent = parent;
      }
    }
  }

  protected getSuccessorParent(curr: T): T {
    let successorParent = curr;
    let successor = curr.right!;

    if (successor.left === null) {
      return curr;
    }

    while (successor.left !== null) {
      successorParent = successor;
      successor = successor.left;
    }

    return successorParent;
  }

  protected rotateRight(node: RotatableNode): RotatableNode {
    const newRoot = node.left!;

    node.left = newRoot.right;
    if (newRoot.right) newRoot.right.parent = node;

    newRoot.parent = node.parent;

    if (!node.parent) this.root = newRoot;
    else if (node === node.parent.left) node.parent.left = newRoot;
    else node.parent.right = newRoot;

    newRoot.right = node;
    node.parent = newRoot;

    return newRoot;
  }

  protected rotateLeft(node: RotatableNode): RotatableNode {
    const newRoot = node.right!;

    node.right = newRoot.left;
    if (newRoot.left) newRoot.left.parent = node;

    newRoot.parent = node.parent;
    if (!node.parent) this.root = newRoot;
    else if (node === node.parent.left) node.parent.left = newRoot;
    else node.parent.right = newRoot;

    newRoot.left = node;
    node.parent = newRoot;

    return newRoot;
  }

  *search(value: number) {
    this.resetVisuals();
    yield { type: 'LOG', message: t('logs.startSearch', { value }) };

    let current = this.root;

    while (true) {
      if (!current) {
        yield { type: 'LOG', message: t('logs.notFound', { value }) };
        return;
      }

      current.isHighlighted = true;
      yield { type: 'LOG', message: t('logs.examining', { value: current.value }) };

      if (current.value === value) {
        current.isFound = true;
        current.isHighlighted = false;
        yield { type: 'LOG', message: t('logs.found', { value }) };
        return;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
  }

  *quickSearch(value: number): Generator<
    { type: 'LOG'; message: string },
    { node: T | null; parent: T | null },
    void
  > {
    this.resetVisuals();

    let parent: T | null = null;
    let current: T | null = this.root;

    while (current) {
      current.isHighlighted = true;
      yield { type: 'LOG', message: t('logs.examining', { value: current.value }) };
      current.isHighlighted = false;

      if (current.value === value) {
        return { node: current, parent };
      }

      parent = current;
      current =
        value < current.value
          ? current.left
          : current.right;
    }

    return { node: current, parent: parent };
  }
}