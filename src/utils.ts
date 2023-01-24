export function normalizeMapString(mapString: string[]) {
  const baseString = [...mapString];
  baseString[-1] = /{.*}|18/.test(baseString[0])
    ? (baseString.shift()?.replace(/[{}]/g, "") as string)
    : "18";
  return baseString;
}
