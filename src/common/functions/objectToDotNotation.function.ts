export function objectToDotNotation(property: string, dto: object): object {
  const object = {};
  for (const element in dto) {
    if (dto[element] === undefined) {
      continue;
    }
    Object.assign(object, { [`${property}.$.${element}`]: dto[element] });
  }
  return object;
}
