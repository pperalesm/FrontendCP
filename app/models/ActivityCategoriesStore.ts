import { Instance, SnapshotOut, flow, types } from 'mobx-state-tree';
import { api } from '../services/api/api';
import { ActivityCategoryModel } from './ActivityCategory';

export const ActivityCategoriesStoreModel = types
  .model('ActivityCategoriesStore')
  .props({
    activityCategories: types.array(ActivityCategoryModel),
  })
  .actions((self) => ({
    readAllActivityCategories: flow(function* () {
      const response = yield api.readAllActivityCategories();
      if (response.kind === 'ok') {
        self.activityCategories = response.activityCategories;
      }
      return response;
    }),
  }));

export interface ActivityCategoriesStore
  extends Instance<typeof ActivityCategoriesStoreModel> {}
export interface ActivityCategoriesStoreSnapshot
  extends SnapshotOut<typeof ActivityCategoriesStoreModel> {}
