import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components';
import {
  DemoCommunityScreen,
  DemoShowroomScreen,
  DemoDebugScreen,
} from '../screens';
import { DemoPodcastListScreen } from '../screens/DemoPodcastListScreen';
import { colors, spacing, typography } from '../theme';
import { AppStackParamList, AppStackScreenProps } from './AppNavigator';

export type MainTabParamList = {
  DemoCommunity: undefined;
  DemoShowroom: { queryIndex?: string; itemIndex?: string };
  DemoDebug: undefined;
  DemoPodcastList: undefined;
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
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
        tabBarIconStyle: $tabBarIcon,
      }}
    >
      <Tab.Screen
        name="DemoShowroom"
        component={DemoShowroomScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="components"
              color={focused && colors.primary}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="DemoCommunity"
        component={DemoCommunityScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="components"
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
            <Icon
              icon="components"
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
            <Icon
              icon="components"
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

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.medium,
};

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
};

const $tabBarIcon: ViewStyle = {
  paddingBottom: spacing.medium,
};
