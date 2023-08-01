import { observer } from 'mobx-react-lite';
import React from 'react';
import { ViewStyle, Image, ImageStyle } from 'react-native';
import { Card } from '../../components/Card';
import { spacing } from '../../theme/spacing';
import { useStores } from '../../models/helpers/useStores';
import { Notebook } from '../../models/Notebook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NotebooksStoreParamList } from '../../navigators/NotebooksNavigator';

type NotebooksStoreScreenNavigationProp = NativeStackNavigationProp<
  NotebooksStoreParamList,
  'NotebooksStore'
>;

export const NotebookItem = observer(function NotebookItem({
  notebook,
}: {
  notebook: Notebook;
}) {
  const { notebooksStore } = useStores();

  const navigation = useNavigation<NotebooksStoreScreenNavigationProp>();

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={() => {
        notebooksStore.handlePressCard(notebook);
        navigation.navigate('Notebook');
      }}
      heading={notebook.name}
      content={notebook.description}
      ContentTextProps={{ numberOfLines: 3 }}
      LeftComponent={
        <Image style={$image} source={{ uri: notebook.imageUrl }} />
      }
    />
  );
});

const $item: ViewStyle = {
  marginBottom: spacing.medium,
  minHeight: 115,
};

const $image: ImageStyle = { width: 75, height: 75 };
