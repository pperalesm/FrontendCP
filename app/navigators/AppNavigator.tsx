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
import { useStores } from '../models';
import {
  SignInScreen,
  SignUpScreen,
  ActivateScreen,
  ActivatedScreen,
  PasswordResetScreen,
  ResetPasswordScreen,
} from '../screens';
import { MainNavigator, MainTabParamList } from './MainNavigator';
import { navigationRef, useBackButtonHandler } from './navigationUtilities';

export type AppStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Activate: undefined;
  Activated: undefined;
  ResetPassword: undefined;
  PasswordReset: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
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
      initialRouteName={user ? (user.active ? 'Main' : 'Activate') : 'SignIn'}
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
          <Stack.Screen name="Main" component={MainNavigator} />
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
