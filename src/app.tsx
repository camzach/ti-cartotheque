import React from "react";
import { MapSelector } from "./components/map-selector";
import styles from "./styles.module.css";
import { MapDisplay } from "./components/map-display";
import MiltyGrid from "./components/milty-grid";

type BaseMap = {
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  sliceNames?: string[];
  requiresPoK: boolean;
  ttsOnly: boolean;
  comments: string;
};

export type Map = BaseMap & {
  type: "prebuilt";
  mapString: string[];
  playerCount: number;
};

export type Milty = BaseMap & {
  type: "milty";
  sliceStrings: string[][];
};

export default function App() {
  const [selectedMap, setSelectedMap] = React.useState<Map | Milty | null>(
    null
  );

  return (
    <div className={styles.wrapper}>
      <MapSelector onMapSelect={setSelectedMap} />
      {(() => {
        switch (selectedMap?.type) {
          case "prebuilt":
            return <MapDisplay map={selectedMap} key={selectedMap.name} />;
          case "milty":
            return <MiltyGrid pool={selectedMap} key={selectedMap.name} />;
        }
      })()}
    </div>
  );
}
