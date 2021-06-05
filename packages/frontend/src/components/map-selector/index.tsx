import React from 'react';
import styled from 'styled-components';
import { Select } from '../select';
import images from '../map/tiles';

const MapButton = styled.div`
  cursor: pointer;
  color: var(--secondary-dark);
  &:hover {
    background-color: var(--secondary-dark);
    color: var(--secondary-light);
  }
  padding: 1em;
`;
const SpinningImage = styled.img`
  animation-name: spin;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  transform-origin: center;
  width: 100%;
  margin-top: 2em;
  @keyframes spin {
    0% {
      transform:rotate(0deg) scale(20%);
    }
    50% {
      transform:rotate(360deg) scale(100%);
    }
    100% {
      transform:rotate(720deg) scale(20%);
    }
  }
`;

type Props = {
  maps: Array<{ name: string, mapString: string[], requiresPoK: boolean, playerCount: number }>
  loadingMaps: boolean
  setMapString: (mapString: string[]) => void
}

export function MapSelector(props: Props) {
  const { maps, setMapString, loadingMaps } = props;
  const [ includePOK, setIncludePOK ] = React.useState({ label: 'PoK + Base', value: 2 });
  const [ playerCount, setPlayerCount ] = React.useState({ label: 'Any', value: 0 });

  return (
    <div style={{
      backgroundColor: 'var(--primary-light)',
      overflowY: 'scroll',
      height: '100%'
    }}>
      <div>
        <Select
          options={[
            { label: 'PoK + Base', value: 2 },
            { label: 'Base only', value: 0 },
            { label: 'PoK only', value: 1 }
          ]}
          value={includePOK}
          onChange={(val) => setIncludePOK(val as typeof includePOK)}
          isClearable={false}
        />
        <Select
          onChange={(value) => setPlayerCount(value as typeof playerCount)}
          value={playerCount}
          options={[
            { label: 'Any', value: 0 },
            ...[3,4,5,6,7,8].map(val => ({ label: val, value: val }))
          ]}
          isClearable={false}
        />
      </div>
      {loadingMaps ?
        <SpinningImage src={images[51]} />
      : maps
        .filter(map => (includePOK.value === 2 ||  map.requiresPoK === !!includePOK.value) && (playerCount.value === 0 || map.playerCount === playerCount.value))
        .map((map, idx) =>
          <MapButton onClick={() => setMapString(map.mapString)} key={idx}>
            {map.name}
          </MapButton>
      )}
    </div>
  );
}
