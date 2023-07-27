import {
  Instance,
  SnapshotOut,
  applySnapshot,
  flow,
  getSnapshot,
  types,
} from 'mobx-state-tree';
import { api } from '../services/api/api';
import { Notebook, NotebookModel } from './Notebook';

export const NotebooksStoreModel = types
  .model('NotebooksStore')
  .props({
    notebooks: types.array(NotebookModel),
    selectedNotebook: types.maybe(types.reference(NotebookModel)),
  })
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      reset: () => {
        applySnapshot(self, initialState);
      },
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
    };
  });

export interface NotebooksStore extends Instance<typeof NotebooksStoreModel> {}
export interface NotebooksStoreSnapshot
  extends SnapshotOut<typeof NotebooksStoreModel> {}
