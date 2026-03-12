import { t } from "../../i18n/translations";

type TreeType = "BST" | "AVL" | "RB" | "B";

type TreeCardProps = {
  type: TreeType;
  isSelected: boolean;
  onToggle: () => void;
};

function TreeCard({ type, isSelected, onToggle }: TreeCardProps) {
  const TREE_DATA = {
    BST: { name: t("trees.bst"), img: "assets/bst.svg" },
    AVL: { name: t("trees.avl"), img: "assets/avl.svg" },
    RB: { name: t("trees.rb"), img: "assets/rb.svg" },
    B: { name: t("trees.b"), img: "assets/rb.svg" },
  };

  const tree = TREE_DATA[type];

  return (
    <div
      className={`tree ${isSelected ? "selected" : ""}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-pressed={isSelected}
    >
      <h3 className="tree_name">{tree.name}</h3>
      <img src={tree.img} alt={tree.name} />
    </div>
  );
}

export default TreeCard;
