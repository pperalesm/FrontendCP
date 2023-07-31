import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useStores } from '../../models/helpers/useStores';
import { NotebooksStoreScreenProps } from '../../navigators/NotebooksNavigator';
import { Entry } from '../../models/Entry';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { EntryItem } from './EntryItem';

export const NotebookScreen: FC<NotebooksStoreScreenProps<'Entries'>> =
  observer(function NotebookScreen(_props) {
    const {
      notebooksStore: { selectedNotebook },
    } = useStores();

    useEffect(() => {
      selectedNotebook.reloadEntries();
    }, []);

    const listRef = useRef<FlashList<Entry>>();

    const heart = useSharedValue(selectedNotebook.isFavoritesOnly ? 1 : 0);

    const animatedHeartButtonStyles = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(heart.value, [0, 1], [1, 0], Extrapolate.EXTEND),
          },
        ],
        opacity: interpolate(heart.value, [0, 1], [1, 0], Extrapolate.CLAMP),
      };
    });

    const animatedUnheartButtonStyles = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: heart.value,
          },
        ],
        opacity: heart.value,
      };
    });

    const ButtonHeartAccessory = useMemo(
      () =>
        function ButtonRightAccessory() {
          return (
            <View>
              <Animated.View
                style={[
                  $iconContainer,
                  StyleSheet.absoluteFill,
                  animatedHeartButtonStyles,
                ]}
              >
                <MaterialCommunityIcons
                  name={'heart-outline'}
                  size={20}
                  color={colors.secondary}
                />
              </Animated.View>
              <Animated.View
                style={[$iconContainer, animatedUnheartButtonStyles]}
              >
                <MaterialCommunityIcons
                  name={'heart'}
                  size={20}
                  color={colors.secondary}
                />
              </Animated.View>
            </View>
          );
        },
      [],
    );

    return (
      <>
        <Screen
          preset="fixed"
          safeAreaEdges={['top']}
          contentContainerStyle={$screenContentContainer}
        >
          <FlashList<Entry>
            ref={listRef}
            estimatedItemSize={100}
            keyboardShouldPersistTaps="always"
            data={[...selectedNotebook.entries]}
            ListHeaderComponent={
              <View>
                <Text preset="heading" text={selectedNotebook.name} />
                <Button
                  onPress={async () => {
                    const response = await selectedNotebook.reloadEntries(true);
                    if (response?.kind === 'ok') {
                      heart.value = withSpring(heart.value ? 0 : 1);
                    }
                  }}
                  isLoading={selectedNotebook.areEntriesLoading}
                  style={[
                    $unFavoriteButton,
                    selectedNotebook.isFavoritesOnly && $favoriteButton,
                  ]}
                  RightAccessory={ButtonHeartAccessory}
                >
                  <Text preset="hint" tx={'NotebookScreen.favorites'} />
                </Button>
              </View>
            }
            ListHeaderComponentStyle={$heading}
            contentContainerStyle={$flatListContentContainer}
            progressViewOffset={spacing.massive * 3}
            refreshing={selectedNotebook.areEntriesLoading}
            onRefresh={selectedNotebook.reloadEntries}
            onEndReached={selectedNotebook.loadMoreEntries}
            ListEmptyComponent={
              selectedNotebook.areEntriesLoading ? (
                <View style={$emptyList} />
              ) : (
                <EmptyState
                  style={$emptyList}
                  preset="generic"
                  buttonOnPress={() => {
                    selectedNotebook.reloadEntries();
                  }}
                />
              )
            }
            renderItem={({ item }) => <EntryItem key={item.id} entry={item} />}
          />
        </Screen>
        {selectedNotebook.selectedEntry?.id === undefined && (
          <Button
            preset="filled"
            onPress={() => {
              selectedNotebook.handlePressAdd();
              listRef.current?.scrollToIndex({ index: 0, viewPosition: 1 });
            }}
            fitToContent
            style={$addButton}
          >
            <MaterialCommunityIcons name="plus" size={20} />
          </Button>
        )}
      </>
    );
  });

const $screenContentContainer: ViewStyle = {
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  paddingBottom: spacing.massive,
};

const $heading: ViewStyle = {
  marginVertical: spacing.extraLarge,
};

const $iconContainer: ViewStyle = {
  height: 20,
  width: 20,
  flexDirection: 'row',
  marginStart: spacing.small,
};

const $unFavoriteButton: ViewStyle = {
  borderRadius: 16,
  marginTop: spacing.large,
  marginRight: spacing.large,
  paddingHorizontal: spacing.medium,
  paddingVertical: spacing.tiny,
  borderColor: colors.transparent,
  alignSelf: 'flex-end',
  elevation: 2,
};

const $favoriteButton: ViewStyle = {
  backgroundColor: colors.secondaryLight,
};

const $addButton: ViewStyle = {
  position: 'absolute',
  bottom: 25,
  right: 25,
  borderRadius: 50,
  height: 60,
  width: 60,
  paddingHorizontal: 0,
  paddingVertical: 0,
};

const $emptyList: ViewStyle = { marginTop: spacing.huge * 3 };
