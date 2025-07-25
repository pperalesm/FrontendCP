import React, { ReactNode } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { Text } from '../../components/Text';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface DemoUseCaseProps {
  name: string;
  description?: string;
  layout?: 'column' | 'row';
  children: ReactNode;
}

export function DemoUseCase(props: DemoUseCaseProps) {
  const { name, description, children, layout = 'column' } = props;

  return (
    <View>
      <Text style={$name}>{name}</Text>

      {description && <Text style={$description}>{description}</Text>}

      <View style={[layout === 'row' && $rowLayout, $item]}>{children}</View>
    </View>
  );
}

const $description: TextStyle = {
  marginTop: spacing.medium,
};

const $item: ViewStyle = {
  backgroundColor: colors.background,
  borderRadius: 8,
  padding: spacing.large,
  marginVertical: spacing.medium,
};

const $name: TextStyle = {
  fontFamily: typography.primary.bold,
};

const $rowLayout: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
};

// @demo remove-file
