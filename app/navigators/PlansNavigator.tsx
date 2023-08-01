import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { PlansStoreScreen } from '../screens/plans/PlansStoreScreen';
import { PlanScreen } from '../screens/plans/PlanScreen';

export type PlansStoreParamList = {
  PlansStore: undefined;
  Plan: undefined;
};

export type PlansStoreScreenProps<T extends keyof PlansStoreParamList> =
  StackScreenProps<PlansStoreParamList, T>;

const Stack = createNativeStackNavigator<PlansStoreParamList>();

export function PlansNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'PlansStore'}
    >
      <>
        <Stack.Screen name="PlansStore" component={PlansStoreScreen} />
        <Stack.Screen name="Plan" component={PlanScreen} />
      </>
    </Stack.Navigator>
  );
}
