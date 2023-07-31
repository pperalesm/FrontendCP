import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  destroy,
  flow,
  getSnapshot,
  types,
} from 'mobx-state-tree';
import { Entry, EntryModel } from './Entry';
import { api } from '../services/api/api';
import { copyDefinedValues } from '../utils/copyDefinedvalues';

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
    isFavoritesOnly: types.optional(types.boolean, false),
    areEntriesLoading: types.optional(types.boolean, false),
  })
  .views((self) => ({
    isEntryEditable(entry: Entry) {
      return self.selectedEntry && self.selectedEntry.id === entry.id;
    },
  }))
  .actions((self) => ({
    handlePressAdd() {
      if (!self.entries[0]?.isBeingCreated) {
        self.entries.splice(
          0,
          0,
          EntryModel.create({
            id: -self.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isFavorite: false,
            text: '',
          }),
        );
      }
      self.selectedEntry = self.entries[0];
    },
    handlePressEdit(entry: Entry) {
      entry.beforeEdit = { text: getSnapshot(entry).text };
      self.selectedEntry = entry;
    },
    handlePressCancel(entry: Entry) {
      self.selectedEntry = undefined;
      if (entry.isBeingCreated) {
        self.entries.splice(0, 1);
      } else {
        copyDefinedValues(entry, entry.beforeEdit);
      }
    },
  }))
  .actions((self) => ({
    reloadEntries: flow(function* (toggleFavoritesOnly?: boolean) {
      self.areEntriesLoading = true;
      self.selectedEntry = undefined;
      const response = yield api.readManyEntries(
        self.id,
        undefined,
        10,
        toggleFavoritesOnly ? !self.isFavoritesOnly : self.isFavoritesOnly,
      );
      if (response.kind === 'ok') {
        self.isFavoritesOnly = toggleFavoritesOnly
          ? !self.isFavoritesOnly
          : self.isFavoritesOnly;
        self.entries = response.entries;
      }
      self.areEntriesLoading = false;
      return response;
    }),
    loadMoreEntries: flow(function* () {
      self.areEntriesLoading = true;
      const response = yield api.readManyEntries(
        self.id,
        self.entries[self.entries.length - 1]?.createdAt,
        10,
        self.isFavoritesOnly,
      );
      if (response.kind === 'ok') {
        self.entries.push(...response.entries);
      }
      self.areEntriesLoading = false;
      return response;
    }),
    handlePressDone: flow(function* (entry: Entry) {
      if (entry.isBeingCreated) {
        entry.isDoneLoading = true;
        const response = yield api.createOneEntry(self.id, entry);
        if (response.kind === 'ok') {
          self.selectedEntry = undefined;
          self.entries.splice(0, 1, response.entry);
        } else {
          entry.isDoneLoading = false;
        }
        return response;
      } else {
        entry.isDoneLoading = true;
        const response = yield api.updateOneEntry(self.id, entry.id, {
          text: entry.text,
        });
        if (response.kind === 'ok') {
          self.selectedEntry = undefined;
          copyDefinedValues(entry, response.entry);
        }
        entry.isDoneLoading = false;
        return response;
      }
    }),
    handlePressFavorite: flow(function* (entry: Entry) {
      if (entry.isBeingCreated) {
        entry.isFavorite = !entry.isFavorite;
      } else {
        entry.isFavoriteLoading = true;
        const response = yield api.updateOneEntry(self.id, entry.id, {
          isFavorite: !entry.isFavorite,
        });
        if (response.kind === 'ok') {
          const beforeEdit = { text: getSnapshot(entry).text };
          copyDefinedValues(entry, response.entry);
          copyDefinedValues(entry, beforeEdit);
        }
        entry.isFavoriteLoading = false;
        return response;
      }
    }),
    handlePressDelete: flow(function* (entry: Entry) {
      entry.isDeleteLoading = true;
      const response = yield api.deleteOneEntry(self.id, entry.id);
      if (response.kind === 'ok') {
        self.selectedEntry = undefined;
        destroy(entry);
      } else {
        entry.isDeleteLoading = false;
      }
      return response;
    }),
  }));

export interface Notebook extends Instance<typeof NotebookModel> {}
export interface NotebookSnapshotOut
  extends SnapshotOut<typeof NotebookModel> {}
export interface NotebookSnapshotIn extends SnapshotIn<typeof NotebookModel> {}
