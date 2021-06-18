import React from 'react';
import styled from 'styled-components';
import { hexCoordsToRectCoords } from './utils';
import images from './tiles';

const BaseTile = styled.img<{
  coords: [number, number],
  mapSize: [number, number],
  rotation?: number,
}>`${
  (props) => {
  const { mapSize, coords, rotation } = props;
  const [left, top] = hexCoordsToRectCoords(coords);
  return `
    height: calc(100% / ${mapSize[0]});
    width: calc(100% / ${mapSize[1]});
    position: absolute;
    top: calc(${top} * (100% / ${mapSize[0]}) + 50%);
    left: calc(${left} * (100% / ${mapSize[1]}) + 50%);
    transform: translate(-50%, -50%)${rotation ? ` rotate(${rotation}deg)` : ''};
    clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  `;
}}`;

const tileNameRegex = /^([0-9]+[AB]?)([0-6])?$/;

type Border = 'n' | 'ne' | 'se' | 's' | 'sw' | 'nw'

const TileOutline = (props: React.ComponentProps<typeof BaseTile> & { borders: Border[] }) => {
  const { borders } = props;
  return (
    <BaseTile as={'svg'} {...props} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
      <defs>
        <path id="n" d="M 0 0 L 100 0"/>
        <path id="ne" d="M 50 -50 L 150 150"/>
        <path id="se" d="M 50 150 L 125 0"/>
        <path id="s" d="M 0 100 L 100 100"/>
        <path id="sw" d="M -25 0 L 50 150"/>
        <path id="nw" d="M 50 -50 L -50 150"/>
      </defs>
      {borders.map((dir) => 
        <use xlinkHref={`#${dir}`} stroke="var(--secondary-light)" strokeWidth="10px" fill="transparent" key={dir}/>
      )}
    </BaseTile>
  );
};

type Props = {
  tileNumber: string
  label?: string
  borders?: Border[]
  coords: [number, number]
  mapSize: [number, number]
  onClick?: (coords: [number, number], metaKey: boolean) => void
  onDragStart?: (coords: [number, number], metaKey: boolean) => void
  onDragEnter?: (coords: [number, number], metaKey: boolean) => void
}

export function Tile(props: Props) {
  const {
    borders = [],
    coords,
    mapSize,
    onClick = () => {},
    onDragStart = () => {},
    onDragEnter = () => {},
    tileNumber,
    label
  } = props;

  const handleClick = (e: React.MouseEvent) => {
    onClick(coords, e.ctrlKey || e.metaKey);
  }

  const [ _, name, maybeRotation ] = tileNumber.match(tileNameRegex) ?? [];
  let resolvedName = name;
  if (resolvedName === '0') {
    resolvedName = 'HOME';
  }
  if (!images[resolvedName]) {
    resolvedName = 'RED';
  }
  const rotation = (parseInt(maybeRotation) || 0) * 60;

  return (
    <>
      <BaseTile
        src={images[resolvedName]}
        rotation={rotation}
        coords={coords}
        mapSize={mapSize}
        draggable
        onClick={handleClick}
        onDragStart={(e) => {
          // Hack to hide drag image
          e.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
          onDragStart(coords, e.ctrlKey || e.metaKey)
        }}
        onDragEnter={(e) => onDragEnter(coords, e.ctrlKey || e.metaKey)}
      />
      {label && <BaseTile
        as={'label'}
        coords={coords}
        mapSize={mapSize}
        style={{
          clipPath: 'unset',
          height: 'auto',
          width: 'auto',
          backgroundColor: '#fed',
          borderRadius: '25%',
          padding: '.25em',
          zIndex: 5
        }}
      >
        {label}
      </BaseTile>}
      {borders.length > 0 && <TileOutline borders={borders} coords={coords} mapSize={mapSize} />}
    </>
  );
}
