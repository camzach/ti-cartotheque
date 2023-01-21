import React from "react";
import { MapSelector } from "./components/map-selector";
import { MapInfo } from "./components/map-info";
import styles from "./styles.module.css";
import { MapDisplay } from "./components/map-display";

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
  const [selectedSystems, setSelectedSystems] = React.useState<string[]>([]);

  const handleMapSelect = (map: Map | Milty | null) => {
    setSelectedMap(map);
    setSelectedSystems([]);
  };

  return (
    <div className={styles.wrapper}>
      <MapSelector onMapSelect={handleMapSelect} />
      {selectedMap && (
        <>
          <MapDisplay
            map={selectedMap}
            setSelectedSystems={setSelectedSystems}
          />
          <MapInfo map={selectedMap} selectedSystems={selectedSystems} />
        </>
      )}
    </div>
  );
}
