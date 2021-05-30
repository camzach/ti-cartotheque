import React from 'react';
import { Tile } from './tile';
import { getNeighborDirection, hexCoordToIndex, indexToHexCoord } from './utils';

const SIZE_CONST = 4;

type Props = {
  mapString: number[]
}

export function Map(props: Props) {
  const { mapString } = props;
  const largestRing = Math.floor((Math.sqrt(12*(mapString.length-1)+9)-3)/6) + 1;
  const width = largestRing * 1.5 + 1;
  const height = largestRing * 2 + 1;

  const [ selectedTiles, setSelectedTiles ] = React.useState<number[]>([]);

  const handleTileClick = (coords: [number, number], meta: boolean) => {
    const selectedIndex = hexCoordToIndex(coords);
    if (!meta) {
      if (selectedTiles.includes(selectedIndex)) {
        setSelectedTiles([]);
        return;
      }
      setSelectedTiles([selectedIndex]);
    } else {
      setSelectedTiles(old => [ ...old, selectedIndex ]);
    }
  }

  const mecatolSelectedNeighbors = selectedTiles.map((other) => getNeighborDirection([0, 0], indexToHexCoord(other))).filter(Boolean);
  const mecatolBorders = selectedTiles.includes(-1) ?
    (['n', 's', 'ne', 'nw', 'se', 'sw'] as const).filter((dir) => !mecatolSelectedNeighbors.includes(dir)) :
    [];

  return (
    <div
      style={{
        position: 'relative',
        height: `${SIZE_CONST * Math.sqrt(3) * height}em`,
        width: `${SIZE_CONST * 2 * width}em`,
      }}
    >
      <Tile
        tileNumber={18}
        coords={[0, 0]}
        mapSize={[height, width]}
        onClick={handleTileClick}
        borders={mecatolBorders}
      />
      {mapString.map((tileNumber, idx) => {
        const coords = indexToHexCoord(idx)
        const selectedNeighbors = selectedTiles.map((other) => getNeighborDirection(coords, indexToHexCoord(other))).filter(Boolean);
        const borders = selectedTiles.includes(idx) ? 
          (['n', 's', 'ne', 'nw', 'se', 'sw'] as const).filter((dir) => !selectedNeighbors.includes(dir)) :
          [];
        return <Tile
          key={idx}
          tileNumber={tileNumber}
          mapSize={[height, width]}
          coords={coords}
          borders={borders}
          onClick={handleTileClick}
        />
      })}
    </div>
  );
}
