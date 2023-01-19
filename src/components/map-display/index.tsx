import html2canvas from "html2canvas";
import React, { CSSProperties } from "react";
import styles from "./styles.module.scss";
import { Map as MapType } from "../../app";
import { Map } from "./map";

type Props = {
  map: MapType;
  setSelectedSystems: React.Dispatch<React.SetStateAction<string[]>>;
};

export function MapDisplay(props: Props) {
  const { map, setSelectedSystems } = props;
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [showTileNumbers, setShowTileNumbers] = React.useState(false);
  const [showSliceNames, setShowSliceNames] = React.useState(true);

  const [selectedTiles, setSelectedTiles] = React.useState<number[]>([]);

  const normalizedMapString = React.useMemo(() => {
    const baseString = [...map.mapString];
    baseString[-1] = /{.*}|18/.test(baseString[0])
      ? (baseString.shift()?.replace(/[{}]/g, "") as string)
      : "18";
    return baseString;
  }, [map]);

  React.useEffect(() => {
    setSelectedSystems(selectedTiles.map((idx) => normalizedMapString[idx]));
  }, [selectedTiles]);

  return (
    <div className={styles.content}>
      <div
        style={{ overflow: "hidden", width: "calc(100% - 4em)", margin: "2em" }}
        ref={mapRef}
      >
        <Map
          mapString={normalizedMapString}
          sliceNames={showSliceNames ? map.sliceNames : undefined}
          selectedTiles={selectedTiles}
          setSelectedTiles={setSelectedTiles}
          showTileNumbers={showTileNumbers}
        />
      </div>
      <div
        style={{
          padding: "2em",
          backgroundColor: "var(--secondary-dark)",
          color: "var(--secondary-light)",
        }}
      >
        <label>TTS String: </label>
        <input value={map.mapString.join(" ")} readOnly />
        <label
          className={styles["alerting-button"]}
          style={{ "--alert": "'Copied!'" } as CSSProperties}
          onClick={() => {
            navigator.clipboard.writeText(map.mapString.join(","));
          }}
        >
          Copy to clipboard
        </label>
        <label
          className={styles["alerting-button"]}
          style={{ "--alert": "'Saving map...'" } as CSSProperties}
          onClick={() => {
            if (!mapRef.current) {
              return;
            }
            html2canvas(mapRef.current, {
              logging: false,
              backgroundColor: null,
            }).then((canvas) => {
              const dataUrl = canvas.toDataURL();
              const a = document.createElement("a");
              a.href = dataUrl;
              a.download = `${map.mapString.join(" ")}.png`;
              a.click();
              a.remove();
            });
          }}
        >
          Save image
        </label>
        <br />
        <input
          id={"tileNumbers"}
          type="checkbox"
          checked={showTileNumbers}
          onChange={(e) => setShowTileNumbers(e.target.checked)}
        />
        <label htmlFor={"tileNumbers"}>Show tile numbers</label>
        <br />
        <input
          id={"sliceNames"}
          type="checkbox"
          checked={showSliceNames}
          onChange={(e) => setShowSliceNames(e.target.checked)}
        />
        <label htmlFor={"sliceNames"}>Show slice names</label>
      </div>
    </div>
  );
}
