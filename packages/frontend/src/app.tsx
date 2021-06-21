import React from 'react';
import { Map } from './components/map-display/map';
import { MapSelector } from './components/map-selector';
import { MapInfo } from './components/map-info';
import styled from 'styled-components';
import { MapDisplay } from './components/map-display';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 15% auto 33%;
  height: 100%;
  overflow: hidden;
`;

export type Map = {
  name: string,
  mapString: string[],
  sliceNames: string[],
  playerCount: number,
  requiresPoK: boolean,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  comments: string,
  ttsOnly: boolean
}

export default function App() {
  const [ selectedMap, setSelectedMap ] = React.useState<Map | null>(null);
  const [ maps, setMaps ] = React.useState<Map[]>([]);
  const [ loadingMaps, setLoadingMaps ] = React.useState(true);
  const [ selectedSystems, setSelectedSystems ] = React.useState<string[]>([]);

  React.useEffect(() => {(async () => {
    const res = await fetch(`/maps`);
    const json = await res.json();
    setMaps(json);
    setLoadingMaps(false);
  })()}, []);

  const handleMapSelect = (map: Map | null) => {
    setSelectedMap(map);
    setSelectedSystems([]);
  }

  return (
    <Wrapper>
      <MapSelector maps={maps} setSelectedMap={handleMapSelect} loadingMaps={loadingMaps} />
      {selectedMap &&
      <>
        <MapDisplay
          map={selectedMap}
          setSelectedSystems={setSelectedSystems}
        />
        <MapInfo
          map={selectedMap}
          selectedSystems={selectedSystems}
        />
      </>
      }
    </Wrapper>
  );
}