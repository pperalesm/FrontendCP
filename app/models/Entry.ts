import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withSetPropAction } from './helpers/withSetPropAction';

export const EntryModel = types
  .model('Entry')
  .props({
    id: types.identifierNumber,
    createdAt: types.Date,
    updatedAt: types.Date,
    text: types.string,
    isFavorite: types.boolean,
  })
  .actions(withSetPropAction);

export interface Entry extends Instance<typeof EntryModel> {}
export interface EntrySnapshotOut extends SnapshotOut<typeof EntryModel> {}
export interface EntrySnapshotIn extends SnapshotIn<typeof EntryModel> {}
