import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withSetPropAction } from './helpers/withSetPropAction';

export const NotebookModel = types
  .model('Notebook')
  .props({
    id: types.number,
    createdAt: types.Date,
    updatedAt: types.Date,
    name: types.string,
    description: types.string,
    imageUrl: types.string,
  })
  .actions(withSetPropAction);

export interface Notebook extends Instance<typeof NotebookModel> {}
export interface NotebookSnapshotOut
  extends SnapshotOut<typeof NotebookModel> {}
export interface NotebookSnapshotIn extends SnapshotIn<typeof NotebookModel> {}
