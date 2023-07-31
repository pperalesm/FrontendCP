import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { FlatList, ViewStyle, View } from 'react-native';
import { Text } from '../../components/Text';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { spacing } from '../../theme/spacing';
import { useStores } from '../../models/helpers/useStores';
import { Notebook } from '../../models/Notebook';
import { NotebooksStoreScreenProps } from '../../navigators/NotebooksNavigator';
import { NotebookItem } from './NotebookItem';

export const NotebooksStoreScreen: FC<NotebooksStoreScreenProps<'Notebooks'>> =
  observer(function NotebooksStoreScreen(_props) {
    const { notebooksStore } = useStores();

    useEffect(() => {
      notebooksStore.reloadNotebooks();
    }, []);

    return (
      <Screen preset="fixed" safeAreaEdges={['top']}>
        <FlatList<Notebook>
          data={notebooksStore.notebooks}
          ListHeaderComponent={
            <Text preset="heading" tx="NotebooksStoreScreen.title" />
          }
          ListHeaderComponentStyle={$heading}
          contentContainerStyle={$flatListContentContainer}
          progressViewOffset={spacing.massive * 2}
          refreshing={notebooksStore.areNotebooksLoading}
          onRefresh={notebooksStore.reloadNotebooks}
          ListEmptyComponent={
            notebooksStore.areNotebooksLoading ? (
              <View style={$emptyList} />
            ) : (
              <EmptyState
                style={$emptyList}
                preset="generic"
                buttonOnPress={notebooksStore.reloadNotebooks}
              />
            )
          }
          renderItem={({ item }) => (
            <NotebookItem key={item.id} notebook={item} />
          )}
        />
      </Screen>
    );
  });

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.medium,
};

const $heading: ViewStyle = {
  marginVertical: spacing.extraLarge,
};

const $emptyList: ViewStyle = { marginTop: spacing.huge * 4 };
