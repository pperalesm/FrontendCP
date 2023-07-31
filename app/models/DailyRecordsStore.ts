import {
  Instance,
  SnapshotOut,
  applySnapshot,
  flow,
  getSnapshot,
  types,
} from 'mobx-state-tree';
import { api } from '../services/api/api';
import { DailyRecord, DailyRecordModel } from './DailyRecord';
import { DailyRecordSelectEnum } from '../utils/dailyRecordSelectEnum';
import { getDateWithoutTime } from '../utils/getDateWithoutTime';
import { copyDefinedValues } from '../utils/copyDefinedvalues';

export const DailyRecordsStoreModel = types
  .model('DailyRecordsStore')
  .props({
    dailyRecords: types.array(DailyRecordModel),
    selectedDailyRecord: types.maybe(types.reference(DailyRecordModel)),
    dummyDailyRecord: types.optional(DailyRecordModel, {
      id: -1,
      createdAt: new Date(),
      updatedAt: new Date(),
      day: new Date(),
      mood: null,
      note: null,
      activityCategories: [],
      tasks: [],
    }),
  })
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      reset: () => {
        applySnapshot(self, initialState);
      },
      getCorrespondingIndex(
        day: Date,
        startIndex = 0,
        endIndex = self.dailyRecords.length,
      ) {
        const boundaryIndex =
          startIndex + Math.floor((endIndex - startIndex) / 2);
        const isSameDay =
          self.dailyRecords[boundaryIndex] &&
          day.getTime() === self.dailyRecords[boundaryIndex].day.getTime();
        if (isSameDay || startIndex === endIndex) {
          return {
            index: boundaryIndex,
            isSameDay,
          };
        }
        if (day.getTime() > self.dailyRecords[boundaryIndex].day.getTime()) {
          return this.getCorrespondingIndex(day, boundaryIndex + 1, endIndex);
        } else {
          return this.getCorrespondingIndex(day, startIndex, boundaryIndex);
        }
      },
      select({
        dailyRecord,
        datetime,
      }: {
        dailyRecord?: DailyRecord;
        datetime?: Date;
      }) {
        if (datetime) {
          const day = getDateWithoutTime(datetime);
          const { index, isSameDay } = this.getCorrespondingIndex(day);
          if (isSameDay) {
            self.selectedDailyRecord = self.dailyRecords[index];
          } else {
            self.dailyRecords.splice(
              index,
              0,
              DailyRecordModel.create({
                id: -day.getTime(),
                createdAt: new Date(),
                updatedAt: new Date(),
                day,
                mood: null,
                note: null,
                activityCategories: [],
                tasks: [],
              }),
            );
            self.selectedDailyRecord = self.dailyRecords[index];
          }
        } else {
          self.selectedDailyRecord = dailyRecord;
        }
      },
      readOneDailyRecord: flow(function* () {
        const response = yield api.readOneDailyRecord(
          self.selectedDailyRecord?.day,
        );
        if (response.kind === 'ok') {
          copyDefinedValues(self.selectedDailyRecord, response.dailyRecord);
        }
        return response;
      }),
      createOrUpdateOneDailyRecord: flow(function* () {
        const response = yield api.createOrUpdateOneDailyRecord(
          self.selectedDailyRecord,
        );
        if (response.kind === 'ok') {
          copyDefinedValues(self.selectedDailyRecord, response.dailyRecord);
        }
        return response;
      }),
      readManyDailyRecords: flow(function* (
        from: Date,
        to: Date,
        select?: DailyRecordSelectEnum[],
      ) {
        const response = yield api.readManyDailyRecords(from, to, select);
        if (response.kind === 'ok') {
          let lastIndex = 0;
          let index = 0;
          for (const dailyRecord of response.dailyRecords) {
            index = lastIndex;
            while (index < self.dailyRecords.length) {
              if (
                self.dailyRecords[index].day.getTime() >=
                dailyRecord.day.getTime()
              ) {
                lastIndex = index;
                break;
              }
              index += 1;
            }
            if (
              index < self.dailyRecords.length &&
              self.dailyRecords[index].id === dailyRecord.id
            ) {
              copyDefinedValues(self.dailyRecords[index], dailyRecord);
            } else {
              self.dailyRecords.splice(index, 0, dailyRecord);
            }
          }
        }
        return response;
      }),
    };
  });

export interface DailyRecordsStore
  extends Instance<typeof DailyRecordsStoreModel> {}
export interface DailyRecordsStoreSnapshot
  extends SnapshotOut<typeof DailyRecordsStoreModel> {}
