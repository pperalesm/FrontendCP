import React, { ErrorInfo } from 'react';
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Text } from '../../components/Text';
import { Screen } from '../../components/Screen';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface ErrorDetailsProps {
  error: Error;
  errorInfo: ErrorInfo;
  onReset(): void;
}

export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top', 'bottom']}
      contentContainerStyle={$contentContainer}
    >
      <View style={$topSection}>
        <Icon icon="ladybug" size={64} />
        <Text style={$heading} preset="subheading" tx="errorScreen.title" />
        <Text tx="errorScreen.friendlySubtitle" />
      </View>

      <ScrollView
        style={$errorSection}
        contentContainerStyle={$errorSectionContentContainer}
      >
        <Text
          style={$errorContent}
          weight="bold"
          text={`${props.error}`.trim()}
        />
        <Text
          selectable
          style={$errorBacktrace}
          text={`${props.errorInfo.componentStack}`.trim()}
        />
      </ScrollView>

      <Button
        preset="filled"
        style={$resetButton}
        onPress={props.onReset}
        tx="errorScreen.reset"
      />
    </Screen>
  );
}

const $contentContainer: ViewStyle = {
  alignItems: 'center',
  paddingHorizontal: spacing.large,
  paddingTop: spacing.extraLarge,
  flex: 1,
};

const $topSection: ViewStyle = {
  flex: 1,
  alignItems: 'center',
};

const $heading: TextStyle = {
  color: colors.error,
  marginBottom: spacing.medium,
};

const $errorSection: ViewStyle = {
  flex: 2,
  backgroundColor: colors.border,
  marginVertical: spacing.medium,
  borderRadius: 6,
};

const $errorSectionContentContainer: ViewStyle = {
  padding: spacing.medium,
};

const $errorContent: TextStyle = {
  color: colors.error,
};

const $errorBacktrace: TextStyle = {
  marginTop: spacing.medium,
  color: colors.secondaryText,
};

const $resetButton: ViewStyle = {
  backgroundColor: colors.error,
  paddingHorizontal: spacing.huge,
};
