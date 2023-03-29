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
  ActivationScreen,
  ActivatedScreen,
} from '../screens';
import { MainNavigator, MainTabParamList } from './MainNavigator';
import { navigationRef, useBackButtonHandler } from './navigationUtilities';

export type AppStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Activation: undefined;
  Activated: undefined;
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
      initialRouteName={user ? (user.active ? 'Main' : 'Activation') : 'SignIn'}
    >
      {!user ? (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Activated" component={ActivatedScreen} />
        </>
      ) : !user.active ? (
        <>
          <Stack.Screen name="Activation" component={ActivationScreen} />
          <Stack.Screen name="Activated" component={ActivatedScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
        </>
      )}
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
