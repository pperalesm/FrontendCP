import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, ViewStyle, Image, ImageStyle, View } from 'react-native';
import { Card, EmptyState, Screen, Text } from '../components';
import { useStores } from '../models';
import { Notebook } from '../models/Notebook';
import { spacing } from '../theme';
import {
  NotebooksParamList,
  NotebooksScreenProps,
} from '../navigators/NotebooksNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NotebooksScreenNavigationProp = NativeStackNavigationProp<
  NotebooksParamList,
  'Notebooks'
>;

export const NotebooksScreen: FC<NotebooksScreenProps<'Notebooks'>> = observer(
  function NotebooksScreen(_props) {
    const rootStore = useStores();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      reload();
    }, [rootStore.notebooksStore]);

    async function reload() {
      setIsLoading(true);
      await rootStore.notebooksStore.readAllNotebooks();
      setIsLoading(false);
    }

    return (
      <Screen preset="fixed" safeAreaEdges={['top']}>
        <FlatList<Notebook>
          data={rootStore.notebooksStore.notebooks}
          ListHeaderComponent={
            <Text preset="heading" tx="NotebooksScreen.title" />
          }
          ListHeaderComponentStyle={$heading}
          contentContainerStyle={$flatListContentContainer}
          progressViewOffset={spacing.massive * 2}
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
          renderItem={({ item }) => (
            <NotebookCard key={item.id} notebook={item} />
          )}
        />
      </Screen>
    );
  },
);

const NotebookCard = observer(function NotebookCard({
  notebook,
}: {
  notebook: Notebook;
}) {
  const rootStore = useStores();
  const navigation = useNavigation<NotebooksScreenNavigationProp>();

  async function handlePressCard() {
    rootStore.notebooksStore.select(notebook);
    navigation.navigate('Entries');
  }

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      heading={notebook.name}
      content={notebook.description}
      ContentTextProps={{ numberOfLines: 3 }}
      LeftComponent={
        <Image style={$image} source={{ uri: notebook.imageUrl }} />
      }
    />
  );
});

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.medium,
};

const $heading: ViewStyle = {
  marginVertical: spacing.extraLarge,
};

const $item: ViewStyle = {
  marginBottom: spacing.medium,
  height: 115,
};

const $image: ImageStyle = { width: 75, height: 75 };

const $emptyList: ViewStyle = { marginTop: spacing.huge * 4 };
