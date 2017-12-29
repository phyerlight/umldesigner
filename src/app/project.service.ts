import { Injectable } from '@angular/core';

@Injectable()
export class ProjectService {

  constructor() { }

  getProjects() {
    return {
      'Test': ['test model', 'test drawing'],
      'Food': ['Fruit model', 'Grain Model', 'front end']
    };
  }

}
