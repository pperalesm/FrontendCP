import { Instance, SnapshotOut, flow, types } from 'mobx-state-tree';
import { api } from '../services/api/api';
import { DailyRecord, DailyRecordModel } from './DailyRecord';
import { DailyRecordSelectEnum } from '../utils/dailyRecordSelectEnum';

export const DailyRecordsStoreModel = types
  .model('DailyRecordsStore')
  .props({
    dailyRecords: types.array(DailyRecordModel),
    selectedDailyRecord: types.maybe(types.reference(DailyRecordModel)),
  })
  .actions((self) => ({
    select(dailyRecord: DailyRecord) {
      self.selectedDailyRecord = dailyRecord;
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
            self.dailyRecords[index] = {
              ...self.dailyRecords[index],
              ...dailyRecord,
            };
          } else {
            self.dailyRecords.splice(index, 0, dailyRecord);
          }
        }
      }
      return response;
    }),
  }));

export interface DailyRecordsStore
  extends Instance<typeof DailyRecordsStoreModel> {}
export interface DailyRecordsStoreSnapshot
  extends SnapshotOut<typeof DailyRecordsStoreModel> {}
