import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { RoutineModel } from './Routine';

export const PlanModel = types.model('Plan').props({
  id: types.identifierNumber,
  createdAt: types.Date,
  updatedAt: types.Date,
  name: types.string,
  description: types.string,
  imageUrl: types.string,
  numDays: types.number,
  currentDay: types.maybe(types.number),
  routines: types.array(RoutineModel),
});

export interface Plan extends Instance<typeof PlanModel> {}
export interface PlanSnapshotOut extends SnapshotOut<typeof PlanModel> {}
export interface PlanSnapshotIn extends SnapshotIn<typeof PlanModel> {}
