import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
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
    const passwordRef = useRef<TextInput>();

    const navigation = useNavigation<SignInScreenNavigationProp>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailValidationError, setEmailValidationError] =
      useState<TxKeyPath>();
    const [passwordValidationError, setPasswordValidationError] =
      useState<TxKeyPath>();
    const [hasEmailBeenTouched, setHasEmailBeenTouched] = useState(false);
    const [hasPasswordBeenTouched, setHasPasswordBeenTouched] = useState(false);
    const [hasTriedSubmitting, setHasTriedSubmitting] = useState(false);
    const [areCredentialsInvalid, setAreCredentialsInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [ispasswordHidden, setIspasswordHidden] = useState(true);
    const rootStore = useStores();

    useEffect(() => {
      if (!hasEmailBeenTouched && !hasTriedSubmitting) return;
      if (email.length === 0) {
        setEmailValidationError('common.fieldRequired');
        return;
      }
      if (!isEmailValid(email)) {
        setEmailValidationError('SignInScreen.emailFieldInvalid');
        return;
      }
      setEmailValidationError(undefined);
    }, [email, hasEmailBeenTouched, hasTriedSubmitting]);

    useEffect(() => {
      if (!hasPasswordBeenTouched && !hasTriedSubmitting) return;
      if (password.length === 0) {
        setPasswordValidationError('common.fieldRequired');
        return;
      }
      setPasswordValidationError(undefined);
    }, [password, hasPasswordBeenTouched, hasTriedSubmitting]);

    async function signIn() {
      setHasTriedSubmitting(true);
      if (emailValidationError || passwordValidationError) return;
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
          helperTx={emailValidationError}
          status={emailValidationError ? 'error' : undefined}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <TextField
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          onBlur={() => setHasPasswordBeenTouched(true)}
          containerStyle={$passwordTextField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={ispasswordHidden}
          labelTx="SignInScreen.passwordFieldLabel"
          helperTx={passwordValidationError}
          status={passwordValidationError ? 'error' : undefined}
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
