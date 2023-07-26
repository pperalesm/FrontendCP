import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { TaskModel } from './Task';

export const RoutineModel = types.model('Routine').props({
  day: types.number,
  tasks: types.array(TaskModel),
});

export interface Routine extends Instance<typeof RoutineModel> {}
export interface RoutineSnapshotOut extends SnapshotOut<typeof RoutineModel> {}
export interface RoutineSnapshotIn extends SnapshotIn<typeof RoutineModel> {}
