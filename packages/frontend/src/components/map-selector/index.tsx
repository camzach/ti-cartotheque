import React from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch } from 'react-router-dom';
import { Select } from '../select';
import images from '../map/tiles';
import { Map } from '../../app';

const activeStyle = `
  background-color: var(--secondary-dark);
  color: var(--secondary-light);
`
const MapButton = styled(Link)<{ selected: boolean }>`
  cursor: pointer;
  ${({ selected }) => selected ? activeStyle : 'color: var(--secondary-dark);'}
  &:hover {
    ${activeStyle}
  }
  padding: 1em;
  display: block;
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
  maps: Map[]
  loadingMaps: boolean
  setSelectedMap: (mapString: Map | null) => void
}

export function MapSelector(props: Props) {
  const { maps, setSelectedMap, loadingMaps } = props;
  const [ includePOK, setIncludePOK ] = React.useState({ label: 'PoK + Base', value: 2 });
  const [ playerCount, setPlayerCount ] = React.useState({ label: 'Any', value: 0 });
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const currentLocation = useRouteMatch('/:mapName');
  // @ts-ignore
  const loadedMapName = currentLocation?.params['mapName']
  React.useEffect(() => {
    if (loadedMapName) {
      setSelectedMap(
        maps.find(({ name }) => name === loadedMapName) ?? null
      );
    }
  }, [ loadedMapName, maps ]);

  return (
    <div style={{
      backgroundColor: 'var(--primary-light)',
      overflowY: 'scroll',
      height: '100%'
    }}>
      <div>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', height: '2.5em' }}
          placeholder={'Search...'}
        />
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
        .filter(map =>
          (includePOK.value === 2 ||  map.requiresPoK === !!includePOK.value) &&
          (playerCount.value === 0 || map.playerCount === playerCount.value) &&
          map.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((map, idx) =>
          <MapButton to={map.name} key={idx} selected={map.name === loadedMapName}>
            {map.name}
          </MapButton>
      )}
    </div>
  );
}
