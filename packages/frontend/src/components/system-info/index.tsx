import React from 'react';
import countBy from 'lodash/countBy';
import data from './system-data.json';
import styled from 'styled-components';
import { Histogram } from './charts';

const Container = styled.div`
  color: var(--primary-dark);
  background-color: var(--primary-light);
  overflow: scroll;
`;

function getSystemInfo(tileIds: string[]) {
  if (tileIds.length === 0) {
    return null;
  }

  const systems = tileIds.map(id => data.all[id as any as keyof typeof data.all]).filter(Boolean);

  const wormholes = countBy(systems.map(system => system.wormhole).filter(Boolean));
  const types = countBy(systems.map(system => system.type));

  const planets = systems.map(system => system.planets).flat();
  const resources = planets.reduce((sum, planet) => planet.resources + sum, 0);
  const resourceBreakdown = countBy(planets, 'resources');
  const influence = planets.reduce((sum, planet) => planet.influence + sum, 0);
  const influenceBreakdown = countBy(planets, 'influence');

  return { resources, resourceBreakdown, influence, influenceBreakdown, wormholes, types };
}

type Props = {
  selectedSystems: string[]
}

export function SystemInfo(props: Props) {
  const { selectedSystems } = props;
  const systemInfo = getSystemInfo(selectedSystems);
  const systems = selectedSystems.map(id => data.all[id as any as keyof typeof data.all]).filter(Boolean);

  return (
    <Container>
      {systemInfo ?
        <>
          <h1>Selected systems breakdown:</h1>
          <Histogram
            data={systems.map(system => [
              system.planets.map(planet => planet.name).join(' / '),
              system.planets.map(planet => planet.influence).reduce((total, inf) => total + inf, 0)
            ])}
            title={'Influence Breakdown'}
          />
          <Histogram
            data={systems.map(system => [
              system.planets.map(planet => planet.name).join(' / '),
              system.planets.map(planet => planet.resources).reduce((total, res) => total + res, 0)
            ])}
            title={'Resource Breakdown'}
          />
        </> :
        'Select some systems to view statistics...'
      }
    </Container>
  );
}
