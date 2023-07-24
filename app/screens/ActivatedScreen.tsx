import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { Text } from '../components/Text';
import { Screen } from '../components/Screen';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppStackParamList,
  AppStackScreenProps,
} from '../navigators/AppNavigator';
import { useStores } from '../models/helpers/useStores';

interface ActivatedScreenProps extends AppStackScreenProps<'Activated'> {}

type ActivatedScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'Activated'
>;

export const ActivatedScreen: FC<ActivatedScreenProps> = observer(
  function ActivatedScreen(_props) {
    const rootStore = useStores();

    const navigation = useNavigation<ActivatedScreenNavigationProp>();

    useEffect(() => {
      setTimeout(async () => {
        if (rootStore.authenticationStore.user) {
          await rootStore.authenticationStore.me();
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainNavigator' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        }
      }, 2000);
    }, []);

    return (
      <Screen
        preset="auto"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={['top', 'bottom']}
      >
        <View style={$accountActivatedView}>
          <Feather name="check-circle" size={24} color={colors.success} />
          <Text
            tx="ActivatedScreen.accountActivated"
            preset="bold"
            style={$accountActivatedText}
          />
        </View>
      </Screen>
    );
  },
);

const $screenContentContainer: ViewStyle = {
  justifyContent: 'center',
  height: '100%',
};

const $accountActivatedView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: spacing.medium,
  marginBottom: spacing.small,
};

const $accountActivatedText: TextStyle = {
  color: colors.success,
  marginLeft: spacing.small,
};
