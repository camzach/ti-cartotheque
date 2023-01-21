import React from "react";
import { Map } from "../map";

type Props = {
  slices: string[][];
  names?: string[];
};

export default function MiltyGrid({ slices, names }: Props) {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        overflowY: "scroll",
        gap: "2em",
      }}
    >
      {slices.map((slice, idx) => (
        <div
          style={{ display: "flex", flexDirection: "column" }}
          key={slice.join("")}
        >
          <Map
            mapString={slice}
            selectedTiles={[]}
            setSelectedTiles={() => {}}
            showTileNumbers={false}
          />
          {names?.[idx] && (
            <label style={{ flex: 1, marginTop: "1em", textAlign: "center" }}>
              {names[idx]}
            </label>
          )}
        </div>
      ))}
    </div>
  );
}
