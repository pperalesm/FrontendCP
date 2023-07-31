import React, { FC, useRef, useState } from 'react';
import { FlatList, View, ViewStyle, Image, ImageStyle } from 'react-native';
import { DrawerLayout, DrawerState } from 'react-native-gesture-handler';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Screen } from '../../components/Screen';
import { Text } from '../../components/Text';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { timing } from '../../theme/timing';
import { useSafeAreaInsetsStyle } from '../../utils/useSafeAreaInsetsStyle';
import { DrawerIconButton } from '../home/DrawerIconButton';
import { HomeScreenProps } from '../../navigators/HomeNavigator';
import { observer } from 'mobx-react-lite';
import { TxKeyPath } from '../../i18n/i18n';
import { useStores } from '../../models/helpers/useStores';
import { ListItem } from '../../components/ListItem';
import { DailyRecordView } from '../data/DailyRecordView';

const logo = require('../../../assets/images/logo.png');

export const HomeScreen: FC<HomeScreenProps<'Home'>> = observer(
  function HomeScreen(_props) {
    const {
      authenticationStore: { signOut },
    } = useStores();
    const [open, setOpen] = useState(false);
    const drawerRef = useRef<DrawerLayout>();
    const progress = useSharedValue(0);
    const menuRef = useRef<FlatList>();

    const drawerOptions: { name: TxKeyPath; action: () => void }[] = [
      { name: 'common.signOut', action: signOut },
      { name: 'common.ok', action: () => {} },
      { name: 'common.back', action: () => {} },
      { name: 'common.fieldRequired', action: () => {} },
    ];

    async function toggleDrawer() {
      if (!open) {
        setOpen(true);
        drawerRef.current?.openDrawer({ speed: 2 });
      } else {
        setOpen(false);
        drawerRef.current?.closeDrawer({ speed: 2 });
      }
    }

    const $drawerInsets = useSafeAreaInsetsStyle(['top']);

    return (
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={300}
        drawerType={'slide'}
        drawerPosition={'left'}
        overlayColor={open ? colors.overlay : 'transparent'}
        drawerBackgroundColor={colors.primarySurface}
        onDrawerSlide={(drawerProgress) => {
          progress.value = open ? 1 - drawerProgress : drawerProgress;
        }}
        onDrawerStateChanged={(
          newState: DrawerState,
          drawerWillShow: boolean,
        ) => {
          if (newState === 'Settling') {
            progress.value = withTiming(drawerWillShow ? 1 : 0, {
              duration: timing.quick,
            });
            setOpen(drawerWillShow);
          }
        }}
        renderNavigationView={() => (
          <View style={[$drawer, $drawerInsets]}>
            <View style={$logoContainer}>
              <Image source={logo} style={$logoImage} />
            </View>
            <FlatList<{ name: TxKeyPath; action: () => void }>
              ref={menuRef}
              contentContainerStyle={$flatListContentContainer}
              data={drawerOptions}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <ListItem topSeparator>
                  <Text tx={item.name} onPress={item.action} preset="bold" />
                </ListItem>
              )}
            />
          </View>
        )}
      >
        <Screen
          preset="fixed"
          safeAreaEdges={['top']}
          contentContainerStyle={$screenContainer}
        >
          <DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} />
          <DailyRecordView />
        </Screen>
      </DrawerLayout>
    );
  },
);

const $screenContainer: ViewStyle = {
  flex: 1,
};

const $drawer: ViewStyle = {
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
};

const $logoImage: ImageStyle = {
  height: 42,
  width: 77,
};

const $logoContainer: ViewStyle = {
  height: 56,
  marginHorizontal: spacing.large,
  marginVertical: spacing.medium,
};
