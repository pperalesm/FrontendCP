import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { api } from '../services/api';
import { Entry, EntryModel } from './Entry';
import { withSetPropAction } from './helpers/withSetPropAction';

export const EntriesStoreModel = types
  .model('EntriesStore')
  .props({
    entries: types.array(EntryModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async readManyEntriesPaginated(notebookId: number) {
      const response = await api.readManyEntriesPaginated(notebookId, 1, 10);
      if (response.kind === 'ok') {
        store.setProp('entries', response.entries);
      } else {
        console.tron.error(
          `Error fetching entries: ${JSON.stringify(response)}`,
          [],
        );
      }
    },
  }))
  .views((store) => ({
    get favorites() {
      return store.entries.filter((entry) => entry.isFavorite);
    },
  }))
  .actions((store) => ({
    toggleFavorite(entry: Entry) {
      console.log(entry);
      console.log(store.entries.length);
    },
  }));

export interface EntryStore extends Instance<typeof EntriesStoreModel> {}
export interface EntryStoreSnapshot
  extends SnapshotOut<typeof EntriesStoreModel> {}
