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

const options = [
  {
    label: 'Components',
    options: [{ label: 'Requires PoK', value: 'COMP-POK' }, { label: 'TTS Only', value: 'COMP-TTS' }]
  },
  {
    label: 'Player Count',
    options: [
      ...[3,4,5,6,7,8].map(val => ({ label: val, value: `PC-${val}` }))
    ]
  },
  {
    label: 'Difficulty',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(val => ({ label: val, value: `DIFF-${val}` }))
  }
];

function mapToFilters(map: Map) {
  const filters = [
    `PC-${map.playerCount}`,
    `DIFF-${map.difficulty}`
  ];
  if (map.requiresPoK) {
    filters.push('COMP-POK');
  }
  if (map.ttsOnly) {
    filters.push('COMP-TTS');
  }
  return filters;
}

type Props = {
  maps: Map[]
  loadingMaps: boolean
  setSelectedMap: (mapString: Map | null) => void
}

export function MapSelector(props: Props) {
  const { maps, setSelectedMap, loadingMaps } = props;
  const [ includeFilters, setIncludeFilters ] = React.useState<Array<{ label: string, value: string }>>([]);
  const [ excludeFilters, setExcludeFilters ] = React.useState<Array<{ label: string, value: string }>>([]);
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
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'var(--primary-light)' }}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', height: '2.5em', boxSizing: 'border-box' }}
          placeholder={'Search...'}
        />
        <label>Include</label>
        <Select
          options={options}
          value={includeFilters}
          // @ts-ignore: This won't be null
          onChange={setIncludeFilters}
          isClearable={true}
          isMulti
          closeMenuOnSelect={false}
        />
        <label>Exclude</label>
        <Select
          options={options}
          value={excludeFilters}
          // @ts-ignore: This won't be null
          onChange={setExcludeFilters}
          isClearable={true}
          isMulti
          closeMenuOnSelect={false}
        />
      </div>
      <div style={{ margin: '.5em 0'}}>
        {loadingMaps ?
          <SpinningImage src={images[51]} />
        : maps
          .filter(map =>
            includeFilters?.every(filter => mapToFilters(map).includes(filter.value)) &&
            !excludeFilters?.some(filter => mapToFilters(map).includes(filter.value)) &&
            map.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((map, idx) =>
            <MapButton to={map.name} key={idx} selected={map.name === loadedMapName}>
              {map.name}
            </MapButton>
        )}
      </div>
    </div>
  );
}
