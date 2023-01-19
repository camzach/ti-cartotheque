import React, { CSSProperties } from "react";
import styles from "./styles.module.scss";
import { hexCoordsToRectCoords } from "./utils";

const tileNameRegex = /^([0-9]+[AB]?)([0-6])?$/;

type Border = "n" | "ne" | "se" | "s" | "sw" | "nw";

const TileOutline = (
  props: React.HTMLAttributes<SVGElement> & {
    borders: Border[];
    mapSize: [number, number];
    coords: [number, number];
  }
) => {
  const { borders, mapSize, coords } = props;
  const [x, y] = hexCoordsToRectCoords(coords);
  return (
    <svg
      className={styles["base-tile"]}
      style={
        {
          "--x": x,
          "--y": y,
          "--mapW": mapSize[0],
          "--mapH": mapSize[1],
          pointerEvents: "none",
        } as CSSProperties
      }
      {...props}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <path id="n" d="M 0 0 L 100 0" />
        <path id="ne" d="M 50 -50 L 150 150" />
        <path id="se" d="M 50 150 L 125 0" />
        <path id="s" d="M 0 100 L 100 100" />
        <path id="sw" d="M -25 0 L 50 150" />
        <path id="nw" d="M 50 -50 L -50 150" />
      </defs>
      {borders.map((dir) => (
        <use
          xlinkHref={`#${dir}`}
          stroke="var(--secondary-light)"
          strokeWidth="10px"
          fill="transparent"
          key={dir}
        />
      ))}
    </svg>
  );
};

type Props = {
  tileNumber: string;
  label?: string;
  borders?: Border[];
  coords: [number, number];
  mapSize: [number, number];
  onClick?: (coords: [number, number], metaKey: boolean) => void;
  onDragStart?: (coords: [number, number], metaKey: boolean) => void;
  onDragEnter?: (coords: [number, number], metaKey: boolean) => void;
};

export function Tile(props: Props) {
  const {
    borders = [],
    coords,
    mapSize,
    onClick = () => {},
    onDragStart = () => {},
    onDragEnter = () => {},
    tileNumber,
    label,
  } = props;

  const handleClick = (e: React.MouseEvent) => {
    onClick(coords, e.ctrlKey || e.metaKey);
  };

  const [_, name, maybeRotation] = tileNumber.match(tileNameRegex) ?? [];
  let resolvedName = name;
  resolvedName ??= "39_Back";
  const rotation = (parseInt(maybeRotation) || 0) * 60;
  const [x, y] = hexCoordsToRectCoords(coords);

  return (
    <>
      <img
        className={styles["base-tile"]}
        style={
          {
            "--angle": `${rotation}deg`,
            "--x": x,
            "--y": y,
            "--mapW": mapSize[0],
            "--mapH": mapSize[1],
          } as CSSProperties
        }
        src={`https://keeganw.github.io/ti4/tiles/ST_${resolvedName}.png`}
        draggable
        onClick={handleClick}
        onDragStart={(e) => {
          // Hack to hide drag image
          e.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
          onDragStart(coords, e.ctrlKey || e.metaKey);
        }}
        onDragEnter={(e) => onDragEnter(coords, e.ctrlKey || e.metaKey)}
      />
      {label && (
        <label
          className={styles["base-tile"]}
          style={
            {
              clipPath: "unset",
              height: "auto",
              width: "auto",
              backgroundColor: "#fed",
              borderRadius: ".25em",
              padding: ".25em",
              zIndex: 5,
              "--x": x,
              "--y": y,
              "--mapW": mapSize[0],
              "--mapH": mapSize[1],
            } as CSSProperties
          }
        >
          {label}
        </label>
      )}
      {borders.length > 0 && (
        <TileOutline borders={borders} coords={coords} mapSize={mapSize} />
      )}
    </>
  );
}
