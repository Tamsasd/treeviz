import type { INode } from "../interfaces/INode";

export abstract class AbstractTree<NodeType extends INode> {
  root: NodeType | null = null;

  protected generateId(): string {
    return crypto.randomUUID();
  }

  abstract insert(value: number): Generator<any>
  abstract search(value: number): Generator<any>
  abstract delete(value: number): Generator<any>

  abstract resetVisuals(): void;
}