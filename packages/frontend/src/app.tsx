import React from 'react';
import { Map } from './components/map';
import { MapSelector } from './components/map-selector';
import { SystemInfo } from './components/system-info';
import styled from 'styled-components';
import html2canvas from 'html2canvas';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 250px auto 500px;
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

export default function App() {  
  const [ mapString, setMapString ] = React.useState<string[] | null>(null);
  const [ maps, setMaps ] = React.useState<Array<{ name: string, mapString: string[], playerCount: number, requiresPoK: boolean }>>([]);
  const [ loadingMaps, setLoadingMaps ] = React.useState(true);
  const [ selectedTiles, setSelectedTiles ] = React.useState<number[]>([]);

  const mapRef = React.useRef<HTMLDivElement>(null);

  const normalizedMapString = React.useMemo(() => {
    if (!mapString?.length) {
      return null;
    }
    const baseString = [...mapString ?? []];
    baseString[-1] = /{.*}|18/.test(baseString[0]) ? baseString.shift()?.replace(/[{}]/g, '') as string : '18';
    return baseString
  }, [ mapString ]);

  React.useEffect(() => {(async () => {
    const res = await fetch(`/maps`);
    const json = await res.json();
    setMaps(json);
    setLoadingMaps(false);
  })()}, []);

  const handleMapSelect = (map: string[]) => {
    setMapString(map);
    setSelectedTiles([]);
  }

  return (
    <Wrapper>
      <MapSelector maps={maps} setMapString={handleMapSelect} loadingMaps={loadingMaps} />
      <Content>
        {mapString && normalizedMapString && <>
          <div style={{ overflow: 'scroll', width: 'calc(100% - 4em)', margin: '2em' }} ref={mapRef}>
            <Map mapString={normalizedMapString} selectedTiles={selectedTiles} setSelectedTiles={setSelectedTiles}/>
          </div>
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
            <CopyButton onClick={() => {
              if (!mapRef.current) {
                return;
              }
              html2canvas(mapRef.current, { logging: false, backgroundColor: null }).then(canvas => {
                const dataUrl = canvas.toDataURL();
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `${mapString.join(' ')}.png`
                a.click();
                a.remove();
              });
            }}>
              Save image
            </CopyButton>
          </div>
        </>}
      </Content>
      {normalizedMapString && <SystemInfo selectedSystems={selectedTiles.map(idx => normalizedMapString[idx])} />}
    </Wrapper>
  );
}