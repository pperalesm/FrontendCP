import { ApiResponse } from 'apisauce';
import { Api, handleResponse } from './api';
import { DailyRecord, DailyRecordSnapshotIn } from '../../models/DailyRecord';
import { DailyRecordSelectEnum } from '../../utils/dailyRecordSelectEnum';
import { PrivateDailyRecordDto } from './api.types';

export async function readManyDailyRecords(
  this: Api,
  from: Date,
  to: Date,
  select?: DailyRecordSelectEnum[],
) {
  const response: ApiResponse<PrivateDailyRecordDto[]> =
    await this.apisauce.get(
      `daily-records?from=${from.toISOString()}&to=${to.toISOString()}&${
        select
          ? select.reduce((prev, curr) => prev + `select[]=${curr}&`, '')
          : ''
      }`,
    );

  return await handleResponse(response, (res) => {
    const dailyRecords: DailyRecordSnapshotIn[] = res.data.map(
      (dailyRecord) => ({
        ...dailyRecord,
        createdAt: new Date(dailyRecord.createdAt),
        updatedAt: new Date(dailyRecord.updatedAt),
        day: new Date(dailyRecord.day),
        activityCategories: dailyRecord.activityCategoryIds,
        tasks: dailyRecord.taskIds,
      }),
    );

    return { kind: 'ok', dailyRecords };
  });
}

export async function readOneDailyRecord(this: Api, day: Date) {
  const response: ApiResponse<PrivateDailyRecordDto> = await this.apisauce.get(
    `daily-records/${day.toISOString()}`,
  );

  return await handleResponse(response, (res) => {
    const dailyRecord: DailyRecordSnapshotIn = {
      ...res.data,
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
      day: new Date(res.data.day),
      activityCategories: res.data.activityCategoryIds,
      tasks: res.data.taskIds,
    };

    return { kind: 'ok', dailyRecord };
  });
}

export async function createOrUpdateOneDailyRecord(
  this: Api,
  dailyRecord: DailyRecord,
) {
  const response: ApiResponse<PrivateDailyRecordDto> = await this.apisauce.put(
    `daily-records`,
    dailyRecord,
  );

  return await handleResponse(response, (res) => {
    const dailyRecord: DailyRecordSnapshotIn = {
      ...res.data,
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
      day: new Date(res.data.day),
      activityCategories: res.data.activityCategoryIds,
      tasks: res.data.taskIds,
    };

    return { kind: 'ok', dailyRecord };
  });
}
