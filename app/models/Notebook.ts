import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  flow,
  types,
} from 'mobx-state-tree';
import { Entry, EntryModel } from './Entry';
import { api } from '../services/api/api';

export const NotebookModel = types
  .model('Notebook')
  .props({
    id: types.identifierNumber,
    createdAt: types.Date,
    updatedAt: types.Date,
    name: types.string,
    description: types.string,
    imageUrl: types.string,
    entries: types.array(EntryModel),
    selectedEntry: types.maybe(types.reference(EntryModel)),
    entryToCreate: types.maybe(EntryModel),
  })
  .views((self) => ({
    get isEntryToCreateSelected() {
      return self.selectedEntry?.id === -self.id;
    },
  }))
  .actions((self) => ({
    prepareEntryToCreate() {
      if (!self.entryToCreate) {
        self.entryToCreate = EntryModel.create({
          id: -self.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          isFavorite: false,
          text: '',
        });
      }
      self.selectedEntry = self.entryToCreate;
    },
    select(entry?: Entry) {
      self.selectedEntry = entry;
    },
    readFirstEntries: flow(function* (showFavoritesOnly: boolean) {
      const response = yield api.readManyEntries(
        self.id,
        undefined,
        10,
        showFavoritesOnly,
      );
      if (response.kind === 'ok') {
        self.entries = response.entries;
      }
      return response;
    }),
    readMoreEntries: flow(function* (showFavoritesOnly: boolean) {
      const response = yield api.readManyEntries(
        self.id,
        self.entries[self.entries.length - 1]?.createdAt,
        10,
        showFavoritesOnly,
      );
      if (response.kind === 'ok') {
        self.entries.push(...response.entries);
      }
      return response;
    }),
    createOneEntry: flow(function* () {
      const response = yield api.createOneEntry(self.id, self.entryToCreate);
      if (response.kind === 'ok') {
        self.entries.splice(0, 0, response.entry);
      }
      return response;
    }),
    updateOneEntry: flow(function* (
      entryId: number,
      updateData: { isFavorite?: boolean; text?: string },
    ) {
      const response = yield api.updateOneEntry(self.id, entryId, updateData);
      if (response.kind === 'ok') {
        self.entries.splice(
          self.entries.findIndex((item) => item.id === entryId),
          1,
          response.entry,
        );
      }
      return response;
    }),
    deleteOneEntry: flow(function* () {
      const response = yield api.deleteOneEntry(self.id, self.selectedEntry.id);
      if (response.kind === 'ok') {
        const selectedEntryId = self.selectedEntry.id;
        self.selectedEntry = undefined;
        self.entries.splice(
          self.entries.findIndex((item) => item.id === selectedEntryId),
          1,
        );
      }
      return response;
    }),
  }));

export interface Notebook extends Instance<typeof NotebookModel> {}
export interface NotebookSnapshotOut
  extends SnapshotOut<typeof NotebookModel> {}
export interface NotebookSnapshotIn extends SnapshotIn<typeof NotebookModel> {}
