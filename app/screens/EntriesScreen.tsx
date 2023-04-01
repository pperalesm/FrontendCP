import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageStyle,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  Screen,
  Text,
  Toggle,
} from '../components';
import { translate } from '../i18n';
import { useStores } from '../models';
import { colors, spacing } from '../theme';
import { delay } from '../utils/delay';
import {
  NotebooksParamList,
  NotebooksScreenProps,
} from '../navigators/NotebooksNavigator';
import { Entry } from '../models/Entry';
import { RouteProp, useRoute } from '@react-navigation/native';

const ICON_SIZE = 14;

const rnrImage1 = require('../../assets/images/rnr-image-1.png');
const rnrImage2 = require('../../assets/images/rnr-image-2.png');
const rnrImage3 = require('../../assets/images/rnr-image-3.png');
const rnrImages = [rnrImage1, rnrImage2, rnrImage3];

export const EntriesScreen: FC<NotebooksScreenProps<'Entries'>> = observer(
  function EntriesScreen(_props) {
    const route = useRoute<RouteProp<NotebooksParamList, 'Entries'>>();
    const rootStore = useStores();
    const notebookId = route.params.notebookId;

    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // initially, kick off a background refresh without the refreshing UI
    useEffect(() => {
      (async function load() {
        setIsLoading(true);
        await rootStore.entriesStore.readManyEntriesPaginated(notebookId);
        setIsLoading(false);
      })();
    }, [rootStore.entriesStore]);

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true);
      await Promise.all([
        rootStore.entriesStore.readManyEntriesPaginated(notebookId),
        delay(750),
      ]);
      setRefreshing(false);
    }

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={['top']}
        contentContainerStyle={$screenContentContainer}
      >
        <FlatList<Entry>
          data={
            showFavoritesOnly
              ? rootStore.entriesStore.favorites
              : rootStore.entriesStore.entries
          }
          extraData={
            rootStore.entriesStore.favorites.length +
            rootStore.entriesStore.entries.length
          }
          contentContainerStyle={$flatListContentContainer}
          refreshing={refreshing}
          onRefresh={manualRefresh}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyState
                preset="generic"
                style={$emptyState}
                headingTx={
                  showFavoritesOnly
                    ? 'demoPodcastListScreen.noFavoritesEmptyState.heading'
                    : undefined
                }
                contentTx={
                  showFavoritesOnly
                    ? 'demoPodcastListScreen.noFavoritesEmptyState.content'
                    : undefined
                }
                button={showFavoritesOnly ? null : undefined}
                buttonOnPress={manualRefresh}
                ImageProps={{ resizeMode: 'contain' }}
              />
            )
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="demoPodcastListScreen.title" />
              {(showFavoritesOnly ||
                rootStore.entriesStore.entries.length > 0) && (
                <View style={$toggle}>
                  <Toggle
                    value={showFavoritesOnly}
                    onValueChange={() =>
                      setShowFavoritesOnly(!showFavoritesOnly)
                    }
                    variant="switch"
                    labelTx="demoPodcastListScreen.onlyFavorites"
                    labelPosition="left"
                    labelStyle={$labelStyle}
                    accessibilityLabel={translate(
                      'demoPodcastListScreen.accessibility.switch',
                    )}
                  />
                </View>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <EntryCard
              key={item.id}
              entry={item}
              onPressFavorite={() =>
                rootStore.entriesStore.toggleFavorite(item)
              }
            />
          )}
        />
      </Screen>
    );
  },
);

const EntryCard = observer(function EpisodeCard({
  entry,
  onPressFavorite,
}: {
  entry: Entry;
  onPressFavorite: () => void;
}) {
  const liked = useSharedValue(entry.isFavorite ? 1 : 0);

  const imageUri = useMemo(() => {
    return rnrImages[Math.floor(Math.random() * rnrImages.length)];
  }, []);

  // Grey heart
  const animatedLikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.EXTEND),
        },
      ],
      opacity: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
    };
  });

  // Pink heart
  const animatedUnlikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
      opacity: liked.value,
    };
  });

  const handlePressFavorite = () => {
    onPressFavorite();
    liked.value = withSpring(liked.value ? 0 : 1);
  };

  const ButtonLeftAccessory = useMemo(
    () =>
      function ButtonLeftAccessory() {
        return (
          <View>
            <Animated.View
              style={[
                $iconContainer,
                StyleSheet.absoluteFill,
                animatedLikeButtonStyles,
              ]}
            >
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.primaryDark} // dark grey
              />
            </Animated.View>
            <Animated.View style={[$iconContainer, animatedUnlikeButtonStyles]}>
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.primary} // pink
              />
            </Animated.View>
          </View>
        );
      },
    [],
  );

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onLongPress={handlePressFavorite}
      HeadingComponent={
        <View style={$metadata}>
          <Text
            style={$metadataText}
            size="xxs"
            accessibilityLabel={entry.createdAt.toISOString()}
          >
            {entry.createdAt.toISOString()}
          </Text>
        </View>
      }
      content={`${entry.text}`}
      RightComponent={<Image source={imageUri} style={$itemThumbnail} />}
      FooterComponent={
        <Button
          onPress={handlePressFavorite}
          onLongPress={handlePressFavorite}
          style={[$favoriteButton, entry.isFavorite && $unFavoriteButton]}
          accessibilityLabel={
            entry.isFavorite
              ? translate('demoPodcastListScreen.accessibility.unfavoriteIcon')
              : translate('demoPodcastListScreen.accessibility.favoriteIcon')
          }
          LeftAccessory={ButtonLeftAccessory}
        >
          <Text
            size="xxs"
            weight="medium"
            text={
              entry.isFavorite
                ? translate('demoPodcastListScreen.unfavoriteButton')
                : translate('demoPodcastListScreen.favoriteButton')
            }
          />
        </Button>
      }
    />
  );
});

const $screenContentContainer: ViewStyle = {
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.large,
};

const $heading: ViewStyle = {
  marginBottom: spacing.medium,
};

const $item: ViewStyle = {
  padding: spacing.medium,
  marginTop: spacing.medium,
  minHeight: 120,
};

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.small,
  borderRadius: 50,
  alignSelf: 'flex-start',
};

const $toggle: ViewStyle = {
  marginTop: spacing.medium,
};

const $labelStyle: TextStyle = {
  textAlign: 'left',
};

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: 'row',
  marginEnd: spacing.small,
};

const $metadata: TextStyle = {
  color: colors.secondaryText,
  marginTop: spacing.extraSmall,
  flexDirection: 'row',
};

const $metadataText: TextStyle = {
  color: colors.secondaryText,
  marginEnd: spacing.medium,
  marginBottom: spacing.extraSmall,
};

const $favoriteButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.medium,
  justifyContent: 'flex-start',
  backgroundColor: colors.secondarySurface,
  borderColor: colors.border,
  paddingHorizontal: spacing.medium,
  paddingTop: spacing.micro,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: 'flex-start',
};

const $unFavoriteButton: ViewStyle = {
  borderColor: colors.border,
  backgroundColor: colors.secondarySurface,
};

const $emptyState: ViewStyle = {
  marginTop: spacing.huge,
};
