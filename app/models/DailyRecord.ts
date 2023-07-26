import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { ActivityCategoryModel } from './ActivityCategory';
import { TaskModel } from './Task';

export const DailyRecordModel = types.model('DailyRecord').props({
  id: types.identifierNumber,
  createdAt: types.Date,
  updatedAt: types.Date,
  day: types.Date,
  mood: types.maybeNull(types.number),
  note: types.maybeNull(types.string),
  activityCategories: types.maybe(
    types.array(types.reference(ActivityCategoryModel)),
  ),
  tasks: types.maybe(types.array(types.reference(TaskModel))),
});

export interface DailyRecord extends Instance<typeof DailyRecordModel> {}
export interface DailyRecordSnapshotOut
  extends SnapshotOut<typeof DailyRecordModel> {}
export interface DailyRecordSnapshotIn
  extends SnapshotIn<typeof DailyRecordModel> {}
