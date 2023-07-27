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
    routines: types.array(RoutineModel),
  })
  .actions((self) => ({
    readAllRoutines: flow(function* () {
      const response = yield api.readAllRoutines(self.id);
      if (response.kind === 'ok') {
        self.routines = response.routines;
      }
      return response;
    }),
  }));

export interface Plan extends Instance<typeof PlanModel> {}
export interface PlanSnapshotOut extends SnapshotOut<typeof PlanModel> {}
export interface PlanSnapshotIn extends SnapshotIn<typeof PlanModel> {}
