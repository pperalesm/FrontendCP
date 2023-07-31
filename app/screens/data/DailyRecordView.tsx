import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useStores } from '../../models/helpers/useStores';

export function DailyRecordView() {
  const {
    dailyRecordsStore: { readOneDailyRecord, selectedDailyRecord },
  } = useStores();

  useEffect(() => {
    if (!selectedDailyRecord) {
      // select(dummyDailyRecord);
    } else {
      reload();
    }
  }, [selectedDailyRecord]);

  async function reload() {
    await readOneDailyRecord();
  }

  return <View></View>;
}
