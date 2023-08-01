import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  flow,
  types,
} from 'mobx-state-tree';
import { RoutineModel } from './Routine';
import { api } from '../services/api/api';

export const PlanModel = types
  .model('Plan')
  .props({
    id: types.identifierNumber,
    createdAt: types.Date,
    updatedAt: types.Date,
    name: types.string,
    description: types.string,
    imageUrl: types.string,
    numDays: types.number,
    currentDay: types.maybe(types.number),
    isActive: types.boolean,
    routines: types.array(RoutineModel),
    areRoutinesLoading: types.optional(types.boolean, false),
    isStartOrEndLoading: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    reloadRoutines: flow(function* () {
      self.areRoutinesLoading = true;
      const response = yield api.readAllRoutines(self.id);
      if (response.kind === 'ok') {
        self.routines = response.routines;
      }
      self.areRoutinesLoading = false;
      return response;
    }),
  }));

export interface Plan extends Instance<typeof PlanModel> {}
export interface PlanSnapshotOut extends SnapshotOut<typeof PlanModel> {}
export interface PlanSnapshotIn extends SnapshotIn<typeof PlanModel> {}
