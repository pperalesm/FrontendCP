import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { NotebookModel } from './Notebook';

export const TaskModel = types.model('Task').props({
  id: types.identifierNumber,
  createdAt: types.Date,
  updatedAt: types.Date,
  name: types.string,
  description: types.string,
  notebook: types.maybeNull(types.reference(NotebookModel)),
});

export interface Task extends Instance<typeof TaskModel> {}
export interface TaskSnapshotOut extends SnapshotOut<typeof TaskModel> {}
export interface TaskSnapshotIn extends SnapshotIn<typeof TaskModel> {}
