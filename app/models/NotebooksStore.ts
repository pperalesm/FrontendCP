import { Instance, SnapshotOut, flow, types } from 'mobx-state-tree';
import { api } from '../services/api';
import { Notebook, NotebookModel } from './Notebook';

export const NotebooksStoreModel = types
  .model('NotebooksStore')
  .props({
    notebooks: types.array(NotebookModel),
    selectedNotebook: types.maybe(types.reference(NotebookModel)),
  })
  .actions((self) => ({
    select(notebook: Notebook) {
      self.selectedNotebook = notebook;
    },
    readAllNotebooks: flow(function* () {
      const response = yield api.readAllNotebooks();
      if (response.kind === 'ok') {
        self.notebooks = response.notebooks;
      }
      return response;
    }),
  }));

export interface NotebookStore extends Instance<typeof NotebooksStoreModel> {}
export interface NotebookStoreSnapshot
  extends SnapshotOut<typeof NotebooksStoreModel> {}
