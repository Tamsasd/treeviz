import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import ValueController from "../../components/controls/ValueController";
import TimeController from "../../components/controls/TimeController";
import TreeWrapper, {
  type TreeHandle,
} from "../../components/visualization/TreeWrapper";
import { type TreeConfig } from "../../types/TreeConfig";
import { usePlayer } from "../../hooks/usePlayer";
import { t } from "../../i18n/translations";
import "./SimulatorPage.css";

type AppProps = {
  selectedTrees: string[];
  insertValues: number[];
};

type TreeBaseMap = Map<string, number>;

function App({ selectedTrees, insertValues }: AppProps) {
  const activeTrees = useMemo<TreeConfig[]>(() => {
    const trees: TreeConfig[] = [];

    if (selectedTrees.includes("BST")) {
      trees.push({ id: "bst", type: "BST", title: t("trees.bst") });
    }
    if (selectedTrees.includes("AVL")) {
      trees.push({ id: "avl", type: "AVL", title: t("trees.avl") });
    }
    if (selectedTrees.includes("RB")) {
      trees.push({ id: "rb", type: "RB", title: t("trees.rb") });
    }

    return trees;
  }, [selectedTrees]);

  const treeRefs = useRef<Map<string, TreeHandle>>(new Map());
  const hasInitialized = useRef(false);

  const treeLengths = useRef<Map<string, number>>(new Map());

  const [treeBaseIndices, setTreeBaseIndices] = useState<TreeBaseMap>(
    new Map(),
  );

  const [currentActionDuration, setCurrentActionDuration] = useState(0);

  const player = usePlayer({
    maxSteps: currentActionDuration,
    initialStep: 0,
  });

  useEffect(() => {
    if (hasInitialized.current || treeRefs.current.size === 0) {
      return;
    }

    const initialBases = new Map<string, number>();

    activeTrees.forEach((tree) => {
      const handle = treeRefs.current.get(tree.id);
      if (handle) {
        let totalStepsForTree = 0;

        insertValues.forEach((val) => {
          const newSteps = handle.insert(val);
          totalStepsForTree += newSteps.length;
        });

        treeLengths.current.set(tree.id, totalStepsForTree);

        initialBases.set(tree.id, Math.max(0, totalStepsForTree - 1));
      }
    });

    setTreeBaseIndices(initialBases);
    setCurrentActionDuration(0);
    player.setCurrentStep(0);
    hasInitialized.current = true;
  }, [insertValues, activeTrees, player]);

  const executeOnAllTrees = useCallback(
    (action: (handle: TreeHandle) => any[]) => {
      const newBases = new Map(treeBaseIndices);
      let maxNewSteps = 0;

      activeTrees.forEach((tree) => {
        const handle = treeRefs.current.get(tree.id);
        if (handle) {
          const currentLength = treeLengths.current.get(tree.id) || 0;

          const baseIndex = Math.max(0, currentLength - 1);
          newBases.set(tree.id, baseIndex);

          const newSteps = action(handle);
          const addedLength = newSteps.length;

          treeLengths.current.set(tree.id, currentLength + addedLength);

          if (addedLength > maxNewSteps) {
            maxNewSteps = addedLength;
          }
        }
      });

      setTreeBaseIndices(newBases);

      const totalFrames = maxNewSteps > 0 ? maxNewSteps + 1 : 0;
      setCurrentActionDuration(totalFrames);

      player.setCurrentStep(0);
      player.setIsPlaying(true);
    },
    [activeTrees, player, treeBaseIndices],
  );

  const handleGlobalInsert = useCallback(
    (value: number) => {
      executeOnAllTrees((handle) => handle.insert(value));
    },
    [executeOnAllTrees],
  );

  const handleGlobalSearch = useCallback(
    (value: number) => {
      executeOnAllTrees((handle) => handle.search(value));
    },
    [executeOnAllTrees],
  );

  const handleGlobalDelete = useCallback(
    (value: number) => {
      executeOnAllTrees((handle) => handle.deleteNode(value));
    },
    [executeOnAllTrees],
  );

  const handleStepChange: React.Dispatch<React.SetStateAction<number>> =
    useCallback(
      (value) => {
        player.setIsPlaying(false);
        if (typeof value === "function") {
          player.setCurrentStep((prev) => value(prev));
        } else {
          player.setCurrentStep(value);
        }
      },
      [player],
    );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        if (document.activeElement?.tagName !== "INPUT") {
          e.preventDefault();
        }
      }

      if (e.key === "ArrowLeft") player.handlePrev();
      if (e.key === "ArrowRight") player.handleNext();
      if (e.key === " " && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        player.handlePlayPause();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [player]);

  // Horizontal scroll with mouse wheel
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        gridElement.scrollLeft += e.deltaY;
      }
    };

    gridElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      gridElement.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="app-layout">
      <header className="header">
        <ValueController
          onInsert={handleGlobalInsert}
          onSearch={handleGlobalSearch}
          onDelete={handleGlobalDelete}
        />
        <TimeController
          currentStep={player.currentStep}
          totalSteps={currentActionDuration}
          isPlaying={player.isPlaying}
          onFirst={player.handleFirst}
          onPrev={player.handlePrev}
          onPlayPause={player.handlePlayPause}
          onNext={player.handleNext}
          onLast={player.handleLast}
          onStepChange={player.handleSlider}
          onSpeedChange={player.handleSpeedChange}
          speed={player.speed}
        />
      </header>

      <main id="main-content" className="trees-grid multi" ref={gridRef}>
        {activeTrees.map((treeConfig) => {
          const baseIndex = treeBaseIndices.get(treeConfig.id) || 0;
          const relativeStep = player.currentStep;

          return (
            <TreeWrapper
              key={treeConfig.id}
              config={treeConfig}
              currentStep={baseIndex + relativeStep}
              onStepChange={handleStepChange}
              ref={(element) => {
                if (element) {
                  treeRefs.current.set(treeConfig.id, element);
                } else {
                  treeRefs.current.delete(treeConfig.id);
                }
              }}
            />
          );
        })}
      </main>
    </div>
  );
}

export default App;
