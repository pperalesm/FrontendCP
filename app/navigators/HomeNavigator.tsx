import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { HomeScreen } from '../screens/home/HomeScreen';

export type HomeParamList = {
  Home: undefined;
};

export type HomeScreenProps<T extends keyof HomeParamList> = StackScreenProps<
  HomeParamList,
  T
>;

const Stack = createNativeStackNavigator<HomeParamList>();

export function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'Home'}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
