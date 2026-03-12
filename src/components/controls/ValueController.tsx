import { useState } from "react";
import { t } from "../../i18n/translations";

interface ValueControllerProps {
  onInsert: (value: number) => void;
  onSearch: (value: number) => void;
  onDelete: (value: number) => void;
}

function ValueController({
  onInsert,
  onSearch,
  onDelete,
}: ValueControllerProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInsert = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      onInsert(val);
      setInputValue("");
    }
  };

  const handleSearch = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      onSearch(val);
      setInputValue("");
    }
  };

  const handleDelete = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      onDelete(val);
      setInputValue("");
    }
  };

  return (
    <div className="value-control">
      <input
        type="number"
        id="value"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={t("controls.placeholder")}
      />

      {/* Insert Button */}
      <button onClick={handleInsert} title={t("controls.insert")} type="button">
        <span>{t("controls.insert")}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="currentColor"
        >
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </button>

      {/* Search Button */}
      <button onClick={handleSearch} title={t("controls.search")} type="button">
        <span>{t("controls.search")}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="currentColor"
        >
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>
      </button>

      {/* Delete Button */}
      <button onClick={handleDelete} title={t("controls.delete")} type="button">
        <span>{t("controls.delete")}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="currentColor"
        >
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      </button>
    </div>
  );
}

export default ValueController;
