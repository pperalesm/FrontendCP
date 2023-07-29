import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { PlansScreen } from '../screens/plans/PlansScreen';
import { RoutinesScreen } from '../screens/plans/RoutinesScreen';

export type PlansParamList = {
  Plans: undefined;
  Routines: undefined;
};

export type PlansScreenProps<T extends keyof PlansParamList> = StackScreenProps<
  PlansParamList,
  T
>;

const Stack = createNativeStackNavigator<PlansParamList>();

export function PlansNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'Plans'}
    >
      <>
        <Stack.Screen name="Plans" component={PlansScreen} />
        <Stack.Screen name="Routines" component={RoutinesScreen} />
      </>
    </Stack.Navigator>
  );
}
