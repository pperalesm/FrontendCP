import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import React from 'react';
import { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DemoShowroomScreen,
  DemoDebugScreen,
  NotebooksScreen,
} from '../screens';
import { DemoPodcastListScreen } from '../screens/DemoPodcastListScreen';
import { colors } from '../theme';
import { AppStackParamList, AppStackScreenProps } from './AppNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type MainTabParamList = {
  DemoShowroom: { queryIndex?: string; itemIndex?: string };
  DemoPodcastList: undefined;
  Notebooks: undefined;
  DemoDebug: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >;

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: [$tabBar, { height: bottom + 60 }],
        tabBarActiveTintColor: colors.primaryText,
        tabBarInactiveTintColor: colors.primaryText,
      }}
    >
      <Tab.Screen
        name="DemoShowroom"
        component={DemoShowroomScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home"
              color={focused && colors.primary}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="DemoPodcastList"
        component={DemoPodcastListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="format-list-bulleted-square"
              color={focused && colors.primary}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Notebooks"
        component={NotebooksScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="notebook-edit-outline"
              color={focused && colors.primary}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="chart-line"
              color={focused && colors.primary}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.secondarySurface,
  borderTopColor: colors.transparent,
};
