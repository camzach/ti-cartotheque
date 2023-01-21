export function indexToHexCoord(index: number): [number, number] {
  if (index < 0) {
    return [0, 0];
  }

  // http://oeis.org/A028896
  const ring = Math.floor((Math.sqrt(12 * index + 9) - 3) / 6);
  const ringIndex = index - 3 * ring * (ring + 1);

  const sideLength = ring + 2;
  let coords = [ring + 1, ring + 1];

  // First side
  coords[1] -= Math.min(ringIndex, sideLength - 1);
  // Second side
  if (ringIndex >= sideLength - 1) {
    const diff = Math.min(ringIndex - (sideLength - 1), sideLength - 1);
    coords[0] -= diff;
    coords[1] -= diff;
  }
  // Third side
  if (ringIndex >= 2 * (sideLength - 1)) {
    const diff = Math.min(ringIndex - 2 * (sideLength - 1), sideLength - 1);
    coords[0] -= diff;
  }
  // Fourth side
  if (ringIndex >= 3 * (sideLength - 1)) {
    const diff = Math.min(ringIndex - 3 * (sideLength - 1), sideLength - 1);
    coords[1] += diff;
  }
  // Fifth side
  if (ringIndex >= 4 * (sideLength - 1)) {
    const diff = Math.min(ringIndex - 4 * (sideLength - 1), sideLength - 1);
    coords[0] += diff;
    coords[1] += diff;
  }
  // Sixth side
  if (ringIndex >= 5 * (sideLength - 1)) {
    const diff = Math.min(ringIndex - 5 * (sideLength - 1), sideLength - 1);
    coords[0] += diff;
  }
  return [coords[0], coords[1]];
}

export function hexCoordToIndex([x, y]: [number, number]) {
  const z = y - x;
  const ring = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
  const ringStart = 3 * ring * (ring - 1);
  const sideLength = ring + 1;
  let iter_coords = [ring, ring];
  let ringIndex = 0;
  if (ring == 0) {
    return -1;
  }
  while (!(iter_coords[0] === x && iter_coords[1] === y)) {
    if (ringIndex < sideLength - 1) {
      iter_coords[1] -= 1;
    } else if (ringIndex < 2 * (sideLength - 1)) {
      iter_coords[0] -= 1;
      iter_coords[1] -= 1;
    } else if (ringIndex < 3 * (sideLength - 1)) {
      iter_coords[0] -= 1;
    } else if (ringIndex < 4 * (sideLength - 1)) {
      iter_coords[1] += 1;
    } else if (ringIndex < 5 * (sideLength - 1)) {
      iter_coords[0] += 1;
      iter_coords[1] += 1;
    } else if (ringIndex < 6 * (sideLength - 1)) {
      iter_coords[0] += 1;
    }
    ringIndex += 1;
  }
  return ringIndex + ringStart;
}

// @ts-ignore
window.f = hexCoordToIndex;
// @ts-ignore
window.g = indexToHexCoord;

export function hexCoordsToRectCoords(coords: [number, number]) {
  const x = (coords[0] - coords[1]) * 0.75; // The x position of adjacent hexes differ by 75% of the width of a hex
  const y = -(coords[0] + coords[1]) * 0.5; // The y position of adjacent hexes differ by 50% of the height of a hex
  return [x, y];
}

export function getNeighborDirection(
  coords: [number, number],
  otherCoords: [number, number]
) {
  if (otherCoords[0] === coords[0] - 1) {
    if (otherCoords[1] === coords[1] - 1) {
      return "s";
    } else if (otherCoords[1] === coords[1]) {
      return "sw";
    } else {
      return false;
    }
  } else if (otherCoords[0] === coords[0] + 1) {
    if (otherCoords[1] === coords[1] + 1) {
      return "n";
    } else if (otherCoords[1] === coords[1]) {
      return "ne";
    } else {
      return false;
    }
  } else if (otherCoords[0] === coords[0]) {
    if (otherCoords[1] === coords[1] - 1) {
      return "se";
    } else if (otherCoords[1] === coords[1] + 1) {
      return "nw";
    } else {
      return false;
    }
  }
  return false;
}
