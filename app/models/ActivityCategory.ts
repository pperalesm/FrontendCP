import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const ActivityCategoryModel = types.model('ActivityCategory').props({
  id: types.identifierNumber,
  createdAt: types.Date,
  updatedAt: types.Date,
  name: types.string,
  imageUrl: types.string,
});

export interface ActivityCategory
  extends Instance<typeof ActivityCategoryModel> {}
export interface ActivityCategorySnapshotOut
  extends SnapshotOut<typeof ActivityCategoryModel> {}
export interface ActivityCategorySnapshotIn
  extends SnapshotIn<typeof ActivityCategoryModel> {}
