import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo, useRef, useState } from 'react';
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
    const passwordInput = useRef<TextInput>();
    const repeatedPasswordInput = useRef<TextInput>();

    const navigation = useNavigation<SignUpScreenNavigationProp>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [hasEmailBeenTouched, setHasEmailBeenTouched] = useState(false);
    const [hasPasswordBeenTouched, setHasPasswordBeenTouched] = useState(false);
    const [hasRepeatedPasswordBeenTouched, setHasRepeatedPasswordBeenTouched] =
      useState(false);
    const [hasTriedSubmitting, setHasTriedSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [ispasswordHidden, setIspasswordHidden] = useState(true);
    const rootStore = useStores();

    function emailValidationError() {
      if (email.length === 0) return 'common.fieldRequired';
      if (!isEmailValid(email)) return 'SignUpScreen.emailFieldInvalid';
      return undefined;
    }

    function passwordValidationError(): TxKeyPath {
      if (password.length === 0) return 'common.fieldRequired';
      if (!isPasswordValid(password))
        return 'SignUpScreen.passwordFieldInvalid';
      return undefined;
    }

    function repeatedPasswordValidationError(): TxKeyPath {
      if (repeatedPassword.length === 0) return 'common.fieldRequired';
      if (repeatedPassword !== password) return 'SignUpScreen.notSamePassword';
      return undefined;
    }

    async function signUp() {
      setHasTriedSubmitting(true);
      if (
        emailValidationError() ||
        passwordValidationError() ||
        repeatedPasswordValidationError() ||
        isLoading
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
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={ispasswordHidden}
          labelTx="SignUpScreen.passwordFieldLabel"
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
          onSubmitEditing={() => repeatedPasswordInput.current?.focus()}
          RightAccessory={PasswordRightAccessory}
        />

        <TextField
          ref={repeatedPasswordInput}
          value={repeatedPassword}
          onChangeText={setRepeatedPassword}
          onBlur={() => setHasRepeatedPasswordBeenTouched(true)}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={ispasswordHidden}
          labelTx="SignUpScreen.repeatedPasswordFieldLabel"
          helperTx={
            (hasRepeatedPasswordBeenTouched || hasTriedSubmitting) &&
            repeatedPasswordValidationError()
              ? repeatedPasswordValidationError()
              : undefined
          }
          status={
            (hasRepeatedPasswordBeenTouched || hasTriedSubmitting) &&
            repeatedPasswordValidationError()
              ? 'error'
              : undefined
          }
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
