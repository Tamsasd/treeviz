import { useState } from "react";
import StartPage from "./pages/StartPage/StartPage";
import App from "./pages/SimulatorPage/SimulatorPage";

type StartConfig = {
  selectedTrees: string[];
  insertValues: number[];
};

function Root() {
  const [config, setConfig] = useState<StartConfig | null>(null);

  if (!config) {
    return <StartPage onStart={setConfig} />;
  }

  return (
    <App
      selectedTrees={config.selectedTrees}
      insertValues={config.insertValues}
    />
  );
}

export default Root;
