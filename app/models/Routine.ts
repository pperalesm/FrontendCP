import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const RoutineModel = types
  .model('Routine')
  .props({
    id: types.identifierNumber,
    createdAt: types.Date,
    updatedAt: types.Date,
    isFavorite: types.boolean,
    text: types.string,
  })
  .actions((self) => ({
    setIsFavorite(isFavorite: boolean) {
      self.isFavorite = isFavorite;
    },
    setText(text: string) {
      self.text = text;
    },
  }));

export interface Routine extends Instance<typeof RoutineModel> {}
export interface RoutineSnapshotOut extends SnapshotOut<typeof RoutineModel> {}
export interface RoutineSnapshotIn extends SnapshotIn<typeof RoutineModel> {}
