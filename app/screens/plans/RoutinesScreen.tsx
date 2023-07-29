import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, ViewStyle, View, TextStyle } from 'react-native';
import { Text } from '../../components/Text';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { spacing } from '../../theme/spacing';
import { useStores } from '../../models/helpers/useStores';
import { Routine } from '../../models/Routine';
import { colors } from '../../theme/colors';
import { PlansScreenProps } from '../../navigators/PlansNavigator';
import { Task } from '../../models/Task';
import { translate } from '../../i18n/translate';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const RoutinesScreen: FC<PlansScreenProps<'Routines'>> = observer(
  function RoutinesScreen(_props) {
    const {
      plansStore: {
        selectedPlan: {
          name,
          description,
          currentDay,
          readAllRoutines,
          routines,
        },
        updateOnePlan,
      },
    } = useStores();

    const [isLoading, setIsLoading] = useState(false);
    const [isDoneLoading, setIsDoneLoading] = useState(false);

    async function handlePressStartOrEnd() {
      setIsDoneLoading(true);
      await updateOnePlan({ assigned: !currentDay });
      setIsDoneLoading(false);
    }

    useEffect(() => {
      reload();
    }, []);

    async function reload() {
      setIsLoading(true);
      await readAllRoutines();
      setIsLoading(false);
    }

    return (
      <Screen preset="fixed" safeAreaEdges={['top']}>
        <FlatList<Routine>
          data={routines}
          ListHeaderComponent={
            <>
              <Text preset="heading" text={name} />
              <View style={$descriptionPanel}>
                <Text
                  style={$descriptionPanelText}
                  preset="hint"
                  text={description}
                />
              </View>
            </>
          }
          ListHeaderComponentStyle={$heading}
          contentContainerStyle={$flatListContentContainer}
          progressViewOffset={spacing.massive * 2}
          refreshing={isLoading}
          onRefresh={reload}
          ListEmptyComponent={
            isLoading ? (
              <View style={$emptyList} />
            ) : (
              <EmptyState
                style={$emptyList}
                preset="generic"
                buttonOnPress={reload}
              />
            )
          }
          renderItem={({ item }) => (
            <RoutineItem key={item.day} routine={item} />
          )}
        />
        {routines.length ? (
          <Button
            preset={currentDay ? 'default' : 'filled'}
            onPress={handlePressStartOrEnd}
            tx={currentDay ? 'RoutinesScreen.end' : 'RoutinesScreen.start'}
            style={$startOrEndButton}
            isLoading={isDoneLoading}
          />
        ) : (
          <></>
        )}
      </Screen>
    );
  },
);

const RoutineItem = observer(function RoutineItem({
  routine,
}: {
  routine: Routine;
}) {
  return (
    <View style={$routineItem}>
      <Text
        preset="subheading"
        text={`${translate('RoutinesScreen.day')} ${routine.day}:`}
      />
      {routine.tasks.map((item) => (
        <TaskItem key={item.id} task={item} />
      ))}
    </View>
  );
});

const TaskItem = observer(function TaskItem({ task }: { task: Task }) {
  return (
    <Card
      style={$taskItem}
      HeadingTextProps={{ preset: 'default' }}
      heading={task.name}
      content={task.description}
    />
  );
});

const $startOrEndButton: ViewStyle = {
  position: 'absolute',
  bottom: spacing.medium,
  right: spacing.medium,
  left: spacing.medium,
};

const $descriptionPanel: ViewStyle = {
  marginTop: spacing.extraLarge,
  paddingHorizontal: spacing.medium,
};

const $descriptionPanelText: TextStyle = {
  color: colors.secondaryText,
  textAlign: 'justify',
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.medium,
  paddingBottom: spacing.massive,
};

const $heading: ViewStyle = {
  marginVertical: spacing.extraLarge,
};

const $routineItem: ViewStyle = {
  paddingHorizontal: spacing.medium,
  marginBottom: spacing.massive,
};

const $taskItem: ViewStyle = {
  paddingHorizontal: spacing.medium,
  marginTop: spacing.small,
  elevation: 1,
};

const $emptyList: ViewStyle = { marginTop: spacing.huge * 4 };
