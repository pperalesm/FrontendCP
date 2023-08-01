import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import React from 'react';
import { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppStackParamList, AppStackScreenProps } from './AppNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  NotebooksNavigator,
  NotebooksStoreParamList,
} from './NotebooksNavigator';
import { colors } from '../theme/colors';
import { DemoShowroomScreen } from '../screens/DemoShowroomScreen/DemoShowroomScreen';
import { PlansNavigator, PlansStoreParamList } from './PlansNavigator';
import { HomeParamList } from './HomeNavigator';
import { HomeScreen } from '../screens/home/HomeScreen';

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeParamList>;
  PlansNavigator: NavigatorScreenParams<PlansStoreParamList>;
  NotebooksNavigator: NavigatorScreenParams<NotebooksStoreParamList>;
  DemoShowroom: { queryIndex?: string; itemIndex?: string };
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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={focused && colors.primary}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="PlansNavigator"
        component={PlansNavigator}
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
        name="NotebooksNavigator"
        component={NotebooksNavigator}
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
        name="DemoShowroom"
        component={DemoShowroomScreen}
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
