import { observer } from 'mobx-react-lite';
import React from 'react';
import { ViewStyle, Image, ImageStyle, View, TextStyle } from 'react-native';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { spacing } from '../../theme/spacing';
import { useStores } from '../../models/helpers/useStores';
import { Plan } from '../../models/Plan';
import { PlansStoreParamList } from '../../navigators/PlansNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { translate } from '../../i18n/translate';

type PlansStoreScreenNavigationProp = NativeStackNavigationProp<
  PlansStoreParamList,
  'PlansStore'
>;

export const PlanItem = observer(function PlanItem({ plan }: { plan: Plan }) {
  const { plansStore } = useStores();

  const navigation = useNavigation<PlansStoreScreenNavigationProp>();

  return (
    <Card
      style={[$item, plan.isActive && $activeItem]}
      verticalAlignment="force-footer-bottom"
      onPress={() => {
        plansStore.handlePressCard(plan);
        navigation.navigate('Plan');
      }}
      HeadingComponent={
        <View style={$itemHeading}>
          <Text preset="bold" text={plan.name} />
          <Text
            preset="hint"
            style={$itemHeadingRight}
            text={`${plan.numDays} ${translate('PlansStoreScreen.days')}`}
          />
        </View>
      }
      content={plan.description}
      footerTx={plan.isActive ? 'PlansStoreScreen.active' : undefined}
      footerStyle={$itemFooter}
      ContentTextProps={{ numberOfLines: 3 }}
      LeftComponent={<Image style={$image} source={{ uri: plan.imageUrl }} />}
    />
  );
});

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
  color: colors.secondary,
};

const $activeItem: ViewStyle = {
  borderWidth: spacing.micro,
  borderColor: colors.secondary,
};

const $image: ImageStyle = { width: 75, height: 75 };
