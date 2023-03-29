import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { ImageStyle, TextStyle, ViewStyle, Image, View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import { Button, Screen, Text } from '../components';
import { useStores } from '../models';
import { AppStackScreenProps } from '../navigators';
import { colors, spacing } from '../theme';
import { Feather } from '@expo/vector-icons';
import { Divider } from '../components/Divider';

const logoUrl = require('../../assets/images/cp-logo.png');

interface ActivationScreenProps extends AppStackScreenProps<'Activation'> {}

export const ActivationScreen: FC<ActivationScreenProps> = observer(
  function ActivationScreen(_props) {
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const rootStore = useStores();

    async function requestActivation() {
      if (isLoading) return;
      setIsLoading(true);
      const response = await rootStore.authenticationStore.requestActivation();
      setIsLoading(false);
      if (response.kind === 'ok') setHasSubmitted(true);
    }

    return (
      <Screen
        preset="auto"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={['top', 'bottom']}
      >
        <Image style={$image} source={logoUrl} />

        <Text tx="ActivationScreen.procedure" style={$procedureText} />

        <Text
          tx="ActivationScreen.procedureHint"
          preset="hint"
          style={$procedureText}
        />

        <Divider size={spacing.massive} />

        {hasSubmitted ? (
          <View style={$activationRequestedView}>
            <Feather name="check-circle" size={24} color={colors.success} />
            <Text
              tx="ActivationScreen.activationRequested"
              preset="bold"
              style={$activationRequestedText}
            />
          </View>
        ) : (
          <Button
            tx={isLoading ? undefined : 'ActivationScreen.requestActivation'}
            onPress={requestActivation}
          >
            {isLoading && <Chase size={22} color={colors.primaryDark}></Chase>}
          </Button>
        )}

        <Text
          tx="ActivationScreen.signOut"
          preset="hint"
          style={$signOutText}
          onPress={rootStore.authenticationStore.signOut}
        />
      </Screen>
    );
  },
);

const $image: ImageStyle = {
  margin: spacing.extraLarge,
  alignSelf: 'center',
  height: 150,
  width: 150,
};

const $screenContentContainer: ViewStyle = {
  padding: spacing.large,
};

const $procedureText: TextStyle = {
  marginTop: spacing.extraLarge,
  textAlign: 'center',
};

const $activationRequestedView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: spacing.medium,
  marginBottom: spacing.small,
};

const $activationRequestedText: TextStyle = {
  color: colors.success,
  marginLeft: spacing.small,
};

const $signOutText: TextStyle = {
  marginTop: spacing.small,
  textAlign: 'center',
  color: colors.primary,
};
