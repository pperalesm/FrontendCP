import React, { ComponentType } from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Keyboard,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Text, TextProps } from './Text';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Presets = keyof typeof $viewPresets;

export interface ButtonAccessoryProps {
  style: StyleProp<any>;
  pressableState: PressableStateCallbackType;
}

export interface ButtonProps extends PressableProps {
  /**
   * If true, fit button width to content.
   */
  fitToContent?: boolean;
  /**
   * If true, ignore text and display spinner.
   */
  isLoading?: boolean;
  /**
   * Loading spinner color.
   */
  spinnerColor?: string;
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps['tx'];
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps['text'];
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps['txOptions'];
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>;
  /**
   * One of the different types of button presets.
   */
  preset?: Presets;
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * Children components.
   */
  children?: React.ReactNode;
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Button.md)
 */
export function Button(props: ButtonProps) {
  const {
    fitToContent = false,
    isLoading,
    spinnerColor,
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    onPress,
    disabled,
    ...rest
  } = props;

  const preset: Presets = $viewPresets[props.preset] ? props.preset : 'default';
  function $viewStyle({ pressed }) {
    return [
      $viewPresets[preset],
      disabled && [$disabledView],
      fitToContent && $fitToContent,
      $viewStyleOverride,
      !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
    ];
  }
  function $textStyle({ pressed }) {
    return [
      $textPresets[preset],
      $textStyleOverride,
      !!pressed && [$pressedTextPresets[preset], $pressedTextStyleOverride],
    ];
  }

  return (
    <Pressable
      style={$viewStyle}
      disabled={disabled}
      onPress={(event: GestureResponderEvent) => {
        if (!isLoading) {
          Keyboard.dismiss();
          onPress(event);
        }
      }}
      accessibilityRole="button"
      {...rest}
    >
      {(state) => (
        <>
          {isLoading ? (
            <ActivityIndicator
              style={$spinner}
              color={
                spinnerColor ||
                (preset === 'default' ? colors.primary : colors.filledText)
              }
            />
          ) : (
            <>
              {!!LeftAccessory && (
                <LeftAccessory
                  style={$leftAccessoryStyle}
                  pressableState={state}
                />
              )}

              <Text
                tx={tx}
                text={text}
                txOptions={txOptions}
                style={$textStyle(state)}
              >
                {children}
              </Text>

              {!!RightAccessory && (
                <RightAccessory
                  style={$rightAccessoryStyle}
                  pressableState={state}
                />
              )}
            </>
          )}
        </>
      )}
    </Pressable>
  );
}

const $baseViewStyle: ViewStyle = {
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  paddingVertical: spacing.medium,
  paddingHorizontal: spacing.medium,
  overflow: 'hidden',
  elevation: 4,
};

const $disabledView: ViewStyle = {
  borderColor: colors.disabled,
};

const $fitToContent: ViewStyle = {
  alignSelf: 'center',
};

const $baseTextStyle: TextStyle = {
  fontSize: 16,
  lineHeight: 20,
  fontFamily: typography.primary.medium,
  textAlign: 'center',
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
  color: colors.primary,
};

const $rightAccessoryStyle: ViewStyle = {
  marginStart: spacing.extraSmall,
  zIndex: 1,
};
const $leftAccessoryStyle: ViewStyle = {
  marginEnd: spacing.extraSmall,
  zIndex: 1,
};

const $viewPresets = {
  default: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.secondarySurface,
    },
  ] as StyleProp<ViewStyle>,

  filled: [
    $baseViewStyle,
    { backgroundColor: colors.primary },
  ] as StyleProp<ViewStyle>,
};

const $textPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: $baseTextStyle,
  filled: [$baseTextStyle, { color: colors.filledText }],
};

const $pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { backgroundColor: colors.primaryLight },
  filled: { backgroundColor: colors.primaryDark },
};

const $pressedTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: { opacity: 0.9 },
  filled: { opacity: 0.9 },
};

const $spinner: ViewStyle = { height: 22, width: 22 };
