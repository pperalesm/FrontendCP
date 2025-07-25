import React, { ComponentType, Fragment, ReactElement } from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { Text, TextProps } from './Text';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Presets = keyof typeof $containerPresets;

interface CardProps extends TouchableOpacityProps {
  /**
   * One of the different types of text presets.
   */
  preset?: Presets;
  /**
   * How the content should be aligned vertically. This is especially (but not exclusively) useful
   * when the card is a fixed height but the content is dynamic.
   *
   * `top` (default) - aligns all content to the top.
   * `center` - aligns all content to the center.
   * `space-between` - spreads out the content evenly.
   * `force-footer-bottom` - aligns all content to the top, but forces the footer to the bottom.
   */
  verticalAlignment?:
    | 'top'
    | 'center'
    | 'space-between'
    | 'force-footer-bottom';
  /**
   * Custom component added to the left of the card body.
   */
  LeftComponent?: ReactElement;
  /**
   * Custom component added to the right of the card body.
   */
  RightComponent?: ReactElement;
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
   * Custom heading component.
   * Overrides all other `heading*` props.
   */
  HeadingComponent?: ReactElement;
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
   * Custom content component.
   * Overrides all other `content*` props.
   */
  ContentComponent?: ReactElement;
  /**
   * The footer text to display if not using `footerTx`.
   */
  footer?: TextProps['text'];
  /**
   * Footer text which is looked up via i18n.
   */
  footerTx?: TextProps['tx'];
  /**
   * Optional footer options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  footerTxOptions?: TextProps['txOptions'];
  /**
   * Style overrides for footer text.
   */
  footerStyle?: StyleProp<TextStyle>;
  /**
   * Pass any additional props directly to the footer Text component.
   */
  FooterTextProps?: TextProps;
  /**
   * Custom footer component.
   * Overrides all other `footer*` props.
   */
  FooterComponent?: ReactElement;
}

/**
 * Cards are useful for displaying related information in a contained way.
 * If a ListItem displays content horizontally, a Card can be used to display content vertically.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Card.md)
 */
export function Card(props: CardProps) {
  const {
    content,
    contentTx,
    contentTxOptions,
    footer,
    footerTx,
    footerTxOptions,
    heading,
    headingTx,
    headingTxOptions,
    ContentComponent,
    HeadingComponent,
    FooterComponent,
    LeftComponent,
    RightComponent,
    verticalAlignment = 'top',
    style: $containerStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    footerStyle: $footerStyleOverride,
    ContentTextProps,
    HeadingTextProps,
    FooterTextProps,
    ...WrapperProps
  } = props;

  const preset: Presets = $containerPresets[props.preset]
    ? props.preset
    : 'default';
  const isPressable = !!WrapperProps.onPress;
  const isHeadingPresent = !!(HeadingComponent || heading || headingTx);
  const isContentPresent = !!(ContentComponent || content || contentTx);
  const isFooterPresent = !!(FooterComponent || footer || footerTx);

  const Wrapper: ComponentType<TouchableOpacityProps> = isPressable
    ? TouchableOpacity
    : View;
  const HeaderContentWrapper =
    verticalAlignment === 'force-footer-bottom' ? View : Fragment;

  const $containerStyle = [
    $containerPresets[preset],
    isPressable && { elevation: 4 },
    $containerStyleOverride,
  ];
  const $headingStyle = [
    $headingPresets[preset],
    (isFooterPresent || isContentPresent) && { marginBottom: spacing.micro },
    $headingStyleOverride,
    HeadingTextProps?.style,
  ];
  const $contentStyle = [
    $contentPresets[preset],
    isHeadingPresent && { marginTop: spacing.micro },
    isFooterPresent && { marginBottom: spacing.micro },
    $contentStyleOverride,
    ContentTextProps?.style,
  ];
  const $footerStyle = [
    $footerPresets[preset],
    (isHeadingPresent || isContentPresent) && { marginTop: spacing.extraSmall },
    $footerStyleOverride,
    FooterTextProps?.style,
  ];
  const $alignmentWrapperStyle = [
    $alignmentWrapper,
    { justifyContent: $alignmentWrapperFlexOptions[verticalAlignment] },
    LeftComponent && { marginStart: spacing.small },
    RightComponent && { marginEnd: spacing.small },
  ];

  return (
    <Wrapper
      style={$containerStyle}
      activeOpacity={0.8}
      accessibilityRole={isPressable ? 'button' : undefined}
      {...WrapperProps}
    >
      {LeftComponent}

      <View style={$alignmentWrapperStyle}>
        <HeaderContentWrapper>
          {HeadingComponent ||
            (isHeadingPresent && (
              <Text
                preset="bold"
                text={heading}
                tx={headingTx}
                txOptions={headingTxOptions}
                {...HeadingTextProps}
                style={$headingStyle}
              />
            ))}

          {ContentComponent ||
            (isContentPresent && (
              <Text
                preset="hint"
                text={content}
                tx={contentTx}
                txOptions={contentTxOptions}
                {...ContentTextProps}
                style={$contentStyle}
              />
            ))}
        </HeaderContentWrapper>

        {FooterComponent ||
          (isFooterPresent && (
            <Text
              preset="hint"
              text={footer}
              tx={footerTx}
              txOptions={footerTxOptions}
              {...FooterTextProps}
              style={$footerStyle}
            />
          ))}
      </View>

      {RightComponent}
    </Wrapper>
  );
}

const $containerBase: ViewStyle = {
  borderRadius: 16,
  padding: spacing.small,
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 2,
  flexDirection: 'row',
  alignItems: 'center',
};

const $alignmentWrapper: ViewStyle = {
  alignSelf: 'stretch',
  flex: 1,
};

const $alignmentWrapperFlexOptions = {
  top: 'flex-start',
  center: 'center',
  'space-between': 'space-between',
  'force-footer-bottom': 'space-between',
} as const;

const $containerPresets = {
  default: [
    $containerBase,
    {
      backgroundColor: colors.primarySurface,
    },
  ] as StyleProp<ViewStyle>,

  filled: [
    $containerBase,
    { backgroundColor: colors.primaryDark },
  ] as StyleProp<ViewStyle>,
};

const $headingPresets: Record<Presets, TextStyle> = {
  default: { color: colors.primaryText },
  filled: { color: colors.filledText },
};

const $contentPresets: Record<Presets, TextStyle> = {
  default: { color: colors.primaryText },
  filled: { color: colors.filledText },
};

const $footerPresets: Record<Presets, TextStyle> = {
  default: { color: colors.secondaryText },
  filled: { color: colors.primaryLight },
};
