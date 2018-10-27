export interface Project {
  _key: string;
  name: string;
  fileKeys: string[];
}

export function createProject(options: Partial<Project>={}): Project {
  return {
    _key: null,
    name: null,
    fileKeys: [],
    ...options
  }
}