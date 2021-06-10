export function stringToRegex(str: string): RegExp {
  const matchResult = str.match(/\/(.+)\/(.*)/);
  if (!matchResult) {
    throw new Error(
      `Invalid regex string format "${str}". Regex should be surrended with '/' character.`
    );
  }
  return new RegExp(matchResult[1], matchResult[2]);
}
