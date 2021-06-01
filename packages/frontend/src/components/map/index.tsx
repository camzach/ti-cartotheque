import React from 'react';
import { Tile } from './tile';
import { getNeighborDirection, hexCoordToIndex, indexToHexCoord } from './utils';
import { countBy, Dictionary } from 'lodash';

const SIZE_CONST = 4;

type Props = {
  mapString: number[]
  selectedTiles: number[]
  setSelectedTiles: React.Dispatch<React.SetStateAction<number[]>>
}

export function Map(props: Props) {
  const { selectedTiles, setSelectedTiles } = props;

  const mapString = [ ...props.mapString ];
  mapString[-1] = 18;
  const largestRing = Math.floor((Math.sqrt(12*(mapString.length-1)+9)-3)/6) + 1;
  const width = largestRing * 1.5 + 1;
  const height = largestRing * 2 + 1;

  const handleTileClick = (coords: [number, number], meta: boolean) => {
    const selectedIndex = hexCoordToIndex(coords);
    if (!meta) {
      // No meta key held, select only this tile or deselect all
      if (selectedTiles.includes(selectedIndex)) {
        setSelectedTiles([]);
        return;
      }
      setSelectedTiles([selectedIndex]);
    } else {
      // Meta key held, addatively select/deselect this tile
      if (!selectedTiles.includes(selectedIndex)) {
        setSelectedTiles(old => [ ...old, selectedIndex ]);
      } else {
        setSelectedTiles(old => old.filter(tile => tile !== selectedIndex))
      }
    }
  }

  const [ dragMode, setDragMode ] = React.useState<'add' | 'remove'>('add');

  const handleTileDragStart = (coords: [number, number], meta: boolean) => {
    const selectedIndex = hexCoordToIndex(coords);
    if (!meta) {
      setDragMode('add');
      setSelectedTiles([]);
    } else if (selectedTiles.includes(selectedIndex)) {
      setDragMode('remove');
    } else {
      setDragMode('add');
    }
  }

  const handleTileDragEnter = (coords: [number, number]) => {
    const selectedIndex = hexCoordToIndex(coords);
    if (dragMode === 'add') {
      if (!selectedTiles.includes(selectedIndex)) {
        setSelectedTiles(old => [ ...old, selectedIndex ]);
      }
    } else if (dragMode === 'remove') {
      setSelectedTiles(old => old.filter(tile => tile !== selectedIndex));
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
        onDragStart={handleTileDragStart}
        onDragEnter={handleTileDragEnter}
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
          onDragStart={handleTileDragStart}
          onDragEnter={handleTileDragEnter}
        />
      })}
    </div>
  );
}
