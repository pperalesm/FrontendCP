import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { TextField } from '../../components/TextField';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useStores } from '../../models/helpers/useStores';
import { Entry } from '../../models/Entry';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const EntryItem = observer(function EntryItem({
  entry,
}: {
  entry: Entry;
}) {
  const {
    notebooksStore: { selectedNotebook },
  } = useStores();

  const textFieldRef = useRef<TextInput>();

  return (
    <View style={$item}>
      <View style={$itemHeader}>
        <View style={$itemHeaderSection}>
          <Text
            preset="hint"
            text={entry.createdAt.toLocaleString()}
            style={$dateText}
          />
        </View>
        <View style={$itemHeaderSection}>
          <Button
            onPress={() => {
              selectedNotebook.handlePressFavorite(entry);
            }}
            fitToContent
            style={$topButton}
            isLoading={entry.isFavoriteLoading}
            spinnerColor={colors.secondary}
          >
            <MaterialCommunityIcons
              name={entry.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={colors.secondary}
            />
          </Button>
          <Button
            onPress={() => {
              selectedNotebook.handlePressEdit(entry);
              setTimeout(() => textFieldRef.current?.focus(), 1);
            }}
            fitToContent
            style={$topButton}
            disabled={!!selectedNotebook.selectedEntry}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={
                selectedNotebook.selectedEntry
                  ? colors.disabled
                  : colors.primary
              }
            />
          </Button>
        </View>
      </View>
      <TextField
        multiline
        ref={textFieldRef}
        autoFocus
        maxLength={280}
        scrollEnabled={false}
        value={entry.text}
        onChangeText={entry.setText}
        status={
          selectedNotebook.isEntryEditable(entry) ? undefined : 'disabled'
        }
        inputWrapperStyle={
          selectedNotebook.isEntryEditable(entry)
            ? undefined
            : $disabledTextField
        }
      />
      {selectedNotebook.isEntryEditable(entry) && (
        <View style={$itemFooter}>
          {!entry.isBeingCreated && (
            <Button
              onPress={() => {
                selectedNotebook.handlePressDelete(entry);
              }}
              fitToContent
              style={$deleteButton}
              isLoading={entry.isDeleteLoading}
              spinnerColor={colors.error}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={16}
                color={colors.error}
              />
            </Button>
          )}
          <Button
            onPress={() => {
              selectedNotebook.handlePressCancel(entry);
            }}
            fitToContent
            style={$baseButton}
          >
            <MaterialCommunityIcons name="close" size={16} />
          </Button>
          <Button
            onPress={() => {
              selectedNotebook.handlePressDone(entry);
            }}
            fitToContent
            style={$successButton}
            isLoading={entry.isDoneLoading}
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

const $item: ViewStyle = {
  paddingHorizontal: spacing.medium,
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

const $dateText: TextStyle = { color: colors.secondaryText };

const $itemFooter: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  marginTop: spacing.tiny,
};

const $disabledTextField: ViewStyle = {
  backgroundColor: colors.transparent,
  borderColor: colors.transparent,
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

const $topButton: ViewStyle = {
  ...$baseButton,
  borderWidth: 0,
  backgroundColor: colors.transparent,
  elevation: 0,
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
