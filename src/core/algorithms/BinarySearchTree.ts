import { t } from "../../i18n/translations";
import type { BinaryNode } from "../interfaces/INode";
import { AbstractBinaryTree } from "./AbstractBinaryTree";

export class BinarySearchTree extends AbstractBinaryTree<BinaryNode> {
  *insert(value: number) {
    const { node, parent } = yield* this.quickSearch(value);

    // Already exists
    if (node) {
      yield { type: 'LOG', message: t('logs.alreadyExists', { value }) };
      return;
    }

    const newNode: BinaryNode = {
      id: this.generateId(),
      value,
      left: null,
      right: null,
      isFound: true
    };

    // Empty tree
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
  }

  *delete(value: number) {
    const { node, parent } = yield* this.quickSearch(value);

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
    }

    // One child
    else if (!node.left || !node.right) {
      const child = node.left ?? node.right;
      this.replaceChild(parent, node, child);
      yield { type: 'LOG', message: t('logs.oneChildDeleted', { value }) };
    }

    // Two children
    else {
      const successorParent = this.getSuccessorParent(node);
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
    }
  }

  getInorderTraversal(root: BinaryNode | null = this.root): string {
    if (!root) return "";
    const left: string = root.left ? this.getInorderTraversal(root.left) + ", " : "";
    const right: string = root.left ? this.getInorderTraversal(root.right) + ", " : "";
    return left + root.value + right;
  }
}