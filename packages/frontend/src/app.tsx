import React from 'react';
import { Map } from './components/map';
import { MapSelector } from './components/map-selector';
import { MapInfo } from './components/map-info';
import styled from 'styled-components';
import html2canvas from 'html2canvas';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 15% auto 33%;
  height: 100%;
  overflow: hidden;
`;
const Content = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 5em;
  overflow: hidden;
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

export type Map = {
  name: string,
  mapString: string[],
  sliceNames: string[],
  playerCount: number,
  requiresPoK: boolean,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  comments: string
}

export default function App() {
  const [ selectedMap, setSelectedMap ] = React.useState<Map | null>(null);
  const [ maps, setMaps ] = React.useState<Map[]>([]);
  const [ loadingMaps, setLoadingMaps ] = React.useState(true);
  const [ selectedTiles, setSelectedTiles ] = React.useState<number[]>([]);

  const mapRef = React.useRef<HTMLDivElement>(null);

  const normalizedMapString = React.useMemo(() => {
    if (!selectedMap?.mapString.length) {
      return null;
    }
    const baseString = [...selectedMap.mapString];
    baseString[-1] = /{.*}|18/.test(baseString[0]) ? baseString.shift()?.replace(/[{}]/g, '') as string : '18';
    return baseString
  }, [ selectedMap ]);

  React.useEffect(() => {(async () => {
    const res = await fetch(`/maps`);
    const json = await res.json();
    setMaps(json);
    setLoadingMaps(false);
  })()}, []);

  const handleMapSelect = (map: Map | null) => {
    setSelectedMap(map);
    setSelectedTiles([]);
  }

  return (
    <Wrapper>
      <MapSelector maps={maps} setSelectedMap={handleMapSelect} loadingMaps={loadingMaps} />
      <Content>
        {selectedMap?.mapString && normalizedMapString && <>
          <div style={{ overflow: 'scroll', width: 'calc(100% - 4em)', margin: '2em' }} ref={mapRef}>
            <Map mapString={normalizedMapString} sliceNames={selectedMap.sliceNames} selectedTiles={selectedTiles} setSelectedTiles={setSelectedTiles}/>
          </div>
          <div style={{ margin: '2em' }}>
            <label style={{ color: 'var(--primary-light)' }}>TTS String: </label>
            <input value={selectedMap.mapString.join(' ')} readOnly />
            <CopyButton
              onClick={() => {
                navigator.clipboard.writeText(selectedMap.mapString.join(' '));
              }}
            >
              Copy to clipboard
            </CopyButton>
            <CopyButton onClick={() => {
              if (!mapRef.current) {
                return;
              }
              html2canvas(mapRef.current, { logging: false, backgroundColor: null }).then(canvas => {
                const dataUrl = canvas.toDataURL();
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `${selectedMap.mapString.join(' ')}.png`
                a.click();
                a.remove();
              });
            }}>
              Save image
            </CopyButton>
          </div>
        </>}
      </Content>
      {selectedMap && normalizedMapString &&
        <MapInfo
          map={selectedMap}
          selectedSystems={selectedTiles.map(idx => normalizedMapString[idx])}
        />
      }
    </Wrapper>
  );
}