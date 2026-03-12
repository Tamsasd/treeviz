import { forwardRef, useImperativeHandle } from "react";
import TreeDisplay from "./TreeDisplay";

import { useTree, type HistoryStep } from "../../hooks/useTree";
import { BinarySearchTree } from "../../core/algorithms/BinarySearchTree";
import { AVLTree } from "../../core/algorithms/AVLTree";
import { RedBlackTree } from "../../core/algorithms/RedBlackTree";
import type { TreeConfig } from "../../types/TreeConfig";
import { AbstractTree } from "../../core/algorithms/AbstractTree";
import type { INode } from "../../core/interfaces/INode";

export interface TreeHandle {
  insert: (val: number) => HistoryStep[];
  search: (val: number) => HistoryStep[];
  deleteNode: (val: number) => HistoryStep[];
  getHistory: () => HistoryStep[];
}

interface TreeWrapperProps {
  config: TreeConfig;
  currentStep: number;
  onStepChange?: React.Dispatch<React.SetStateAction<number>>;
}

const TreeWrapper = forwardRef<TreeHandle, TreeWrapperProps>(
  ({ config, currentStep, onStepChange }, ref) => {
    const getTreeClass = (): new () => AbstractTree<INode> => {
      switch (config.type) {
        case "BST":
          return BinarySearchTree;
        case "AVL":
          return AVLTree;
        case "RB":
          return RedBlackTree;
        default:
          return BinarySearchTree;
      }
    };

    const TreeClass = getTreeClass();
    const treeLogic = useTree(TreeClass);

    useImperativeHandle(ref, () => ({
      insert: (val: number) => treeLogic.insert(val),
      search: (val: number) => treeLogic.search(val),
      deleteNode: (val: number) => treeLogic.deleteNode(val),
      getHistory: () => treeLogic.history,
    }));

    const getSnapshot = () => {
      if (treeLogic.history.length === 0) return null;
      const index = Math.min(currentStep, treeLogic.history.length - 1);
      return treeLogic.history[index]?.rootSnapshot || null;
    };

    const activeIndex =
      treeLogic.history.length > 0
        ? Math.min(currentStep, treeLogic.history.length - 1)
        : 0;

    return (
      <TreeDisplay
        title={config.title}
        root={getSnapshot()}
        history={treeLogic.history}
        actionGroups={treeLogic.actionGroups}
        currentStep={activeIndex}
        onStepChange={onStepChange}
      />
    );
  },
);

TreeWrapper.displayName = "TreeWrapper";

export default TreeWrapper;
