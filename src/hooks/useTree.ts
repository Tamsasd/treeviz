import { useState } from 'react';
import type { BinaryNode, INode } from '../core/interfaces/INode';
import type { AbstractTree } from '../core/algorithms/AbstractTree';

export interface HistoryStep {
  message: string;
  rootSnapshot: BinaryNode | null;
}

export interface ActionGroup {
  type: 'insert' | 'search' | 'delete';
  value: number;
  steps: HistoryStep[];
  startIndex: number;
  endIndex: number;
}

export const useTree = (TreeClass: new () => AbstractTree<INode>) => {
  const [treeInstance] = useState(() => new TreeClass());
  const [history, setHistory] = useState<HistoryStep[]>([]);
  const [actionGroups, setActionGroups] = useState<ActionGroup[]>([]);

  const safeDeepCopy = (node: any): any => {
    if (!node) return null;

    return JSON.parse(JSON.stringify(node, (key, value) => {
      if (key === 'parent') return undefined;
      return value;
    }));
  };

  const generateSteps = (generator: Generator<any, any, unknown>) => {
    const steps: HistoryStep[] = [];

    let result = generator.next();

    while (!result.done) {
      const snapshot = safeDeepCopy(treeInstance.root);
      steps.push({
        message: result.value?.message || "Step",
        rootSnapshot: snapshot
      });
      result = generator.next();
    }

    return steps;
  };

  const insert = (value: number) => {
    const generator = treeInstance.insert(value);
    const newSteps = generateSteps(generator);

    setHistory(prev => {
      const startIndex = prev.length;
      const endIndex = startIndex + newSteps.length - 1;

      setActionGroups(groups => [...groups, {
        type: 'insert',
        value,
        steps: newSteps,
        startIndex,
        endIndex
      }]);

      return [...prev, ...newSteps];
    });

    return newSteps;
  };

  const search = (value: number) => {
    const generator = treeInstance.search(value);
    const newSteps = generateSteps(generator);

    setHistory(prev => {
      const startIndex = prev.length;
      const endIndex = startIndex + newSteps.length - 1;

      setActionGroups(groups => [...groups, {
        type: 'search',
        value,
        steps: newSteps,
        startIndex,
        endIndex
      }]);

      return [...prev, ...newSteps];
    });

    return newSteps;
  };

  const deleteNode = (value: number) => {
    const generator = treeInstance.delete(value);
    const newSteps = generateSteps(generator);

    setHistory(prev => {
      const startIndex = prev.length;
      const endIndex = startIndex + newSteps.length - 1;

      setActionGroups(groups => [...groups, {
        type: 'delete',
        value,
        steps: newSteps,
        startIndex,
        endIndex
      }]);

      return [...prev, ...newSteps];
    });

    return newSteps;
  };

  const reset = () => {
    treeInstance.root = null;
    setHistory([]);
    setActionGroups([]);
  };

  return {
    root: treeInstance.root,
    insert,
    search,
    deleteNode,
    reset,
    history,
    actionGroups
  };
};