import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, ViewStyle, Image, ImageStyle, View } from 'react-native';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { spacing } from '../theme/spacing';
import { useStores } from '../models/helpers/useStores';
import { Plan } from '../models/Plan';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlansParamList, PlansScreenProps } from '../navigators/PlansNavigator';

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
          ListHeaderComponent={<Text preset="heading" tx="PlansScreen.title" />}
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
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      heading={plan.name}
      content={plan.description}
      ContentTextProps={{ numberOfLines: 3 }}
      LeftComponent={<Image style={$image} source={{ uri: plan.imageUrl }} />}
    />
  );
});

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.medium,
};

const $heading: ViewStyle = {
  marginVertical: spacing.extraLarge,
};

const $item: ViewStyle = {
  marginBottom: spacing.medium,
  height: 115,
};

const $image: ImageStyle = { width: 75, height: 75 };

const $emptyList: ViewStyle = { marginTop: spacing.huge * 4 };
