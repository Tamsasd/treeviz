import { useState, useEffect } from "react";
import TreeCard from "../../components/ui/TreeCard";
import {
  t,
  setLanguage,
  getLanguage,
  type Language,
} from "../../i18n/translations";
import "./startPage.css";

type TreeType = "BST" | "AVL" | "RB" | "B";

type StartConfig = {
  selectedTrees: string[];
  insertValues: number[];
};

type StartPageProps = {
  onStart: (config: StartConfig) => void;
};

function StartPage({ onStart }: StartPageProps) {
  const [selectedTrees, setSelectedTrees] = useState<Set<TreeType>>(new Set());
  const [inputValue, setInputValue] = useState("");
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleLanguageToggle = () => {
    const newLang = currentLang === "hu" ? "en" : "hu";
    setLanguage(newLang);
    setCurrentLang(newLang);
  };

  const handleCardToggle = (type: TreeType) => {
    setSelectedTrees((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const handleStartClick = () => {
    if (selectedTrees.size === 0) {
      alert(t("startPage.selectTreePrompt"));
      return;
    }

    if (!isValidInput) {
      alert(t("startPage.inputInvalidPrompt"));
      return;
    }

    const insertList = inputValue
      .replaceAll(" ", "")
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));

    onStart({
      selectedTrees: Array.from(selectedTrees),
      insertValues: insertList,
    });
  };

  const isValidInput =
    inputValue === "" || /^-?[0-9]+(,\s*-?[0-9]+)*$/.test(inputValue);

  return (
    <div id="startPage">
      <button
        className="theme-toggle"
        onClick={handleThemeToggle}
        title={
          theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
        }
      >
        {theme === "light" ? (
          // Moon Icon (Show in light mode)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
          </svg>
        ) : (
          // Sun Icon (Show in dark mode)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" />
          </svg>
        )}
      </button>

      <button
        className="language-toggle"
        onClick={handleLanguageToggle}
        title={currentLang === "hu" ? "Switch to English" : "Váltás magyarra"}
      >
        {currentLang === "hu" ? "HU" : "EN"}
      </button>

      <div id="title">
        <h1>{t("startPage.title")}</h1>
        <h5>{t("startPage.subtitle")}</h5>
      </div>
      <div id="inputs">
        <div className="insert_div">
          <input
            type="text"
            name="initial_insert"
            id="initial_insert"
            placeholder={t("startPage.placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            pattern="-?[0-9]+(,\s*-?[0-9]+)*"
            style={{
              borderColor:
                inputValue && !isValidInput ? "var(--primary-red)" : undefined,
            }}
          />
          <button onClick={handleStartClick}>
            {t("startPage.startButton")}
          </button>
        </div>
        <div id="tree_selector">
          <TreeCard
            type="BST"
            isSelected={selectedTrees.has("BST")}
            onToggle={() => handleCardToggle("BST")}
          />
          <TreeCard
            type="AVL"
            isSelected={selectedTrees.has("AVL")}
            onToggle={() => handleCardToggle("AVL")}
          />
          <TreeCard
            type="RB"
            isSelected={selectedTrees.has("RB")}
            onToggle={() => handleCardToggle("RB")}
          />
          {/* <TreeCard
            type="B"
            isSelected={selectedTrees.has("B")}
            onToggle={() => handleCardToggle("B")}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default StartPage;
