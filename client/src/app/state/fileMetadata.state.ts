import { State, Action, StateContext } from '@ngxs/store';

import { FileMetadata } from './model';

export class AddFileMetadata {
  static readonly type = '[FileMetadata] AddFileMetadata'
  constructor(public data) {}
}

export interface FileMetadataStateModel {
  [x: string]: FileMetadata
}

@State<FileMetadataStateModel>({
  name: "fileMetadata",
  defaults:{}
})
export class FileMetadataState {
  @Action(AddFileMetadata)
  addProject(ctx: StateContext<FileMetadataStateModel>, action: AddFileMetadata) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      [action.data._key]: action.data
    });
  }
}
