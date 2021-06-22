import React from 'react';
import styled from 'styled-components';
import { Tile } from './tile';
import { getNeighborDirection, hexCoordToIndex, indexToHexCoord } from './utils';

const MapWrapper = styled.div<{ aspectRatio: number }>`
  position: relative;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: ${({ aspectRatio }) => aspectRatio};
`;

type Props = {
  mapString: string[]
  selectedTiles: number[]
  setSelectedTiles: React.Dispatch<React.SetStateAction<number[]>>
  sliceNames?: string[]
  showTileNumbers: boolean
}

export function Map(props: Props) {
  const { selectedTiles, setSelectedTiles, mapString, sliceNames, showTileNumbers } = props;

  const largestRing = Math.floor((Math.sqrt(12*(mapString.length-1)+9)-3)/6) + 1;
  const width = largestRing * 1.5 + 1;
  const height = largestRing * 2 + 1;
  const aspectRatio = (2 * width) / (Math.sqrt(3) * height);

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

  let sliceIndex = 0;

  return (
    <MapWrapper aspectRatio={aspectRatio}>
      {mapString[-1] !== '-1' && <Tile
        tileNumber={mapString[-1]}
        label={showTileNumbers ? mapString[-1] : undefined}
        coords={[0, 0]}
        mapSize={[height, width]}
        onClick={handleTileClick}
        borders={mecatolBorders}
        onDragStart={handleTileDragStart}
        onDragEnter={handleTileDragEnter}
      />}
      {mapString.map((tileNumber, idx) => {
        if (tileNumber === '-1') {
          return;
        }
        const coords = indexToHexCoord(idx)
        const selectedNeighbors = selectedTiles.map((other) => getNeighborDirection(coords, indexToHexCoord(other))).filter(Boolean);
        const borders = selectedTiles.includes(idx) ? 
          (['n', 's', 'ne', 'nw', 'se', 'sw'] as const).filter((dir) => !selectedNeighbors.includes(dir)) :
          [];
        let label: string | undefined;
        if (showTileNumbers) {
          label = tileNumber;
        }
        if (tileNumber === '0') {
          label = sliceNames?.[sliceIndex++]
        }
        return <Tile
          key={idx}
          tileNumber={tileNumber}
          label={label}
          mapSize={[height, width]}
          coords={coords}
          borders={borders}
          onClick={handleTileClick}
          onDragStart={handleTileDragStart}
          onDragEnter={handleTileDragEnter}
        />
      })}
    </MapWrapper>
  );
}
