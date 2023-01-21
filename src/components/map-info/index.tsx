import React from "react";
import { Map, Milty } from "../../app";
import { SystemInfo } from "./system-info";
import styles from "./styles.module.css";

type Props = {
  map: Map | Milty;
  selectedSystems: string[];
};

export function MapInfo(props: Props) {
  const { map, selectedSystems } = props;
  return (
    <div className={styles.container}>
      {selectedSystems.length > 0 ? (
        <SystemInfo selectedSystems={selectedSystems} />
      ) : (
        <>
          <h1>{map.name}</h1>
          {map.type === "prebuilt" && (
            <>
              <h2>Player count</h2>
              {map.playerCount}
            </>
          )}
          {map.comments && (
            <>
              <h2>Cartographer's comments:</h2>
              <p>{map.comments}</p>
            </>
          )}
          <p style={{ marginTop: "5em" }}>
            Select some systems for a resource/influence breakdown.
          </p>
        </>
      )}
    </div>
  );
}
