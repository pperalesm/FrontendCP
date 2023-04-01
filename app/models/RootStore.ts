import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { AuthenticationStoreModel } from './AuthenticationStore';
import { EpisodeStoreModel } from './EpisodeStore';
import { NotebooksStoreModel } from './NotebooksStore';
import { EntriesStoreModel } from './EntriesStore';

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  notebooksStore: types.optional(NotebooksStoreModel, {}),
  entriesStore: types.optional(EntriesStoreModel, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}),
});

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
