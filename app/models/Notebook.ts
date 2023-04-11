import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withSetPropAction } from './helpers/withSetPropAction';
import { Entry, EntryModel } from './Entry';
import { api } from '../services/api';
import { getRootStore } from './helpers/getRootStore';

export const NotebookModel = types
  .model('Notebook')
  .props({
    id: types.identifierNumber,
    createdAt: types.Date,
    updatedAt: types.Date,
    name: types.string,
    description: types.string,
    imageUrl: types.string,
    entries: types.array(EntryModel),
    selectedEntry: types.maybe(types.reference(EntryModel)),
  })
  .views((store) => ({
    get favorites() {
      return store.entries.filter((entry) => entry.isFavorite);
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    select(entry?: Entry) {
      store.selectedEntry = entry;
    },
    async readFirstEntries(notebookId: number) {
      const response = await api.readManyEntries(notebookId, undefined, 10);
      if (response.kind === 'ok') {
        store.setProp('entries', response.entries);
      }
    },
    async readMoreEntries(notebookId: number) {
      const response = await api.readManyEntries(
        notebookId,
        store.entries[store.entries.length - 1].createdAt,
        10,
      );
      if (response.kind === 'ok') {
        store.setProp('entries', response.entries);
      }
    },
    async updateOneEntry(entryId: number, entry: Partial<Entry>) {
      const rootStore = getRootStore(store);
      const response = await api.updateOneEntry(
        rootStore.notebooksStore.selectedNotebook.id,
        entryId,
        { ...entry },
      );
      if (response.kind === 'ok') {
        store.setProp(
          'entries',
          store.entries.map((item) =>
            item.id === response.entry.id ? response.entry : item,
          ),
        );
      }
    },
  }));

export interface Notebook extends Instance<typeof NotebookModel> {}
export interface NotebookSnapshotOut
  extends SnapshotOut<typeof NotebookModel> {}
export interface NotebookSnapshotIn extends SnapshotIn<typeof NotebookModel> {}
