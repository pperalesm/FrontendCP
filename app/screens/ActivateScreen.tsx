import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { ImageStyle, TextStyle, ViewStyle, Image, View } from 'react-native';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { Screen } from '../components/Screen';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppStackScreenProps } from '../navigators/AppNavigator';
import { useStores } from '../models/helpers/useStores';
import { Feather } from '@expo/vector-icons';
import { Divider } from '../components/Divider';

const logoUrl = require('../../assets/images/cp-logo.png');

interface ActivateScreenProps extends AppStackScreenProps<'Activate'> {}

export const ActivateScreen: FC<ActivateScreenProps> = observer(
  function ActivateScreen(_props) {
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const rootStore = useStores();

    async function requestActivation() {
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

        <Text tx="ActivateScreen.procedure" style={$procedureText} />

        <Text
          tx="ActivateScreen.procedureHint"
          preset="hint"
          style={$procedureText}
        />

        <Divider size={spacing.extraLarge} />

        {hasSubmitted ? (
          <View style={$activationRequestedView}>
            <Feather name="check-circle" size={24} color={colors.success} />
            <Text
              tx="ActivateScreen.activationRequested"
              preset="bold"
              style={$activationRequestedText}
            />
          </View>
        ) : (
          <Button
            tx={'ActivateScreen.requestActivation'}
            onPress={requestActivation}
            isLoading={isLoading}
          />
        )}

        <Text
          tx="ActivateScreen.signOut"
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
};

const $activationRequestedText: TextStyle = {
  color: colors.success,
  marginLeft: spacing.small,
};

const $signOutText: TextStyle = {
  marginTop: spacing.medium,
  textAlign: 'center',
  color: colors.primary,
};
