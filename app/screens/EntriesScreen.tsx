import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, TextStyle, View, ViewStyle } from 'react-native';
import {
  Button,
  EmptyState,
  Screen,
  Text,
  TextField,
  Toggle,
} from '../components';
import { useStores } from '../models';
import { colors, spacing } from '../theme';
import { NotebooksScreenProps } from '../navigators/NotebooksNavigator';
import { Entry } from '../models/Entry';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const EntriesScreen: FC<NotebooksScreenProps<'Entries'>> = observer(
  function EntriesScreen(_props) {
    const rootStore = useStores();

    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      reload();
    }, [rootStore.notebooksStore.selectedNotebook.entries]);

    async function reload() {
      setIsLoading(true);
      await rootStore.notebooksStore.selectedNotebook.readFirstEntries(
        rootStore.notebooksStore.selectedNotebook.id,
      );
      setIsLoading(false);
    }

    return (
      <Screen preset="fixed" safeAreaEdges={['top']}>
        <FlatList<Entry>
          keyboardShouldPersistTaps="handled"
          data={
            showFavoritesOnly
              ? rootStore.notebooksStore.selectedNotebook.favorites
              : rootStore.notebooksStore.selectedNotebook.entries
          }
          extraData={
            rootStore.notebooksStore.selectedNotebook.favorites.length +
            rootStore.notebooksStore.selectedNotebook.entries.length
          }
          ListHeaderComponent={
            <View>
              <Text
                preset="heading"
                text={rootStore.notebooksStore.selectedNotebook.name}
              />
              <View style={$toggle}>
                <Toggle
                  value={showFavoritesOnly}
                  onValueChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  variant="switch"
                  labelTx="demoPodcastListScreen.onlyFavorites"
                  labelPosition="left"
                  labelStyle={$toggleLabel}
                />
              </View>
            </View>
          }
          ListHeaderComponentStyle={$heading}
          contentContainerStyle={$flatListContentContainer}
          progressViewOffset={spacing.massive * 3}
          refreshing={isLoading}
          onRefresh={reload}
          ListEmptyComponent={
            isLoading ? (
              <View style={$emptyList} />
            ) : (
              <EmptyState
                style={$emptyList}
                preset="generic"
                buttonOnPress={reload}
              />
            )
          }
          renderItem={({ item }) => <EntryItem key={item.id} entry={item} />}
        />
      </Screen>
    );
  },
);

const EntryItem = observer(function EntryItem({ entry }: { entry: Entry }) {
  const rootStore = useStores();

  const [updatedText, setUpdatedText] = useState(entry.text);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDoneLoading, setIsDoneLoading] = useState(false);

  const isSelected = () =>
    entry.id === rootStore.notebooksStore.selectedNotebook.selectedEntry?.id;

  const handlePressFavorite = () => {
    setIsFavoriteLoading(true);
    rootStore.notebooksStore.selectedNotebook.updateOneEntry(entry.id, {
      isFavorite: !entry.isFavorite,
    });
    setIsFavoriteLoading(false);
  };

  const handlePressEdit = () => {
    if (!isSelected()) {
      rootStore.notebooksStore.selectedNotebook.select(entry);
    }
  };

  const handlePressDelete = () => {
    setIsDeleteLoading(true);
    setIsDeleteLoading(false);
  };

  const handlePressCancel = () => {
    setUpdatedText(entry.text);
    rootStore.notebooksStore.selectedNotebook.select();
  };

  const handlePressDone = () => {
    setIsDoneLoading(true);
    rootStore.notebooksStore.selectedNotebook.updateOneEntry(entry.id, {
      text: updatedText,
    });
    setIsDoneLoading(false);
    rootStore.notebooksStore.selectedNotebook.select();
  };

  return (
    <View style={$item}>
      <View style={$itemHeader}>
        <View style={$itemHeaderSection}>
          <Text preset="hint" text={entry.createdAt.toLocaleString()} />
        </View>
        <View style={$itemHeaderSection}>
          <Button
            onPress={handlePressFavorite}
            fitToContent
            style={$favoriteButton}
            isLoading={isFavoriteLoading}
            spinnerColor={colors.warning}
          >
            <MaterialCommunityIcons
              name={entry.isFavorite ? 'star' : 'star-outline'}
              size={16}
              color={colors.warning}
            />
          </Button>
          <Button onPress={handlePressEdit} fitToContent style={$baseButton}>
            <MaterialCommunityIcons name="pencil-outline" size={16} />
          </Button>
        </View>
      </View>
      <TextField
        multiline
        maxLength={280}
        scrollEnabled={false}
        textAlignVertical="top"
        onSubmitEditing={handlePressDone}
        value={isSelected() ? updatedText : entry.text}
        onChangeText={setUpdatedText}
        status={isSelected() ? undefined : 'disabled'}
      />
      {isSelected() && (
        <View style={$itemFooter}>
          <Button
            onPress={handlePressDelete}
            fitToContent
            style={$deleteButton}
            isLoading={isDeleteLoading}
            spinnerColor={colors.error}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={16}
              color={colors.error}
            />
          </Button>
          <Button onPress={handlePressCancel} fitToContent style={$baseButton}>
            <MaterialCommunityIcons name="close" size={16} />
          </Button>
          <Button
            onPress={handlePressDone}
            fitToContent
            style={$successButton}
            isLoading={isDoneLoading}
            spinnerColor={colors.success}
          >
            <MaterialCommunityIcons
              name="check"
              size={16}
              color={colors.success}
            />
          </Button>
        </View>
      )}
    </View>
  );
});

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.medium,
};

const $heading: ViewStyle = {
  marginVertical: spacing.extraLarge,
};

const $toggle: ViewStyle = {
  marginTop: spacing.extraLarge,
};

const $toggleLabel: TextStyle = {
  textAlign: 'right',
};

const $item: ViewStyle = {
  marginBottom: spacing.extraLarge,
};

const $itemHeader: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: spacing.tiny,
};

const $itemHeaderSection: ViewStyle = {
  flexDirection: 'row',
};

const $itemFooter: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  marginTop: spacing.tiny,
};

const $baseButton: ViewStyle = {
  marginLeft: spacing.tiny,
  borderRadius: 4,
  height: 28,
  width: 28,
  paddingHorizontal: 0,
  paddingVertical: 0,
  elevation: 1,
};

const $favoriteButton: ViewStyle = {
  ...$baseButton,
  borderColor: colors.warning,
};

const $deleteButton: ViewStyle = {
  ...$baseButton,
  borderColor: colors.error,
  marginRight: spacing.medium,
};

const $successButton: ViewStyle = {
  ...$baseButton,
  borderColor: colors.success,
};

const $emptyList: ViewStyle = { marginTop: spacing.huge * 3 };
