import type { RBNode } from "../interfaces/INode";
import { AbstractBinaryTree } from "./AbstractBinaryTree";
import { t } from "../../i18n/translations";

export class RedBlackTree extends AbstractBinaryTree<RBNode> {

  *insert(value: number): Generator<any> {
    const { node, parent } =
      (yield* this.quickSearch(value)) as { node: RBNode | null; parent: RBNode | null };

    if (node) {
      yield { type: "LOG", message: t('logs.alreadyExists', { value }) };
      return;
    }

    const newNode: RBNode = {
      id: this.generateId(),
      value,
      left: null,
      right: null,
      parent,
      color: "red",
      isFound: true
    };

    let z: RBNode;

    if (!parent) {
      this.root = newNode;
      z = newNode;
      yield { type: "LOG", message: t('logs.rootCreated', { value }) };
    } else if (value < parent.value) {
      parent.left = newNode;
      z = newNode;
      yield { type: "LOG", message: t('logs.insertLeft', { value, parent: parent.value }) };
    } else {
      parent.right = newNode;
      z = newNode;
      yield { type: "LOG", message: t('logs.insertRight', { value, parent: parent.value }) };
    }

    z.isFound = false;
    yield* this.insertFixup(z);
  }

  *insertFixup(z: RBNode): Generator<{ type: string; message: string }, void, void> {
    while (z.parent?.color === "red") {
      const p = z.parent;
      const g = p.parent;
      if (!g) break;

      const u = g.left === p ? g.right : g.left;

      if (u?.color === "red") {
        p.color = "black";
        u.color = "black";
        g.color = "red";
        z = g;

        yield { type: "LOG", message: t('logs.uncleRed') };
        continue;
      }

      // p is a left child
      if (g.left === p) {

        // LR
        if (p.right === z) {
          this.rotateLeft(p);
          z = p;
          yield { type: "LOG", message: t('logs.uncleBlackRotateParentLeft') };
        }

        // LL
        this.rotateRight(g);
        yield { type: "LOG", message: t('logs.uncleBlackRotateGrandparentRight') };
        p.color = "black";
        g.color = "red";
        yield { type: "LOG", message: t('logs.uncleBlackRecolor') };
        break;
      }

      // p is a right child
      else {

        // RL
        if (p.left === z) {
          this.rotateRight(p);
          z = p;
          yield { type: "LOG", message: t('logs.uncleBlackRotateParentRight') };
        }

        // RR
        this.rotateLeft(g);
        yield { type: "LOG", message: t('logs.uncleBlackRotateGrandparentLeft') };
        p.color = "black";
        g.color = "red";
        yield { type: "LOG", message: t('logs.uncleBlackRecolor') };
        break;
      }
    }

    if (this.root && this.root.color === "red") {
      this.root.color = "black";
      yield { type: "LOG", message: t('logs.rootBlack') };
    }
  }

  *delete(value: number): Generator<any> {

    const { node, parent } = (yield* this.quickSearch(value)) as {
      node: RBNode | null;
      parent: RBNode | null;
    }

    if (!node) {
      yield { type: 'LOG', message: t('logs.notFound', { value }) };
      return;
    }

    node.toDelete = true;
    yield { type: 'LOG', message: t('logs.nodeFound', { value }) };

    // 2 children
    if (node.left && node.right) {
      const successorParent = this.getSuccessorParent(node) as RBNode;
      const successor = successorParent === node
        ? successorParent.right!
        : successorParent.left!;

      const successorOriginalColor = successor.color;
      const successorChild = successor.right;

      node.value = successor.value;
      successor.value = value;
      successor.toDelete = true;
      node.toDelete = false;

      yield { type: 'LOG', message: t('logs.replaceNode', { value: successor.value }) };

      this.replaceChild(
        successorParent,
        successor,
        successorChild
      );

      yield { type: 'LOG', message: t('logs.twoChildrenDeleted', { value }) };

      if (successorOriginalColor === "black") {
        yield* this.deleteFixup(successorChild, successorParent);
      }
    }

    // 1 child
    else if ((!node.left && node.right) || (node.left && !node.right)) {
      const child = node.left ?? node.right;
      this.replaceChild(parent, node, child);
      yield { type: 'LOG', message: t('logs.oneChildDeleted', { value }) };

      if (node.color === "black") {
        if (child) {
          child.color = 'black';
          yield { type: 'LOG', message: t('logs.oneChildRecolor', { value }) };
        }
      }
    }

    // No children (root)
    else if (node === this.root) {
      this.replaceChild(parent, node, null);
      yield { type: 'LOG', message: t('logs.rootDeleted', { value }) };
    }

    // No children (red)
    else if (node.color === 'red') {
      this.replaceChild(parent, node, null);
      yield { type: 'LOG', message: t('logs.leafDeleted', { value }) };
    }

    // No children (black)
    else {
      this.replaceChild(parent, node, null);
      yield { type: 'LOG', message: t('logs.leafDeleted', { value }) };
      yield* this.deleteFixup(null, parent);
    }
  }

  *deleteFixup(x: RBNode | null, xParent: RBNode | null): Generator<{ type: string; message: string }, void, void> {

    while (x !== this.root && (x === null || x.color === "black")) {

      if (!xParent) break;

      if (x === xParent.left) {
        let w = xParent.right;

        if (w?.color === "red") {
          w.color = "black";
          xParent.color = "red";
          this.rotateLeft(xParent);
          yield { type: "LOG", message: t('logs.fixupCase1') };
          w = xParent.right;
        }

        if (!w) break;
        if (
          (!w.left || w.left.color === "black") &&
          (!w.right || w.right.color === "black")
        ) {
          w.color = "red";
          x = xParent;
          xParent = x.parent;
          yield { type: "LOG", message: t('logs.fixupCase2') };
        }
        else {
          if (!w.right || w.right.color === "black") {
            if (w.left) w.left.color = "black";
            w.color = "red";
            this.rotateRight(w);
            w = xParent.right;
            yield { type: "LOG", message: t('logs.fixupCase3') };
          }

          if (w) {
            w.color = xParent.color;
            xParent.color = "black";
            if (w.right) w.right.color = "black";
            this.rotateLeft(xParent);
            yield { type: "LOG", message: t('logs.fixupCase4') };
          }
          x = this.root;
        }
      }

      else {
        let w = xParent.left;

        if (w?.color === "red") {
          w.color = "black";
          xParent.color = "red";
          this.rotateRight(xParent);
          yield { type: "LOG", message: t('logs.fixupCase1') };
          w = xParent.left;
        }

        if (!w) break;

        if (
          (!w.right || w.right.color === "black") &&
          (!w.left || w.left.color === "black")
        ) {
          w.color = "red";
          x = xParent;
          xParent = x.parent;
          yield { type: "LOG", message: t('logs.fixupCase2') };
        }
        else {
          if (!w.left || w.left.color === "black") {
            if (w.right) w.right.color = "black";
            w.color = "red";
            this.rotateLeft(w);
            w = xParent.left;
            yield { type: "LOG", message: t('logs.fixupCase3') };
          }

          if (w) {
            w.color = xParent.color;
            xParent.color = "black";
            if (w.left) w.left.color = "black";
            this.rotateRight(xParent);
            yield { type: "LOG", message: t('logs.fixupCase4') };
          }
          x = this.root;
        }
      }
    }

    if (x) x.color = "black";
  }


}