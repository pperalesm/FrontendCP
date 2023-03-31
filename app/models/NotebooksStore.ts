import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { api } from '../services/api';
import { NotebookModel } from './Notebook';
import { withSetPropAction } from './helpers/withSetPropAction';

export const NotebooksStoreModel = types
  .model('NotebooksStore')
  .props({
    notebooks: types.array(NotebookModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async readAllNotebooks() {
      const response = await api.readAllNotebooks();
      if (response.kind === 'ok') {
        store.setProp('notebooks', response.notebooks);
      }
    },
  }));

export interface NotebookStore extends Instance<typeof NotebooksStoreModel> {}
export interface NotebookStoreSnapshot
  extends SnapshotOut<typeof NotebooksStoreModel> {}
