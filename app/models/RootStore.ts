import {
  Instance,
  SnapshotOut,
  applySnapshot,
  getSnapshot,
  types,
} from 'mobx-state-tree';
import { AuthenticationStoreModel } from './AuthenticationStore';
import { NotebooksStoreModel } from './NotebooksStore';
import { PlansStoreModel } from './PlansStore';
import { DailyRecordsStoreModel } from './DailyRecordsStore';
import { ActivityCategoriesStoreModel } from './ActivityCategoriesStore';

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model('RootStore')
  .props({
    authenticationStore: types.optional(AuthenticationStoreModel, {}),
    notebooksStore: types.optional(NotebooksStoreModel, {}),
    plansStore: types.optional(PlansStoreModel, {}),
    dailyRecordsStore: types.optional(DailyRecordsStoreModel, {}),
    activityCategoriesStore: types.optional(ActivityCategoriesStoreModel, {}),
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
    };
  });

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
