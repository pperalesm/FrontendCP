import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { NotebooksStoreScreen } from '../screens/notebooks/NotebooksStoreScreen';
import { NotebookScreen } from '../screens/notebooks/NotebookScreen';

export type NotebooksStoreParamList = {
  NotebooksStore: undefined;
  Notebook: undefined;
};

export type NotebooksStoreScreenProps<T extends keyof NotebooksStoreParamList> =
  StackScreenProps<NotebooksStoreParamList, T>;

const Stack = createNativeStackNavigator<NotebooksStoreParamList>();

export function NotebooksNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'NotebooksStore'}
    >
      <>
        <Stack.Screen name="NotebooksStore" component={NotebooksStoreScreen} />
        <Stack.Screen name="Notebook" component={NotebookScreen} />
      </>
    </Stack.Navigator>
  );
}
