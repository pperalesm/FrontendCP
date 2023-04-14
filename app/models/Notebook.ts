import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  applySnapshot,
  flow,
  types,
} from 'mobx-state-tree';
import { Entry, EntryModel } from './Entry';
import { api } from '../services/api';

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
    entryToAdd: types.maybe(EntryModel),
  })
  .views((self) => ({
    get favorites() {
      return self.entries.filter((entry) => entry.isFavorite);
    },
    get isEntryToAddSelected() {
      return self.selectedEntry?.id === -self.id;
    },
  }))
  .actions((self) => ({
    prepareEntryToAdd() {
      const entryToAdd = {
        id: -self.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        text: '',
      };
      if (self.entryToAdd) applySnapshot(self.entryToAdd, entryToAdd);
      else self.entryToAdd = EntryModel.create(entryToAdd);
      self.selectedEntry = self.entryToAdd;
    },
    select(entry?: Entry) {
      self.selectedEntry = entry;
    },
    readFirstEntries: flow(function* () {
      const response = yield api.readManyEntries(self.id, undefined, 10);
      if (response.kind === 'ok') {
        self.entries = response.entries;
      }
      return response;
    }),
    readMoreEntries: flow(function* () {
      const response = yield api.readManyEntries(
        self.id,
        self.entries[self.entries.length - 1]?.createdAt,
        10,
      );
      if (response.kind === 'ok') {
        self.entries.push(...response.entries);
      }
      return response;
    }),
    createOneEntry: flow(function* () {
      const response = yield api.createOneEntry(self.id, self.entryToAdd);
      if (response.kind === 'ok') {
        self.entries.splice(0, 0, response.entry);
      }
      return response;
    }),
    updateOneEntry: flow(function* (entryId: number, entry: Partial<Entry>) {
      const response = yield api.updateOneEntry(self.id, entryId, entry);
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
