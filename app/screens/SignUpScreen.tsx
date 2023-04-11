import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  ImageStyle,
  TextInput,
  TextStyle,
  View,
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
import { TxKeyPath } from '../i18n';
import { useStores } from '../models';
import { AppStackParamList, AppStackScreenProps } from '../navigators';
import { colors, spacing } from '../theme';
import { Feather } from '@expo/vector-icons';
import { isEmailValid } from '../utils/isEmailValid';
import { isPasswordValid } from '../utils/isPasswordValid';

const logoUrl = require('../../assets/images/cp-logo.png');

interface SignUpScreenProps extends AppStackScreenProps<'SignUp'> {}

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'SignUp'
>;

export const SignUpScreen: FC<SignUpScreenProps> = observer(
  function SignUpScreen(_props) {
    const passwordRef = useRef<TextInput>();
    const repeatedPasswordRef = useRef<TextInput>();

    const navigation = useNavigation<SignUpScreenNavigationProp>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [emailValidationError, setEmailValidationError] =
      useState<TxKeyPath>();
    const [passwordValidationError, setPasswordValidationError] =
      useState<TxKeyPath>();
    const [
      repeatedPasswordValidationError,
      setRepeatedPasswordValidationError,
    ] = useState<TxKeyPath>();
    const [hasEmailBeenTouched, setHasEmailBeenTouched] = useState(false);
    const [hasPasswordBeenTouched, setHasPasswordBeenTouched] = useState(false);
    const [hasRepeatedPasswordBeenTouched, setHasRepeatedPasswordBeenTouched] =
      useState(false);
    const [hasTriedSubmitting, setHasTriedSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [ispasswordHidden, setIspasswordHidden] = useState(true);
    const rootStore = useStores();

    useEffect(() => {
      if (!hasEmailBeenTouched && !hasTriedSubmitting) return;
      if (email.length === 0) {
        setEmailValidationError('common.fieldRequired');
        return;
      }
      if (!isEmailValid(email)) {
        setEmailValidationError('SignUpScreen.emailFieldInvalid');
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
      if (!isPasswordValid(password)) {
        setPasswordValidationError('SignUpScreen.passwordFieldInvalid');
        return;
      }
      setPasswordValidationError(undefined);
    }, [password, hasPasswordBeenTouched, hasTriedSubmitting]);

    useEffect(() => {
      if (!hasRepeatedPasswordBeenTouched && !hasTriedSubmitting) return;
      if (repeatedPassword.length === 0) {
        setRepeatedPasswordValidationError('common.fieldRequired');
        return;
      }
      if (repeatedPassword !== password) {
        setRepeatedPasswordValidationError('SignUpScreen.notSamePassword');
        return;
      }
      setRepeatedPasswordValidationError(undefined);
    }, [
      repeatedPassword,
      password,
      hasRepeatedPasswordBeenTouched,
      hasTriedSubmitting,
    ]);

    async function signUp() {
      setHasTriedSubmitting(true);
      if (
        emailValidationError ||
        passwordValidationError ||
        repeatedPasswordValidationError
      )
        return;
      setIsLoading(true);
      const response = await rootStore.authenticationStore.signUp(
        email,
        password,
      );
      setIsLoading(false);
      if (response.kind === 'ok') setHasSubmitted(true);
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
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="SignUpScreen.emailFieldLabel"
          helperTx={emailValidationError}
          status={emailValidationError ? 'error' : undefined}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <TextField
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          onBlur={() => setHasPasswordBeenTouched(true)}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={ispasswordHidden}
          labelTx="SignUpScreen.passwordFieldLabel"
          helperTx={passwordValidationError}
          status={passwordValidationError ? 'error' : undefined}
          onSubmitEditing={() => repeatedPasswordRef.current?.focus()}
          RightAccessory={PasswordRightAccessory}
        />

        <TextField
          ref={repeatedPasswordRef}
          value={repeatedPassword}
          onChangeText={setRepeatedPassword}
          onBlur={() => setHasRepeatedPasswordBeenTouched(true)}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={ispasswordHidden}
          labelTx="SignUpScreen.repeatedPasswordFieldLabel"
          helperTx={repeatedPasswordValidationError}
          status={repeatedPasswordValidationError ? 'error' : undefined}
          onSubmitEditing={signUp}
          RightAccessory={PasswordRightAccessory}
        />

        {hasSubmitted ? (
          <>
            <View style={$accountCreatedView}>
              <Feather name="check-circle" size={24} color={colors.success} />
              <Text
                tx="SignUpScreen.accountCreated"
                preset="bold"
                style={$accountCreatedText}
              />
            </View>
            <Text
              tx="SignUpScreen.accountCreatedHint"
              preset="helper"
              style={$accountCreatedHintText}
            />
          </>
        ) : (
          <Button
            tx={'SignUpScreen.signUp'}
            style={$signUpButton}
            preset={'filled'}
            onPress={signUp}
            isLoading={isLoading}
          />
        )}

        <Text
          tx="SignUpScreen.signIn"
          preset="hint"
          style={$signInText}
          onPress={() => navigation.pop()}
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

const $textField: ViewStyle = {
  marginBottom: spacing.large,
};

const $signUpButton: ViewStyle = {
  marginTop: spacing.medium,
};

const $accountCreatedView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: spacing.medium,
};

const $accountCreatedText: TextStyle = {
  color: colors.success,
  marginLeft: spacing.small,
};

const $accountCreatedHintText: TextStyle = {
  color: colors.success,
  textAlign: 'center',
  marginTop: spacing.small,
};

const $signInText: TextStyle = {
  marginTop: spacing.medium,
  textAlign: 'center',
  color: colors.primary,
};
