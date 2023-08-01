import { observer } from 'mobx-react-lite';
import React from 'react';
import { ViewStyle, View } from 'react-native';
import { Text } from '../../components/Text';
import { spacing } from '../../theme/spacing';
import { Routine } from '../../models/Routine';
import { translate } from '../../i18n/translate';
import { TaskItem } from './TaskItem';

export const RoutineItem = observer(function RoutineItem({
  routine,
}: {
  routine: Routine;
}) {
  return (
    <View style={$routineItem}>
      <Text
        preset="subheading"
        text={`${translate('PlanScreen.day')} ${routine.day}:`}
      />
      {routine.tasks.map((item) => (
        <TaskItem key={item.id} task={item} />
      ))}
    </View>
  );
});

const $routineItem: ViewStyle = {
  paddingHorizontal: spacing.medium,
  marginBottom: spacing.massive,
};
