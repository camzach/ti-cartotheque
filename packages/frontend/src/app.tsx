import React from "react";
import { Map } from './components/map';
import { Sidebar } from './components/sidebar';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 250px auto;
  height: 100%;
`;
const Content = styled.div`
margin: auto;
`;

export default function App() {
  const [ mapString, setMapString ] = React.useState<number[]>([]);
  const [ maps, setMaps ] = React.useState<Array<{ name: string, mapString: number[], playerCount: number, requiresPoK: boolean }>>([]);
  const [ loadingMaps, setLoadingMaps ] = React.useState(true);

  React.useEffect(() => {(async () => {
    const res = await (await fetch(`${window.location.origin}/maps`)).json()
    setMaps(res);
    setLoadingMaps(false);
  })()}, []);

  console.log(maps);
  return (
  <Wrapper>
    <Sidebar maps={maps} setMapString={setMapString} loadingMaps={loadingMaps} />
    <Content>
      {/* <input type="text" value={mapString.join} onChange={(e) => setMapString(e.target.value)} style={{outline: '1px solid black'}}/> */}
      <Map mapString={mapString} />
    </Content>
  </Wrapper>);
}