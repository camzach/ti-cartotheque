import html2canvas from 'html2canvas';
import React from 'react';
import styled from 'styled-components';
import { Map as MapType } from '../../app';
import { Map } from './map';

const Content = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 20%;
  overflow: hidden;
`;
const AlertingButton = styled.label<{ alert: string }>`
  cursor: pointer;
  position: relative;
  background-color: var(--secondary);
  border: 2px solid var(--secondary-light);
  padding: 0.25em;
  &:active {
    background-color: var(--secondary-light);
    border: 2px solid var(--secondary);
  }
  ::before {
    display: block;
    position: absolute;
    top: -100%;
    height: 1.5em;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: var(--secondary);
    content: '${({ alert }) => alert}';
    width: max-content;
    opacity: 0;
    transition: opacity .5s ease .5s;
  }
  :active::before {
    opacity: 1;
    transition: opacity 0s ease 0s;
  }
`;

type Props = {
  map: MapType,
  setSelectedSystems: React.Dispatch<React.SetStateAction<string[]>>
}

export function MapDisplay(props: Props) {
  const { map, setSelectedSystems } = props;
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [ showTileNumbers, setShowTileNumbers ] = React.useState(false);
  const [ showSliceNames, setShowSliceNames ] = React.useState(true);

  const [ selectedTiles, setSelectedTiles ] = React.useState<number[]>([]);

  const normalizedMapString = React.useMemo(() => {
    const baseString = [...map.mapString];
    baseString[-1] = /{.*}|18/.test(baseString[0]) ? baseString.shift()?.replace(/[{}]/g, '') as string : '18';
    return baseString
  }, [ map ]);

  React.useEffect(() => {
    setSelectedSystems(selectedTiles.map((idx) => normalizedMapString[idx]));
  }, [ selectedTiles ]);

  return (
    <Content>
      <div style={{ overflow: 'scroll', width: 'calc(100% - 4em)', margin: '2em' }} ref={mapRef}>
        <Map
          mapString={normalizedMapString}
          sliceNames={showSliceNames ? map.sliceNames : undefined}
          selectedTiles={selectedTiles}
          setSelectedTiles={setSelectedTiles}
          showTileNumbers={showTileNumbers}
        />
      </div>
      <div style={{ padding: '2em', backgroundColor: 'var(--secondary-dark)', color: 'var(--secondary-light)' }}>
        <label>TTS String: </label>
        <input value={map.mapString.join(' ')} readOnly />
        <AlertingButton
          alert={'Copied!'}
          onClick={() => {
            navigator.clipboard.writeText(map.mapString.join(','));
          }}
        >
          Copy to clipboard
        </AlertingButton>
        <AlertingButton
          alert={'Saving map...'}
          onClick={() => {
            if (!mapRef.current) {
              return;
            }
            html2canvas(mapRef.current, { logging: false, backgroundColor: null }).then(canvas => {
              const dataUrl = canvas.toDataURL();
              const a = document.createElement('a');
              a.href = dataUrl;
              a.download = `${map.mapString.join(' ')}.png`
              a.click();
              a.remove();
            });
          }}
        >
          Save image
        </AlertingButton>
        <br/>
        <input id={'tileNumbers'} type="checkbox" checked={showTileNumbers} onChange={(e) => setShowTileNumbers(e.target.checked)} />
        <label htmlFor={'tileNumbers'}>Show tile numbers</label>
        <br/>
        <input id={'sliceNames'} type="checkbox" checked={showSliceNames} onChange={(e) => setShowSliceNames(e.target.checked)} />
        <label htmlFor={'sliceNames'}>Show slice names</label>
      </div>
    </Content>
  );
}