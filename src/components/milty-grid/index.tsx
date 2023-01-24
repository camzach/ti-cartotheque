import React, { useState } from "react";
import { Map } from "../map";
import { normalizeMapString } from "../../utils";
import { Milty } from "../../app";
import { MapInfo } from "../map-info";

function miltyStringToStandardString(map: string[]) {
  const cycle = [5, 0, 3, 6, 1];
  const newArray = [];
  map.forEach((tile, idx) => (newArray[cycle[idx]] = tile));
  newArray[4] = "0";
  newArray[0] = `{${newArray[0]}}`;
  newArray[2] = "-1";
  return newArray;
}

type Props = {
  pool: Milty;
};

export default function MiltyGrid({ pool }: Props) {
  const { sliceStrings, sliceNames } = pool;
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const handleTileSelection = (idx: number) => () => {
    if (selectedSlice !== idx) {
      setSelectedSlice(idx);
    } else {
      setSelectedSlice(null);
    }
  };
  return (
    <>
      <div
        style={{
          display: "grid",
          padding: "2em",
          gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
          overflowY: "auto",
          gap: "2em",
        }}
      >
        {sliceStrings.map((slice, idx) => (
          <div
            style={{ display: "flex", flexDirection: "column" }}
            key={slice.join("") + idx + (selectedSlice === idx)}
          >
            <Map
              mapString={normalizeMapString(miltyStringToStandardString(slice))}
              selectedTiles={selectedSlice === idx ? [-1, 0, 2, 3, 4, 5] : []}
              setSelectedTiles={handleTileSelection(idx)}
              showTileNumbers={false}
            />
            {sliceNames?.[idx] && (
              <label
                style={{
                  flex: 0,
                  marginTop: "1em",
                  textAlign: "center",
                  backgroundColor: "#fed",
                  borderRadius: ".25em",
                  padding: ".25em",
                }}
              >
                {sliceNames[idx]}
              </label>
            )}
          </div>
        ))}
      </div>
      <MapInfo
        map={pool}
        selectedSystems={
          selectedSlice === null ? [] : pool.sliceStrings[selectedSlice]
        }
      />
    </>
  );
}
