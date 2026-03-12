import type { AVLNode } from "../interfaces/INode";
import { AbstractBinaryTree } from "./AbstractBinaryTree";
import { t } from "../../i18n/translations";

export class AVLTree extends AbstractBinaryTree<AVLNode> {

  *insert(value: number) {
    const { node, parent } = (yield* this.quickSearch(value)) as {
      node: AVLNode | null;
      parent: AVLNode | null;
    };

    if (node) {
      yield { type: 'LOG', message: t('logs.alreadyExists', { value }) };
      return;
    }

    const newNode: AVLNode = {
      id: this.generateId(),
      value: value,
      left: null,
      right: null,
      isFound: true,
      parent: parent
    };

    // Empty tree -> root
    if (!parent) {
      this.root = newNode;
      yield { type: 'LOG', message: t('logs.rootCreated', { value }) };
      this.root.isFound = false;
      return;
    }

    // Insert under parent
    if (value < parent.value) {
      parent.left = newNode;
      yield { type: 'LOG', message: t('logs.insertLeft', { value, parent: parent.value }) };
      parent.left.isFound = false;
    } else {
      parent.right = newNode;
      yield { type: 'LOG', message: t('logs.insertRight', { value, parent: parent.value }) };
      parent.right.isFound = false;
    }

    // AVL rebalancing upwards
    yield* this.rebalance(parent);
  }

  *delete(value: number) {
    const { node, parent } = (yield* this.quickSearch(value)) as {
      node: AVLNode | null;
      parent: AVLNode | null;
    };

    if (!node) {
      yield { type: 'LOG', message: t('logs.notFound', { value }) };
      return;
    }

    node.toDelete = true;
    yield { type: 'LOG', message: t('logs.nodeFound', { value }) };

    // No children
    if (!node.left && !node.right) {
      this.replaceChild(parent, node, null);
      yield { type: 'LOG', message: t('logs.leafDeleted', { value }) };
      if (parent) yield* this.rebalance(parent);
    }

    // One child
    else if (!node.left || !node.right) {
      const child = node.left ?? node.right;
      this.replaceChild(parent, node, child);
      yield { type: 'LOG', message: t('logs.oneChildDeleted', { value }) };
      if (parent) yield* this.rebalance(parent);
    }

    // Two children
    else {
      const successorParent = this.getSuccessorParent(node) as AVLNode;
      const successor =
        successorParent === node
          ? successorParent.right!
          : successorParent.left!;

      // Visual swap
      node.value = successor.value;
      successor.value = value;
      successor.toDelete = true;
      node.toDelete = false;

      yield { type: 'LOG', message: t('logs.replaceNode', { value: successor.value }) };

      this.replaceChild(
        successorParent,
        successor,
        successor.right
      );

      yield { type: 'LOG', message: t('logs.twoChildrenDeleted', { value }) };

      if (successorParent) yield* this.rebalance(successorParent);
    }
  }

  private getHeight(node: AVLNode | null): number {
    if (!node) return -1;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  private getBalanceFactor(node: AVLNode | null): number {
    if (!node) return 0;
    return this.getHeight(node.right) - this.getHeight(node.left);
  }

  protected rotateRight(node: AVLNode): AVLNode {
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

  protected rotateLeft(node: AVLNode): AVLNode {
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

  private *rebalance(node: AVLNode): Generator<{ type: string; message: string }, void, void> {
    const bf = this.getBalanceFactor(node);

    // Left heavy
    if (bf < -1) {
      const leftBF = this.getBalanceFactor(node.left);

      // LL
      if (leftBF <= 0) {
        this.rotateRight(node);
        yield { type: 'LOG', message: t('logs.rebalanceLeft') };
      }
      // LR
      else {
        this.rotateLeft(node.left!);
        yield { type: 'LOG', message: t('logs.rotateLeftRight') };
        this.rotateRight(node);
        yield { type: 'LOG', message: t('logs.rotateRight') };
      }
    }

    // Right heavy
    else if (bf > 1) {
      const rightBF = this.getBalanceFactor(node.right);

      // RR
      if (rightBF >= 0) {
        this.rotateLeft(node);
        yield { type: 'LOG', message: t('logs.rebalanceRight') };
      }
      // RL
      else {
        this.rotateRight(node.right!);
        yield { type: 'LOG', message: t('logs.rotateRightLeft') };
        this.rotateLeft(node);
        yield { type: 'LOG', message: t('logs.rotateLeft') };
      }
    }

    if (node.parent) {
      yield* this.rebalance(node.parent);
    }
  }
}