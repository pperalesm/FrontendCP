import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo, useRef, useState } from 'react';
import {
  ImageStyle,
  TextInput,
  TextStyle,
  ViewStyle,
  Image,
} from 'react-native';
import {
  Button,
  Icon,
  Screen,
  TextField,
  TextFieldAccessoryProps,
  Text,
} from '../components';
import { Divider } from '../components/Divider';
import { TxKeyPath } from '../i18n';
import { useStores } from '../models';
import { AppStackParamList, AppStackScreenProps } from '../navigators';
import { colors, spacing } from '../theme';
import { isEmailValid } from '../utils/isEmailValid';

const logoUrl = require('../../assets/images/cp-logo.png');

interface SignInScreenProps extends AppStackScreenProps<'SignIn'> {}

type SignInScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'SignIn'
>;

export const SignInScreen: FC<SignInScreenProps> = observer(
  function SignInScreen(_props) {
    const passwordInput = useRef<TextInput>();

    const navigation = useNavigation<SignInScreenNavigationProp>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasEmailBeenTouched, setHasEmailBeenTouched] = useState(false);
    const [hasPasswordBeenTouched, setHasPasswordBeenTouched] = useState(false);
    const [hasTriedSubmitting, setHasTriedSubmitting] = useState(false);
    const [areCredentialsInvalid, setAreCredentialsInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [ispasswordHidden, setIspasswordHidden] = useState(true);
    const rootStore = useStores();

    function emailValidationError(): TxKeyPath {
      if (email.length === 0) return 'common.fieldRequired';
      if (!isEmailValid(email)) return 'SignInScreen.emailFieldInvalid';
      return undefined;
    }

    function passwordValidationError(): TxKeyPath {
      if (password.length === 0) return 'common.fieldRequired';
      return undefined;
    }

    async function signIn() {
      setHasTriedSubmitting(true);
      if (emailValidationError() || passwordValidationError() || isLoading)
        return;
      setIsLoading(true);
      const response = await rootStore.authenticationStore.signIn(
        email,
        password,
      );
      setIsLoading(false);
      if (response.kind === 'unauthorized') setAreCredentialsInvalid(true);
    }

    const PasswordRightAccessory = useMemo(
      () =>
        function PasswordRightAccessory(props: TextFieldAccessoryProps) {
          return (
            <Icon
              icon={ispasswordHidden ? 'view' : 'hidden'}
              color={colors.primaryText}
              containerStyle={props.style}
              size={20}
              onPress={() => setIspasswordHidden(!ispasswordHidden)}
            />
          );
        },
      [ispasswordHidden],
    );

    return (
      <Screen
        preset="auto"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={['top', 'bottom']}
      >
        <Image style={$image} source={logoUrl} />

        <TextField
          value={email}
          onChangeText={setEmail}
          onBlur={() => setHasEmailBeenTouched(true)}
          containerStyle={$emailTextField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="SignInScreen.emailFieldLabel"
          helperTx={
            (hasEmailBeenTouched || hasTriedSubmitting) &&
            emailValidationError()
              ? emailValidationError()
              : undefined
          }
          status={
            (hasEmailBeenTouched || hasTriedSubmitting) &&
            emailValidationError()
              ? 'error'
              : undefined
          }
          onSubmitEditing={() => passwordInput.current?.focus()}
        />

        <TextField
          ref={passwordInput}
          value={password}
          onChangeText={setPassword}
          onBlur={() => setHasPasswordBeenTouched(true)}
          containerStyle={$passwordTextField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={ispasswordHidden}
          labelTx="SignInScreen.passwordFieldLabel"
          helperTx={
            (hasPasswordBeenTouched || hasTriedSubmitting) &&
            passwordValidationError()
              ? passwordValidationError()
              : undefined
          }
          status={
            (hasPasswordBeenTouched || hasTriedSubmitting) &&
            passwordValidationError()
              ? 'error'
              : undefined
          }
          onSubmitEditing={signIn}
          RightAccessory={PasswordRightAccessory}
        />

        {areCredentialsInvalid && (
          <Text
            tx="SignInScreen.invalidCredentials"
            preset="helper"
            style={$invalidCredentialsText}
          />
        )}

        <Button
          tx={'SignInScreen.signIn'}
          preset={'filled'}
          style={$signInButton}
          onPress={signIn}
          isLoading={isLoading}
        />

        <Text
          tx="SignInScreen.forgotPassword"
          preset="hint"
          style={$forgotPasswordText}
          onPress={() => navigation.push('ResetPassword')}
        />

        <Divider size={spacing.extraLarge} />

        <Button
          tx="SignInScreen.signUp"
          fitToContent
          onPress={() => navigation.push('SignUp')}
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

const $emailTextField: ViewStyle = {
  marginBottom: spacing.large,
};

const $passwordTextField: ViewStyle = {
  marginBottom: spacing.huge,
};

const $invalidCredentialsText: TextStyle = {
  marginBottom: spacing.medium,
  textAlign: 'center',
  color: colors.error,
};

const $signInButton: ViewStyle = {};

const $forgotPasswordText: TextStyle = {
  marginTop: spacing.medium,
  textAlign: 'center',
  color: colors.primary,
};
