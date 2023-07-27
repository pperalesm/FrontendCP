import {
  Instance,
  SnapshotOut,
  applySnapshot,
  flow,
  getSnapshot,
  types,
} from 'mobx-state-tree';
import { api } from '../services/api/api';
import { ActivityCategoryModel } from './ActivityCategory';

export const ActivityCategoriesStoreModel = types
  .model('ActivityCategoriesStore')
  .props({
    activityCategories: types.array(ActivityCategoryModel),
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
      readAllActivityCategories: flow(function* () {
        const response = yield api.readAllActivityCategories();
        if (response.kind === 'ok') {
          self.activityCategories = response.activityCategories;
        }
        return response;
      }),
    };
  });

export interface ActivityCategoriesStore
  extends Instance<typeof ActivityCategoriesStoreModel> {}
export interface ActivityCategoriesStoreSnapshot
  extends SnapshotOut<typeof ActivityCategoriesStoreModel> {}
