import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { NotebooksStoreScreen } from '../screens/notebooks/NotebooksStoreScreen';
import { NotebookScreen } from '../screens/notebooks/NotebookScreen';

export type NotebooksParamList = {
  Notebooks: undefined;
  Entries: undefined;
};

export type NotebooksStoreScreenProps<T extends keyof NotebooksParamList> =
  StackScreenProps<NotebooksParamList, T>;

const Stack = createNativeStackNavigator<NotebooksParamList>();

export function NotebooksNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'Notebooks'}
    >
      <>
        <Stack.Screen name="Notebooks" component={NotebooksStoreScreen} />
        <Stack.Screen name="Entries" component={NotebookScreen} />
      </>
    </Stack.Navigator>
  );
}
