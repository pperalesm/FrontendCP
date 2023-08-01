import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { FlatList, ViewStyle, View, TextStyle } from 'react-native';
import { Text } from '../../components/Text';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { spacing } from '../../theme/spacing';
import { useStores } from '../../models/helpers/useStores';
import { Plan } from '../../models/Plan';
import { PlansStoreScreenProps } from '../../navigators/PlansNavigator';
import { colors } from '../../theme/colors';
import { PlanItem } from './PlanItem';

export const PlansStoreScreen: FC<PlansStoreScreenProps<'PlansStore'>> =
  observer(function PlansStoreScreen(_props) {
    const { plansStore } = useStores();

    useEffect(() => {
      plansStore.reloadPlans();
    }, [plansStore]);

    return (
      <Screen preset="fixed" safeAreaEdges={['top']}>
        <FlatList<Plan>
          data={plansStore.plans}
          ListHeaderComponent={
            <>
              <Text preset="heading" tx="PlansStoreScreen.title" />
              <View style={$warningPanel}>
                <Text
                  style={$warningPanelText}
                  preset="hint"
                  tx="PlansStoreScreen.warning"
                />
              </View>
            </>
          }
          ListHeaderComponentStyle={$heading}
          contentContainerStyle={$flatListContentContainer}
          progressViewOffset={spacing.massive * 3 + spacing.huge}
          refreshing={plansStore.arePlansLoading}
          onRefresh={plansStore.reloadPlans}
          ListEmptyComponent={
            plansStore.arePlansLoading ? (
              <View style={$emptyList} />
            ) : (
              <EmptyState
                style={$emptyList}
                preset="generic"
                buttonOnPress={plansStore.reloadPlans}
              />
            )
          }
          renderItem={({ item }) => <PlanItem key={item.id} plan={item} />}
        />
      </Screen>
    );
  });

const $warningPanel: ViewStyle = {
  marginTop: spacing.extraLarge,
  paddingHorizontal: spacing.medium,
  paddingVertical: spacing.small,
  backgroundColor: colors.warningBackground,
  borderWidth: 1,
  borderColor: colors.warning,
  borderRadius: spacing.extraSmall,
};

const $warningPanelText: TextStyle = {
  color: colors.warning,
  textAlign: 'justify',
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.medium,
};

const $heading: ViewStyle = {
  marginVertical: spacing.extraLarge,
};

const $emptyList: ViewStyle = { marginTop: spacing.huge * 4 };
