import {
  Instance,
  SnapshotOut,
  applySnapshot,
  flow,
  getSnapshot,
  types,
} from 'mobx-state-tree';
import { api } from '../services/api/api';
import { DailyRecordModel } from './DailyRecord';
import { DailyRecordSelectEnum } from '../utils/dailyRecordSelectEnum';

export const DailyRecordsStoreModel = types
  .model('DailyRecordsStore')
  .props({
    dailyRecords: types.array(DailyRecordModel),
    selectedDailyRecord: types.maybe(types.reference(DailyRecordModel)),
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
      select(day: Date) {
        const boundaryIndex = self.dailyRecords.findIndex(
          (item) => item.day.getTime() >= day.getTime(),
        );
        if (self.dailyRecords[boundaryIndex].day.getTime() !== day.getTime()) {
          self.dailyRecords.splice(
            boundaryIndex,
            0,
            DailyRecordModel.create({
              id: -1,
              createdAt: new Date(),
              updatedAt: new Date(),
              day,
              mood: null,
              note: null,
              activityCategories: [],
              tasks: [],
            }),
          );
        }
        self.selectedDailyRecord = self.dailyRecords[boundaryIndex];
      },
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
              for (const key of Object.keys(dailyRecord)) {
                if (
                  dailyRecord[key] !== undefined &&
                  dailyRecord[key] !== null
                ) {
                  self.dailyRecords[index][key] = dailyRecord[key];
                }
              }
            } else {
              self.dailyRecords.splice(index, 0, dailyRecord);
            }
          }
        }
        return response;
      }),
      readOneDailyRecord: flow(function* (day: Date) {
        const response = yield api.readOneDailyRecord(day);
        if (response.kind === 'ok') {
          const boundaryIndex = self.dailyRecords.findIndex(
            (item) => item.day.getTime() >= response.dailyRecord.day.getTime(),
          );
          self.dailyRecords.splice(
            boundaryIndex,
            self.dailyRecords[boundaryIndex].id === response.dailyRecord.id
              ? 1
              : 0,
            response.dailyRecord,
          );
        }
        return response;
      }),
      createOrUpdateOneDailyRecord: flow(function* () {
        const response = yield api.createOrUpdateOneDailyRecord(
          self.selectedDailyRecord,
        );
        if (response.kind === 'ok') {
          const boundaryIndex = self.dailyRecords.findIndex(
            (item) => item.day.getTime() >= response.dailyRecord.day.getTime(),
          );
          self.dailyRecords.splice(
            boundaryIndex,
            self.dailyRecords[boundaryIndex].id === response.dailyRecord.id
              ? 1
              : 0,
            response.dailyRecord,
          );
        }
        return response;
      }),
    };
  });

export interface DailyRecordsStore
  extends Instance<typeof DailyRecordsStoreModel> {}
export interface DailyRecordsStoreSnapshot
  extends SnapshotOut<typeof DailyRecordsStoreModel> {}
