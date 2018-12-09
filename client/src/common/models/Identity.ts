export type Identity = {
  id: number;
}

export function hasIdentity(o: Object): o is Identity {
  return o.hasOwnProperty('id')
}