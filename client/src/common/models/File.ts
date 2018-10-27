export interface File {
  _key: string,
  project_key: string,
  type: string,
  name: string,
  createdBy_key: string,
  createdOn: string,
  modifiedBy_key: string,
  modifiedOn: string,
  nextEntityId: Array<number>,
  entities: { [id: number]: any }
}

export function createFile(options: Partial<File>={}): File {
  return {
    _key: null,
    project_key: null,
    type: null,
    name: null,
    createdBy_key: null,
    createdOn: new Date().toISOString(),
    modifiedBy_key: null,
    modifiedOn: new Date().toISOString(),
    nextEntityId: [],
    entities: {},
    ...options
  }
}