import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  applySnapshot,
  flow,
  types,
} from 'mobx-state-tree';
import { Routine, RoutineModel } from './Routine';
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
    routines: types.array(RoutineModel),
    selectedRoutine: types.maybe(types.reference(RoutineModel)),
    routineToAdd: types.maybe(RoutineModel),
  })
  .views((self) => ({
    get favorites() {
      return self.routines.filter((routine) => routine.isFavorite);
    },
    get isRoutineToAddSelected() {
      return self.selectedRoutine?.id === -self.id;
    },
  }))
  .actions((self) => ({
    prepareRoutineToAdd() {
      const routineToAdd = {
        id: -self.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        text: '',
      };
      if (self.routineToAdd) {
        applySnapshot(self.routineToAdd, routineToAdd);
      } else {
        self.routineToAdd = RoutineModel.create(routineToAdd);
      }
      self.selectedRoutine = self.routineToAdd;
    },
    select(routine?: Routine) {
      self.selectedRoutine = routine;
    },
    readFirstRoutines: flow(function* () {
      const response = yield api.readManyRoutines(self.id, undefined, 10);
      if (response.kind === 'ok') {
        self.routines = response.routines;
      }
      return response;
    }),
    readMoreRoutines: flow(function* () {
      const response = yield api.readManyRoutines(
        self.id,
        self.routines[self.routines.length - 1]?.createdAt,
        10,
      );
      if (response.kind === 'ok') {
        self.routines.push(...response.routines);
      }
      return response;
    }),
    createOneRoutine: flow(function* () {
      const response = yield api.createOneRoutine(self.id, self.routineToAdd);
      if (response.kind === 'ok') {
        self.routines.splice(0, 0, response.routine);
      }
      return response;
    }),
    updateOneRoutine: flow(function* (
      routineId: number,
      routine: Partial<Routine>,
    ) {
      const response = yield api.updateOneRoutine(self.id, routineId, routine);
      if (response.kind === 'ok') {
        self.routines.splice(
          self.routines.findIndex((item) => item.id === routineId),
          1,
          response.routine,
        );
      }
      return response;
    }),
    deleteOneRoutine: flow(function* () {
      const response = yield api.deleteOneRoutine(
        self.id,
        self.selectedRoutine.id,
      );
      if (response.kind === 'ok') {
        const selectedRoutineId = self.selectedRoutine.id;
        self.selectedRoutine = undefined;
        self.routines.splice(
          self.routines.findIndex((item) => item.id === selectedRoutineId),
          1,
        );
      }
      return response;
    }),
  }));

export interface Plan extends Instance<typeof PlanModel> {}
export interface PlanSnapshotOut extends SnapshotOut<typeof PlanModel> {}
export interface PlanSnapshotIn extends SnapshotIn<typeof PlanModel> {}
