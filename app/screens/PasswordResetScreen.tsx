import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { Screen, Text } from '../components';
import { useStores } from '../models';
import { AppStackParamList, AppStackScreenProps } from '../navigators';
import { colors, spacing } from '../theme';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface PasswordResetScreenProps
  extends AppStackScreenProps<'PasswordReset'> {}

type PasswordResetScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'PasswordReset'
>;

export const PasswordResetScreen: FC<PasswordResetScreenProps> = observer(
  function PasswordResetScreen(_props) {
    const rootStore = useStores();

    const navigation = useNavigation<PasswordResetScreenNavigationProp>();

    useEffect(() => {
      setTimeout(() => {
        if (rootStore.authenticationStore.user) {
          rootStore.authenticationStore.clearUser();
        }
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }, 2000);
    }, []);

    return (
      <Screen
        preset="auto"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={['top', 'bottom']}
      >
        <View style={$passwordResetView}>
          <Feather name="check-circle" size={24} color={colors.success} />
          <Text
            tx="PasswordResetScreen.passwordReset"
            preset="bold"
            style={$passwordResetText}
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

const $passwordResetView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: spacing.medium,
  marginBottom: spacing.small,
};

const $passwordResetText: TextStyle = {
  color: colors.success,
  marginLeft: spacing.small,
};
