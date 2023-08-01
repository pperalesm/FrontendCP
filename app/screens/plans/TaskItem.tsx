import { observer } from 'mobx-react-lite';
import React from 'react';
import { ViewStyle } from 'react-native';
import { spacing } from '../../theme/spacing';
import { Task } from '../../models/Task';
import { Card } from '../../components/Card';

export const TaskItem = observer(function TaskItem({ task }: { task: Task }) {
  return (
    <Card
      style={$taskItem}
      HeadingTextProps={{ preset: 'default' }}
      heading={task.name}
      content={task.description}
    />
  );
});

const $taskItem: ViewStyle = {
  paddingHorizontal: spacing.medium,
  marginTop: spacing.small,
  elevation: 1,
};
