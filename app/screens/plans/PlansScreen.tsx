import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import {
  FlatList,
  ViewStyle,
  Image,
  ImageStyle,
  View,
  TextStyle,
} from 'react-native';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { spacing } from '../../theme/spacing';
import { useStores } from '../../models/helpers/useStores';
import { Plan } from '../../models/Plan';
import {
  PlansParamList,
  PlansScreenProps,
} from '../../navigators/PlansNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { translate } from '../../i18n/translate';

type PlansScreenNavigationProp = NativeStackNavigationProp<
  PlansParamList,
  'Plans'
>;

export const PlansScreen: FC<PlansScreenProps<'Plans'>> = observer(
  function PlansScreen(_props) {
    const rootStore = useStores();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      reload();
    }, [rootStore.plansStore]);

    async function reload() {
      setIsLoading(true);
      await rootStore.plansStore.readAllPlans();
      setIsLoading(false);
    }

    return (
      <Screen preset="fixed" safeAreaEdges={['top']}>
        <FlatList<Plan>
          data={rootStore.plansStore.plans}
          ListHeaderComponent={
            <>
              <Text preset="heading" tx="PlansScreen.title" />
              <View style={$warningPanel}>
                <Text
                  style={$warningPanelText}
                  preset="hint"
                  tx="PlansScreen.warning"
                />
              </View>
            </>
          }
          ListHeaderComponentStyle={$heading}
          contentContainerStyle={$flatListContentContainer}
          progressViewOffset={spacing.massive * 3 + spacing.huge}
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
          renderItem={({ item }) => <PlanCard key={item.id} plan={item} />}
        />
      </Screen>
    );
  },
);

const PlanCard = observer(function PlanCard({ plan }: { plan: Plan }) {
  const rootStore = useStores();
  const navigation = useNavigation<PlansScreenNavigationProp>();

  async function handlePressCard() {
    rootStore.plansStore.select(plan);
    navigation.navigate('Routines');
  }

  return (
    <Card
      style={[$item, plan.currentDay && $activeItem]}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      HeadingComponent={
        <View style={$itemHeading}>
          <Text preset="bold" text={plan.name} />
          <Text
            preset="hint"
            style={$itemHeadingRight}
            text={`${plan.numDays} ${translate('PlansScreen.days')}`}
          />
        </View>
      }
      content={plan.description}
      footerTx={plan.currentDay ? 'PlansScreen.active' : undefined}
      footerStyle={$itemFooter}
      ContentTextProps={{ numberOfLines: 3 }}
      LeftComponent={<Image style={$image} source={{ uri: plan.imageUrl }} />}
    />
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

const $itemHeading: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: spacing.micro,
};

const $itemHeadingRight: TextStyle = {
  color: colors.secondaryText,
};

const $item: ViewStyle = {
  marginBottom: spacing.medium,
  minHeight: 115,
};

const $itemFooter: TextStyle = {
  alignSelf: 'flex-end',
  color: colors.success,
};

const $activeItem: ViewStyle = {
  borderWidth: spacing.micro,
  borderColor: colors.success,
};

const $image: ImageStyle = { width: 75, height: 75 };

const $emptyList: ViewStyle = { marginTop: spacing.huge * 4 };
