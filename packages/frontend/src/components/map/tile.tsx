import React from 'react';
import styled from 'styled-components';
import { hexCoordsToRectCoords } from './utils';

function sharedTileStyle(props: { coords: [number, number], mapSize: [number, number]}) {
  const { mapSize, coords } = props;
  const [left, top] = hexCoordsToRectCoords(coords);
  return `
    height: calc(100% / ${mapSize[0]});
    width: calc(100% / ${mapSize[1]});
    position: absolute;
    top: calc(${top} * (100% / ${mapSize[0]}) + 50%);
    left: calc(${left} * (100% / ${mapSize[1]}) + 50%);
    transform: translate(-50%, -50%);
    clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  `;
}

const BaseTile = styled.div<{ tile: number, coords: [number, number], mapSize: [number, number] }>`
  background: url(${({ tile }) => `https://github.com/camzach/GalaxyGen/raw/master/Tiles/${tile}.png`});
  background-size: 100% 100%;
  ${sharedTileStyle}
`;
const OutlineSVG = styled.svg`
  ${sharedTileStyle}
`;

type Border = 'n' | 'ne' | 'se' | 's' | 'sw' | 'nw'

const TileOutline = (props: { coords: [number, number], mapSize: [number, number], borders: Border[] }) => {
  const { borders } = props;
  return (
    <OutlineSVG {...props} viewBox="0 0 100 100" preserveAspectRatio="none">
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
    </OutlineSVG>
  );
};

type Props = {
  tileNumber: number
  borders?: Border[]
  coords: [number, number]
  mapSize: [number, number]
  onClick?: (coords: [number, number], metaKey: boolean) => void
}

export function Tile(props: Props) {
  const {
    borders = [],
    coords,
    mapSize,
    onClick = () => {},
    tileNumber
  } = props;

  const handleClick = (e: React.MouseEvent) => {
    onClick(coords, e.ctrlKey || e.metaKey);
  }

  return (
    <div
      onClick={handleClick}
    >
      <BaseTile
        tile={tileNumber}
        coords={coords}
        mapSize={mapSize} 
      />
      <TileOutline borders={borders} coords={coords} mapSize={mapSize} />
    </div>
  );
}
