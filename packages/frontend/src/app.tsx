import React from "react";
import { Map } from './components/map';
import { MapSelector } from './components/map-selector';
import { SystemInfo } from './components/system-info';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 250px auto 500px;
  height: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const CopyButton = styled.label`
  content: 'Copy';
  cursor: pointer;
  position: relative;
  background-color: var(--primary);
  border: 2px solid var(--primary-light);
  padding: 0.25em;
  &:active {
    background-color: var(--primary-light);
    border: 2px solid var(--primary);
  }
  ::before {
    display: block;
    position: absolute;
    top: -1.5em;
    height: 1.5em;
    background-color: var(--secondary);
    content: 'Copied!';
    opacity: 0;
    transition: opacity .5s ease .5s;
  }
  :active::before {
    opacity: 1;
    transition: opacity 0s ease 0s;
  }
`;

export default function App() {
  const [ mapString, setMapString ] = React.useState<number[] | null>(null);
  const [ maps, setMaps ] = React.useState<Array<{ name: string, mapString: number[], playerCount: number, requiresPoK: boolean }>>([]);
  const [ loadingMaps, setLoadingMaps ] = React.useState(true);
  const [ selectedTiles, setSelectedTiles ] = React.useState<number[]>([]);

  React.useEffect(() => {(async () => {
    const res = await fetch(`${window.location.origin}/maps`);
    const json = await res.json();
    setMaps(json);
    setLoadingMaps(false);
  })()}, []);

  return (
  <Wrapper>
    <MapSelector maps={maps} setMapString={setMapString} loadingMaps={loadingMaps} />
    <Content>
      {mapString && <>
        <Map mapString={mapString} selectedTiles={selectedTiles} setSelectedTiles={setSelectedTiles} />
        <div style={{ margin: '2em' }}>
          <label style={{ color: 'var(--primary-light)' }}>TTS String: </label>
          <input value={mapString.join(' ')} readOnly />
          <CopyButton
            onClick={() => {
              navigator.clipboard.writeText(mapString.join(' '));
            }}
          >
            Copy to clipboard
          </CopyButton>
        </div>
      </>}
    </Content>
    {mapString && <SystemInfo selectedTiles={selectedTiles.map(idx => idx === -1 ? 18 : mapString[idx])} />}
  </Wrapper>);
}