import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { NotebooksScreen } from '../screens/NotebooksScreen';
import { EntriesScreen } from '../screens/EntriesScreen';

export type NotebooksParamList = {
  Notebooks: undefined;
  Entries: undefined;
};

export type NotebooksScreenProps<T extends keyof NotebooksParamList> =
  StackScreenProps<NotebooksParamList, T>;

const Stack = createNativeStackNavigator<NotebooksParamList>();

export function NotebooksNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'Notebooks'}
    >
      <>
        <Stack.Screen name="Notebooks" component={NotebooksScreen} />
        <Stack.Screen name="Entries" component={EntriesScreen} />
      </>
    </Stack.Navigator>
  );
}
