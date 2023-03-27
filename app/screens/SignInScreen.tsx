import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ImageStyle, TextInput, TextStyle, ViewStyle } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import {
  Button,
  Icon,
  Screen,
  TextField,
  TextFieldAccessoryProps,
  Text,
  ListItem,
  AutoImage,
} from '../components';
import { TxKeyPath } from '../i18n';
import { useStores } from '../models';
import { AppStackParamList, AppStackScreenProps } from '../navigators';
import { colors, spacing } from '../theme';
import { isEmailValid } from '../utils/isEmailValid';

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
    const [isLoading, setIsLoading] = useState(false);
    const [ispasswordHidden, setIspasswordHidden] = useState(true);
    const {
      authenticationStore: { signIn },
    } = useStores();

    useEffect(() => {
      setEmail('user@email.com');
      setPassword('ThisIsStrong1!');
    }, []);

    function emailValidationError(): TxKeyPath {
      if (!hasEmailBeenTouched && !hasTriedSubmitting) return undefined;
      if (email.length === 0) return 'common.fieldRequired';
      if (!isEmailValid(email)) return 'SignInScreen.emailFieldInvalid';
      return undefined;
    }

    function passwordValidationError(): TxKeyPath {
      if (!hasPasswordBeenTouched && !hasTriedSubmitting) return undefined;
      if (password.length === 0) return 'common.fieldRequired';
      return undefined;
    }

    async function trySignIn() {
      setHasTriedSubmitting(true);
      if (emailValidationError() || passwordValidationError() || isLoading)
        return;
      setIsLoading(true);
      await signIn(email, password);
      setIsLoading(false);
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
          labelTx="SignInScreen.emailFieldLabel"
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
          labelTx="SignInScreen.passwordFieldLabel"
          helperTx={passwordValidationError()}
          status={passwordValidationError() ? 'error' : undefined}
          onSubmitEditing={trySignIn}
          RightAccessory={PasswordRightAccessory}
        />

        <Button
          tx={isLoading ? undefined : 'SignInScreen.signIn'}
          style={$signInButton}
          onPress={trySignIn}
        >
          {isLoading && <Chase size={22} color={colors.primaryDark}></Chase>}
        </Button>

        <Text
          tx="SignInScreen.forgotPassword"
          preset="hint"
          style={$forgotPasswordText}
        />

        <ListItem
          topSeparator
          containerStyle={$listItemContainer}
          textStyle={$listItemText}
        >
          <Button
            tx="SignInScreen.signUp"
            style={$signUpButton}
            preset={'filled'}
            onPress={() => navigation.navigate('SignUp')}
          />
        </ListItem>
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

const $signInButton: ViewStyle = {
  marginTop: spacing.medium,
};

const $forgotPasswordText: TextStyle = {
  marginTop: spacing.small,
  textAlign: 'center',
  color: colors.primary,
};

const $signUpButton: ViewStyle = {
  paddingHorizontal: spacing.huge,
};

const $listItemContainer: ViewStyle = {
  marginTop: spacing.extraLarge,
  paddingTop: spacing.huge,
};

const $listItemText: TextStyle = { textAlign: 'center' };
