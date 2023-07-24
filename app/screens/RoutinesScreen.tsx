import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useStores } from '../models/helpers/useStores';
import { Routine } from '../models/Routine';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PlansScreenProps } from '../navigators/PlansNavigator';

export const RoutinesScreen: FC<PlansScreenProps<'Routines'>> = observer(
  function RoutinesScreen(_props) {
    const {
      plansStore: {
        selectedPlan: {
          name,
          readFirstRoutines,
          readMoreRoutines,
          prepareRoutineToAdd,
          isRoutineToAddSelected,
          favorites,
          routines,
          selectedRoutine,
          select,
          routineToAdd,
        },
      },
    } = useStores();

    const listRef = useRef<FlashList<Routine>>();

    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      select();
      reload();
    }, []);

    async function reload() {
      setIsLoading(true);
      await readFirstRoutines();
      setIsLoading(false);
    }

    async function loadMoreRoutines() {
      if (!isLoading) {
        setIsLoading(true);
        await readMoreRoutines();
        setIsLoading(false);
      }
    }

    function handlePressAdd() {
      prepareRoutineToAdd();
      listRef.current?.scrollToIndex({ index: 0, viewPosition: 1 });
    }

    const heart = useSharedValue(showFavoritesOnly ? 1 : 0);

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
          <FlashList<Routine>
            ref={listRef}
            estimatedItemSize={100}
            keyboardShouldPersistTaps="always"
            data={(isRoutineToAddSelected ? [routineToAdd] : []).concat(
              showFavoritesOnly ? favorites : routines,
            )}
            ListHeaderComponent={
              <View>
                <Text preset="heading" text={name} />
                <Button
                  onPress={() => {
                    setShowFavoritesOnly(!showFavoritesOnly);
                    heart.value = withSpring(heart.value ? 0 : 1);
                  }}
                  style={[
                    $unFavoriteButton,
                    showFavoritesOnly && $favoriteButton,
                  ]}
                  RightAccessory={ButtonHeartAccessory}
                >
                  <Text preset="hint" tx={'RoutinesScreen.favorites'} />
                </Button>
              </View>
            }
            ListHeaderComponentStyle={$heading}
            contentContainerStyle={$flatListContentContainer}
            progressViewOffset={spacing.massive * 3}
            refreshing={isLoading}
            onRefresh={reload}
            onEndReached={loadMoreRoutines}
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
              <RoutineItem key={item.id} routine={item} />
            )}
          />
        </Screen>
        {selectedRoutine?.id === undefined && (
          <Button
            preset="filled"
            onPress={handlePressAdd}
            fitToContent
            style={$addButton}
          >
            <MaterialCommunityIcons name="plus" size={20} />
          </Button>
        )}
      </>
    );
  },
);

const RoutineItem = observer(function RoutineItem({
  routine,
}: {
  routine: Routine;
}) {
  const {
    plansStore: {
      selectedPlan: {
        selectedRoutine,
        updateOneRoutine,
        createOneRoutine,
        deleteOneRoutine,
        select,
      },
    },
  } = useStores();

  const textFieldRef = useRef<TextInput>();

  const [updatedText, setUpdatedText] = useState(routine.text);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDoneLoading, setIsDoneLoading] = useState(false);

  async function handlePressFavorite() {
    if (routine.id < 0) routine.setIsFavorite(!routine.isFavorite);
    else {
      setIsFavoriteLoading(true);
      await updateOneRoutine(routine.id, { isFavorite: !routine.isFavorite });
      setIsFavoriteLoading(false);
    }
  }

  function handlePressEdit() {
    setUpdatedText(routine.text);
    select(routine);
    setTimeout(() => textFieldRef.current?.focus(), 1);
  }

  async function handlePressDelete() {
    setIsDeleteLoading(true);
    await deleteOneRoutine();
    setIsDeleteLoading(false);
  }

  function handlePressCancel() {
    select();
  }

  async function handlePressDone() {
    setIsDoneLoading(true);
    const response =
      routine.id < 0
        ? await createOneRoutine()
        : await updateOneRoutine(routine.id, { text: updatedText });
    if (response.kind === 'ok') {
      select();
      setUpdatedText(routine.text);
    }
    setIsDoneLoading(false);
  }

  return (
    <View style={$item}>
      <View style={$itemHeader}>
        <View style={$itemHeaderSection}>
          <Text
            preset="hint"
            text={routine.createdAt.toLocaleString()}
            style={$dateText}
          />
        </View>
        <View style={$itemHeaderSection}>
          <Button
            onPress={handlePressFavorite}
            fitToContent
            style={$topButton}
            isLoading={isFavoriteLoading}
            spinnerColor={colors.secondary}
          >
            <MaterialCommunityIcons
              name={routine.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={colors.secondary}
            />
          </Button>
          <Button
            onPress={handlePressEdit}
            fitToContent
            style={$topButton}
            disabled={!!selectedRoutine}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={selectedRoutine ? colors.disabled : colors.primary}
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
        value={
          routine.id === selectedRoutine?.id && routine.id > 0
            ? updatedText
            : routine.text
        }
        onChangeText={
          routine.id === selectedRoutine?.id && routine.id > 0
            ? setUpdatedText
            : routine.setText
        }
        status={routine.id === selectedRoutine?.id ? undefined : 'disabled'}
        inputWrapperStyle={
          routine.id === selectedRoutine?.id ? undefined : $disabledTextField
        }
      />
      {(routine.id === selectedRoutine?.id ||
        isDeleteLoading ||
        isDoneLoading) && (
        <View style={$itemFooter}>
          {routine.id > 0 && (
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
          )}
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

const $emptyList: ViewStyle = { marginTop: spacing.huge * 3 };
