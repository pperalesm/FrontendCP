import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const EntryModel = types
  .model('Entry')
  .props({
    id: types.identifierNumber,
    createdAt: types.Date,
    updatedAt: types.Date,
    isFavorite: types.boolean,
    text: types.string,
    isFavoriteLoading: types.optional(types.boolean, false),
    isDeleteLoading: types.optional(types.boolean, false),
    isDoneLoading: types.optional(types.boolean, false),
    beforeEdit: types.maybe(types.frozen()),
  })
  .views((self) => ({
    get isBeingCreated() {
      return self.id < 0;
    },
  }))
  .actions((self) => ({
    setText(text: string) {
      self.text = text;
    },
  }));

export interface Entry extends Instance<typeof EntryModel> {}
export interface EntrySnapshotOut extends SnapshotOut<typeof EntryModel> {}
export interface EntrySnapshotIn extends SnapshotIn<typeof EntryModel> {}
