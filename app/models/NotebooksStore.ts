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
    areNotebooksLoading: types.optional(types.boolean, false),
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
      reloadNotebooks: flow(function* () {
        self.areNotebooksLoading = true;
        self.selectedNotebook = undefined;
        const response = yield api.readAllNotebooks();
        if (response.kind === 'ok') {
          self.notebooks = response.notebooks;
        }
        self.areNotebooksLoading = false;
        return response;
      }),
      handlePressCard(notebook: Notebook) {
        self.selectedNotebook = notebook;
      },
    };
  });

export interface NotebooksStore extends Instance<typeof NotebooksStoreModel> {}
export interface NotebooksStoreSnapshot
  extends SnapshotOut<typeof NotebooksStoreModel> {}
