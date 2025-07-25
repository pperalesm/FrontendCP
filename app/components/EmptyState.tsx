import React from 'react';
import {
  Image,
  ImageProps,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { spacing } from '../theme/spacing';
import { Button, ButtonProps } from './Button';
import { Text, TextProps } from './Text';
import { translate } from '../i18n/translate';

interface EmptyStateProps {
  /**
   * An optional prop that specifies the text/image set to use for the empty state.
   */
  preset?: keyof typeof EmptyStatePresets;
  /**
   * Style override for the container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * An Image source to be displayed above the heading.
   */
  imageSource?: ImageProps['source'];
  /**
   * Style overrides for image.
   */
  imageStyle?: StyleProp<ImageStyle>;
  /**
   * Pass any additional props directly to the Image component.
   */
  ImageProps?: Omit<ImageProps, 'source'>;
  /**
   * The heading text to display if not using `headingTx`.
   */
  heading?: TextProps['text'];
  /**
   * Heading text which is looked up via i18n.
   */
  headingTx?: TextProps['tx'];
  /**
   * Optional heading options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  headingTxOptions?: TextProps['txOptions'];
  /**
   * Style overrides for heading text.
   */
  headingStyle?: StyleProp<TextStyle>;
  /**
   * Pass any additional props directly to the heading Text component.
   */
  HeadingTextProps?: TextProps;
  /**
   * The content text to display if not using `contentTx`.
   */
  content?: TextProps['text'];
  /**
   * Content text which is looked up via i18n.
   */
  contentTx?: TextProps['tx'];
  /**
   * Optional content options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  contentTxOptions?: TextProps['txOptions'];
  /**
   * Style overrides for content text.
   */
  contentStyle?: StyleProp<TextStyle>;
  /**
   * Pass any additional props directly to the content Text component.
   */
  ContentTextProps?: TextProps;
  /**
   * The button text to display if not using `buttonTx`.
   */
  button?: TextProps['text'];
  /**
   * Button text which is looked up via i18n.
   */
  buttonTx?: TextProps['tx'];
  /**
   * Optional button options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  buttonTxOptions?: TextProps['txOptions'];
  /**
   * Style overrides for button.
   */
  buttonStyle?: ButtonProps['style'];
  /**
   * Style overrides for button text.
   */
  buttonTextStyle?: ButtonProps['textStyle'];
  /**
   * Called when the button is pressed.
   */
  buttonOnPress?: ButtonProps['onPress'];
  /**
   * Pass any additional props directly to the Button component.
   */
  ButtonProps?: ButtonProps;
}

const EmptyStatePresets = {
  generic: {
    imageSource: undefined,
    heading: translate('emptyStateComponent.generic.heading'),
    content: translate('emptyStateComponent.generic.content'),
    button: translate('emptyStateComponent.generic.button'),
  },
} as const;

/**
 * A component to use when there is no data to display. It can be utilized to direct the user what to do next.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-EmptyState.md)
 */
export function EmptyState(props: EmptyStateProps) {
  const preset = EmptyStatePresets[props.preset]
    ? EmptyStatePresets[props.preset]
    : undefined;

  const {
    button = preset?.button,
    buttonTx,
    buttonOnPress,
    buttonTxOptions,
    content = preset?.content,
    contentTx,
    contentTxOptions,
    heading = preset?.heading,
    headingTx,
    headingTxOptions,
    imageSource = preset?.imageSource,
    style: $containerStyleOverride,
    buttonStyle: $buttonStyleOverride,
    buttonTextStyle: $buttonTextStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    imageStyle: $imageStyleOverride,
    ButtonProps,
    ContentTextProps,
    HeadingTextProps,
    ImageProps,
  } = props;

  const isImagePresent = !!imageSource;
  const isHeadingPresent = !!(heading || headingTx);
  const isContentPresent = !!(content || contentTx);
  const isButtonPresent = !!(button || buttonTx);

  const $containerStyles = [$containerStyleOverride];
  const $imageStyles = [
    $image,
    (isHeadingPresent || isContentPresent || isButtonPresent) && {
      marginBottom: spacing.micro,
    },
    $imageStyleOverride,
    ImageProps?.style,
  ];
  const $headingStyles = [
    $heading,
    isImagePresent && { marginTop: spacing.micro },
    (isContentPresent || isButtonPresent) && { marginBottom: spacing.micro },
    $headingStyleOverride,
    HeadingTextProps?.style,
  ];
  const $contentStyles = [
    $content,
    (isImagePresent || isHeadingPresent) && { marginTop: spacing.small },
    isButtonPresent && { marginBottom: spacing.small },
    $contentStyleOverride,
    ContentTextProps?.style,
  ];
  const $buttonStyles = [
    (isImagePresent || isHeadingPresent || isContentPresent) && {
      marginTop: spacing.extraLarge,
    },
    $buttonStyleOverride,
    ButtonProps?.style,
  ];

  return (
    <View style={$containerStyles}>
      {isImagePresent && (
        <Image source={imageSource} {...ImageProps} style={$imageStyles} />
      )}

      {isHeadingPresent && (
        <Text
          preset="bold"
          text={heading}
          tx={headingTx}
          txOptions={headingTxOptions}
          {...HeadingTextProps}
          style={$headingStyles}
        />
      )}

      {isContentPresent && (
        <Text
          preset="helper"
          text={content}
          tx={contentTx}
          txOptions={contentTxOptions}
          {...ContentTextProps}
          style={$contentStyles}
        />
      )}

      {isButtonPresent && (
        <Button
          onPress={buttonOnPress}
          text={button}
          tx={buttonTx}
          txOptions={buttonTxOptions}
          textStyle={$buttonTextStyleOverride}
          {...ButtonProps}
          style={$buttonStyles}
          fitToContent
        />
      )}
    </View>
  );
}

const $image: ImageStyle = { alignSelf: 'center' };

const $heading: TextStyle = {
  textAlign: 'center',
};

const $content: TextStyle = {
  textAlign: 'center',
};
