import React from 'react';
import styled from 'styled-components';

const SIZE_CONST = 4;

function indexToHexCoord(index: number) {
  // http://oeis.org/A028896
  const ring = Math.floor((Math.sqrt(12*index+9)-3)/6);
  const ringIndex = index - 3 * ring * (ring+1);

  const sideLength = ring + 2;
  let coords = [ring + 1, ring + 1];
  
  // First side
  coords[1] -= Math.min(ringIndex, sideLength - 1)
  // Second side
  if (ringIndex >= sideLength - 1) {
    const diff = Math.min(ringIndex - (sideLength - 1), sideLength - 1)
    coords[0] -= diff;
    coords[1] -= diff;
  }
  // Third side
  if (ringIndex >= 2 * (sideLength - 1)) {
    const diff = Math.min(ringIndex - 2 * (sideLength - 1), sideLength - 1)
    coords[0] -= diff;
  }
  // Fourth side
  if (ringIndex >= 3 * (sideLength - 1)) {
    const diff = Math.min(ringIndex - 3 * (sideLength - 1), sideLength - 1)
    coords[1] += diff;
  }
  // Fifth side
  if (ringIndex >= 4 * (sideLength - 1)) {
    const diff = Math.min(ringIndex - 4 * (sideLength - 1), sideLength - 1)
    coords[0] += diff;
    coords[1] += diff;
  }
  // Sixth side
  if (ringIndex >= 5 * (sideLength - 1)) {
    const diff = Math.min(ringIndex - 5 * (sideLength - 1), sideLength - 1)
    coords[0] += diff;
  }
  return [coords[0], coords[1]] as [number, number];
}

function hexCoordsToRectCoords(coords: [number,number]) {
  const x = (coords[0] - coords[1]) * .75 // The x position of adjacent hexes differ by 75% of the width of a hex
  const y = -(coords[0] + coords[1]) * .5 // The y position of adjacent hexes differ by 50% of the height of a hex
  return [x, y];
}

const Tile = styled.div<{ tile: number, coords: [number, number], mapSize: [number, number] }>`
  background: url(${({ tile }) => `https://github.com/camzach/GalaxyGen/raw/master/Tiles/${tile}.png`});
  background-size: 100% 100%;
  height: calc(100% / ${({ mapSize }) => mapSize[0]});
  width: calc(100% / ${({ mapSize }) => mapSize[1]});
  position: absolute;
  ${({ coords, mapSize }) => {
    const [left, top] = hexCoordsToRectCoords(coords);
    return `
    top: calc(${top} * (100% / ${mapSize[0]}) + 50%);
    left: calc(${left} * (100% / ${mapSize[1]}) + 50%);
    `;
  }}
  transform: translate(-50%, -50%);
`;

type Props = {
  mapString: number[]
}

export function Map(props: Props) {
  const { mapString } = props;
  const largestRing = Math.floor((Math.sqrt(12*(mapString.length-1)+9)-3)/6) + 1;
  const width = largestRing * 1.5 + 1;
  const height = largestRing * 2 + 1;
  return (
    <div
      style={{
        position: 'relative',
        height: `${SIZE_CONST * Math.sqrt(3) * height}em`,
        width: `${SIZE_CONST * 2 * width}em`,
      }}
    >
      <Tile tile={18} coords={[0, 0]} mapSize={[height, width]} />
      {mapString.map((tileNumber, idx) =>
        <Tile
          key={idx}
          tile={tileNumber}
          mapSize={[height, width]}
          coords={indexToHexCoord(idx)}
        />)}
    </div>
  );
}
