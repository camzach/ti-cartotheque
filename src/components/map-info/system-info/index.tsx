import React from "react";
import { countBy, lowerCase, upperFirst } from "lodash";
import { systems } from "./system-data";
import { Histogram } from "./charts";

function getSelectionStats(tileIds: string[]) {
  if (tileIds.length === 0) {
    return null;
  }

  const systemData = tileIds.map((id) => systems[id]).filter(Boolean);

  const wormholes = countBy(
    systemData.flatMap((system) =>
      "wormhole" in system ? [system.wormhole] : []
    )
  );
  const planets = systemData.flatMap((system) =>
    "planets" in system ? system.planets ?? [] : []
  );
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
  };
}

const upperFirstCase = (val: string) =>
  lowerCase(val).split(" ").map(upperFirst).join(" ");

type ValueOf<T> = T[keyof T];
function getSystemName(system: ValueOf<typeof systems>) {
  if ("planets" in system && system.planets) {
    return system.planets.map((planet) => planet.name).join(" / ");
  }
  if ("anomaly" in system && system.anomaly) {
    return `${upperFirstCase(system.anomaly)}${
      "wormhole" in system && system.wormhole
        ? ` / ${upperFirst(system.wormhole)}`
        : ""
    }`;
  }
  if ("wormhole" in system && system.wormhole) {
    return upperFirst(system.wormhole);
  }
  return "Empty Space";
}

type Props = {
  selectedSystems: string[];
};

type NoHyperlanes<T> = T extends { hyperlanes: any } ? never : T;

export function SystemInfo(props: Props) {
  const { selectedSystems } = props;
  const selectionStats = getSelectionStats(selectedSystems);
  const systemData = selectedSystems
    .map((id) => systems[id])
    .filter(
      (system): system is NoHyperlanes<typeof system> =>
        !!system && !("hyperlanes" in system)
    );

  return selectionStats ? (
    <>
      <h1>Selected systems breakdown:</h1>
      <Histogram
        data={systemData.map((system) => [
          getSystemName(system),
          (system.planets ?? [])
            .map((planet) => planet.influence)
            .reduce((total, inf) => total + inf, 0),
        ])}
        title={"Influence Breakdown"}
      />
      <Histogram
        data={systemData.map((system) => [
          getSystemName(system),
          ("planets" in system ? system.planets ?? [] : [])
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
