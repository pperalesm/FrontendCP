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
} from 'react-native';
import {
  Button,
  Icon,
  Screen,
  TextField,
  TextFieldAccessoryProps,
  AutoImage,
  Text,
} from '../components';
import { TxKeyPath } from '../i18n';
import { useStores } from '../models';
import { AppStackParamList, AppStackScreenProps } from '../navigators';
import { colors, spacing } from '../theme';
import { Feather } from '@expo/vector-icons';
import { Chase } from 'react-native-animated-spinkit';
import { isEmailValid } from '../utils/isEmailValid';

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
    const {
      authenticationStore: { signUp },
    } = useStores();

    useEffect(() => {
      setEmail('user@email.com');
      setPassword('ThisIsStrong1!');
      setRepeatedPassword('ThisIsStrong1!');
    }, []);

    function emailValidationError(): TxKeyPath {
      if (!hasEmailBeenTouched && !hasTriedSubmitting) return undefined;
      if (email.length === 0) return 'common.fieldRequired';
      if (!isEmailValid(email)) return 'SignUpScreen.emailFieldInvalid';
      return undefined;
    }

    function passwordValidationError(): TxKeyPath {
      if (!hasPasswordBeenTouched && !hasTriedSubmitting) return undefined;
      if (password.length === 0) return 'common.fieldRequired';
      return undefined;
    }

    function repeatedPasswordValidationError(): TxKeyPath {
      if (!hasRepeatedPasswordBeenTouched && !hasTriedSubmitting)
        return undefined;
      if (repeatedPassword.length === 0) return 'common.fieldRequired';
      if (repeatedPassword !== password) return 'SignUpScreen.notSamePassword';
      return undefined;
    }

    async function trySignUp() {
      setHasTriedSubmitting(true);
      if (
        emailValidationError() ||
        passwordValidationError() ||
        repeatedPasswordValidationError() ||
        isLoading
      )
        return;
      setIsLoading(true);
      console.log(await signUp(email, password));
      setIsLoading(false);
      setHasSubmitted(true);
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
        <AutoImage
          maxHeight={100}
          style={$image}
          source={{
            uri: 'https://user-images.githubusercontent.com/1775841/184508739-f90d0ce5-7219-42fd-a91f-3382d016eae0.png',
          }}
        />

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
          helperTx={emailValidationError()}
          status={emailValidationError() ? 'error' : undefined}
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
          helperTx={passwordValidationError()}
          status={passwordValidationError() ? 'error' : undefined}
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
          helperTx={repeatedPasswordValidationError()}
          status={repeatedPasswordValidationError() ? 'error' : undefined}
          onSubmitEditing={trySignUp}
          RightAccessory={PasswordRightAccessory}
        />

        {hasSubmitted ? (
          <View style={$accountCreatedView}>
            <Feather name="check-circle" size={24} color={colors.success} />
            <Text
              tx="SignUpScreen.accountCreated"
              preset="bold"
              style={$accountCreatedText}
            />
          </View>
        ) : (
          <Button
            tx={isLoading ? undefined : 'SignUpScreen.signUp'}
            style={$signUpButton}
            preset={'filled'}
            onPress={trySignUp}
          >
            {isLoading && <Chase size={22} color={colors.filledText}></Chase>}
          </Button>
        )}

        <Text
          tx="SignUpScreen.signIn"
          preset="hint"
          style={$signInText}
          onPress={() => navigation.navigate('SignIn')}
        />
      </Screen>
    );
  },
);

const $image: ImageStyle = {
  marginVertical: spacing.huge,
  alignSelf: 'center',
};

const $screenContentContainer: ViewStyle = {
  padding: spacing.huge,
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
  marginTop: spacing.extraLarge,
  marginBottom: spacing.small,
};

const $accountCreatedText: TextStyle = {
  color: colors.success,
  marginLeft: spacing.small,
};

const $signInText: TextStyle = {
  marginTop: spacing.small,
  textAlign: 'center',
  color: colors.primary,
};
