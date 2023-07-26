import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useColorScheme } from 'react-native';
import Config from '../config';
import { useStores } from '../models/helpers/useStores';
import { MainNavigator, MainTabParamList } from './MainNavigator';
import { navigationRef, useBackButtonHandler } from './navigationUtilities';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { ActivateScreen } from '../screens/auth/ActivateScreen';
import { ActivatedScreen } from '../screens/auth/ActivatedScreen';
import { PasswordResetScreen } from '../screens/auth/PasswordResetScreen';

export type AppStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Activate: undefined;
  Activated: undefined;
  ResetPassword: undefined;
  PasswordReset: undefined;
  MainNavigator: NavigatorScreenParams<MainTabParamList>;
};

const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  StackScreenProps<AppStackParamList, T>;

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { user },
  } = useStores();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={
        user ? (user.active ? 'MainNavigator' : 'Activate') : 'SignIn'
      }
    >
      {!user ? (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      ) : !user.active ? (
        <>
          <Stack.Screen name="Activate" component={ActivateScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainNavigator" component={MainNavigator} />
        </>
      )}
      <Stack.Screen name="Activated" component={ActivatedScreen} />
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
    </Stack.Navigator>
  );
});

interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps,
) {
  const colorScheme = useColorScheme();

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  );
});
