export type TreeType = 'BST' | 'AVL' | 'RB' | 'B';

export interface TreeConfig {
  id: string;        // azonosító
  type: TreeType;    // algoritmus
  title: string;     // fejléc szöveg
  props?: any;       // extra paraméterek (pl. B-fánál a t=2)
}