import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Card, EmptyState, Icon, Screen, Text } from '../components';
import { useStores } from '../models';
import { Notebook } from '../models/Notebook';
import { spacing } from '../theme';
import {
  NotebooksParamList,
  NotebooksScreenProps,
} from '../navigators/NotebooksNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const rnrImage1 = require('../../assets/images/rnr-image-1.png');
const rnrImage2 = require('../../assets/images/rnr-image-2.png');
const rnrImage3 = require('../../assets/images/rnr-image-3.png');
const rnrImages = [rnrImage1, rnrImage2, rnrImage3];

type NotebooksScreenNavigationProp = NativeStackNavigationProp<
  NotebooksParamList,
  'Notebooks'
>;

export const NotebooksScreen: FC<NotebooksScreenProps<'Notebooks'>> = observer(
  function NotebooksScreen(_props) {
    const rootStore = useStores();

    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
      (async function load() {
        setIsLoading(true);
        await rootStore.notebooksStore.readAllNotebooks();
        setIsLoading(false);
      })();
    }, [rootStore.notebooksStore]);

    async function manualRefresh() {
      setRefreshing(true);
      await rootStore.notebooksStore.readAllNotebooks();
      setRefreshing(false);
    }

    return (
      <Screen
        preset="fixed"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={['top']}
      >
        <View style={$heading}>
          <Text preset="heading" tx="demoPodcastListScreen.title" />
        </View>
        <FlatList<Notebook>
          data={rootStore.notebooksStore.notebooks}
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
                buttonTx={'demoPodcastListScreen.noFavoritesEmptyState.content'}
                buttonOnPress={manualRefresh}
                ImageProps={{ resizeMode: 'contain' }}
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
  const navigation = useNavigation<NotebooksScreenNavigationProp>();

  const imageUri = useMemo(() => {
    return rnrImages[Math.floor(Math.random() * rnrImages.length)];
  }, []);

  const handlePressCard = () => {
    navigation.navigate('Entries', { notebookId: notebook.id });
  };

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      heading={notebook.name}
      content={'Esto es un contenido de prueba'}
      LeftComponent={<Image source={imageUri} style={$itemImage} />}
      RightComponent={<Icon icon="caretRight" size={40} />}
    />
  );
});

const $screenContentContainer: ViewStyle = {
  padding: spacing.large,
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.tiny,
  paddingBottom: spacing.large,
};

const $heading: ViewStyle = {
  marginVertical: spacing.huge,
};

const $item: ViewStyle = {
  marginTop: spacing.medium,
};

const $itemImage: ImageStyle = {
  borderRadius: 50,
};

const $emptyState: ViewStyle = {
  marginTop: spacing.huge,
};
