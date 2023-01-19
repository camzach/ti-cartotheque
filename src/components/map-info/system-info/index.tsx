import React from "react";
import { countBy, lowerCase, upperFirst } from "lodash";
import data from "./system-data.json";
import { Histogram } from "./charts";

function getSystemInfo(tileIds: string[]) {
  if (tileIds.length === 0) {
    return null;
  }

  const systems = tileIds
    .map((id) => data.all[id as any as keyof typeof data.all])
    .filter(Boolean);

  const wormholes = countBy(
    systems.map((system) => system.wormhole).filter(Boolean)
  );
  const types = countBy(systems.map((system) => system.type));

  const planets = systems.map((system) => system.planets).flat();
  const resources = planets.reduce((sum, planet) => planet.resources + sum, 0);
  const resourceBreakdown = countBy(planets, "resources");
  const influence = planets.reduce((sum, planet) => planet.influence + sum, 0);
  const influenceBreakdown = countBy(planets, "influence");

  return {
    resources,
    resourceBreakdown,
    influence,
    influenceBreakdown,
    wormholes,
    types,
  };
}

type ValueOf<T> = T[keyof T];
function getSystemName(system: ValueOf<(typeof data)["all"]>) {
  if (system.planets.length > 0) {
    return system.planets.map((planet) => planet.name).join(" / ");
  }
  if ("anomaly" in system && system.anomaly) {
    return (
      lowerCase(system.anomaly)
        .split(" ")
        .map((word) => upperFirst(word))
        .join(" ") +
      (system.wormhole ? ` / ${upperFirst(system.wormhole)}` : "")
    );
  }
  if (system.wormhole) {
    return upperFirst(system.wormhole);
  }
  return "Empty Space";
}

type Props = {
  selectedSystems: string[];
};

export function SystemInfo(props: Props) {
  const { selectedSystems } = props;
  const systemInfo = getSystemInfo(selectedSystems);
  const systems = selectedSystems
    .map((id) => data.all[id as any as keyof typeof data.all])
    .filter(Boolean);

  return systemInfo ? (
    <>
      <h1>Selected systems breakdown:</h1>
      <Histogram
        data={systems.map((system) => [
          getSystemName(system),
          system.planets
            .map((planet) => planet.influence)
            .reduce((total, inf) => total + inf, 0),
        ])}
        title={"Influence Breakdown"}
      />
      <Histogram
        data={systems.map((system) => [
          getSystemName(system),
          system.planets
            .map((planet) => planet.resources)
            .reduce((total, res) => total + res, 0),
        ])}
        title={"Resource Breakdown"}
      />
    </>
  ) : (
    <>'Select some systems to view statistics...'</>
  );
}
