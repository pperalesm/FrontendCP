import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { FlatList, ViewStyle, View, TextStyle } from 'react-native';
import { Text } from '../../components/Text';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { spacing } from '../../theme/spacing';
import { useStores } from '../../models/helpers/useStores';
import { Routine } from '../../models/Routine';
import { colors } from '../../theme/colors';
import { PlansStoreScreenProps } from '../../navigators/PlansNavigator';
import { Button } from '../../components/Button';
import { RoutineItem } from './RoutineItem';

export const PlanScreen: FC<PlansStoreScreenProps<'Plan'>> = observer(
  function PlanScreen(_props) {
    const { plansStore } = useStores();

    useEffect(() => {
      plansStore.selectedPlan.reloadRoutines();
    }, []);

    return (
      <Screen preset="fixed" safeAreaEdges={['top']}>
        <FlatList<Routine>
          data={plansStore.selectedPlan.routines}
          ListHeaderComponent={
            <>
              <Text preset="heading" text={plansStore.selectedPlan.name} />
              <View style={$descriptionPanel}>
                <Text
                  style={$descriptionPanelText}
                  preset="hint"
                  text={plansStore.selectedPlan.description}
                />
              </View>
            </>
          }
          ListHeaderComponentStyle={$heading}
          contentContainerStyle={$flatListContentContainer}
          progressViewOffset={spacing.massive * 2}
          refreshing={plansStore.selectedPlan.areRoutinesLoading}
          onRefresh={plansStore.selectedPlan.reloadRoutines}
          ListEmptyComponent={
            plansStore.selectedPlan.areRoutinesLoading ? (
              <View style={$emptyList} />
            ) : (
              <EmptyState
                style={$emptyList}
                preset="generic"
                buttonOnPress={plansStore.selectedPlan.reloadRoutines}
              />
            )
          }
          renderItem={({ item }) => (
            <RoutineItem key={item.day} routine={item} />
          )}
        />
        {plansStore.selectedPlan.routines.length ? (
          <Button
            preset={plansStore.selectedPlan.isActive ? 'default' : 'filled'}
            onPress={() => {
              plansStore.handlePressStartOrEnd(plansStore.selectedPlan);
            }}
            tx={
              plansStore.selectedPlan.isActive
                ? 'PlanScreen.end'
                : 'PlanScreen.start'
            }
            style={$startOrEndButton}
            isLoading={plansStore.selectedPlan.isStartOrEndLoading}
          />
        ) : (
          <></>
        )}
      </Screen>
    );
  },
);

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

const $emptyList: ViewStyle = { marginTop: spacing.huge * 4 };
