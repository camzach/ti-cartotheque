import React from 'react';
import { Map } from '../../app';
import { SystemInfo } from './system-info';
import styled from 'styled-components';

const Container = styled.div`
  color: var(--primary-dark);
  background-color: var(--primary-light);
  overflow: auto;
  padding: 1em;
`;

type Props = {
  map: Map
  selectedSystems: string[]
}

export function MapInfo(props: Props) {
  const { map, selectedSystems } = props;
  return (
    <Container>
    { selectedSystems.length > 0 ?
      <SystemInfo selectedSystems={selectedSystems} /> :
      <>
      <h1>{map.name}</h1>
      <h2>Player count</h2>
      {map.playerCount}
      {map.comments &&
        <>
          <h2>Cartographer's comments:</h2>
          <p>{map.comments}</p>
        </>
      }
      <p style={{ marginTop: '5em' }}>
        Select some systems for a resource/influence breakdown.
      </p>
      </>
    }
    </Container>
  );
}
