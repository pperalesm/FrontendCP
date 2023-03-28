import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface DividerProps {
  type?: 'vertical' | 'horizontal';
  size?: number;
  style?: StyleProp<ViewStyle>;
  line?: boolean;
}

export function Divider(props: DividerProps) {
  const {
    type = 'horizontal',
    size = 10,
    line = true,
    style: $styleOverride,
  } = props;

  return (
    <View
      style={[
        $border,
        type === 'horizontal' && { height: size * 2 },
        type === 'vertical' && { width: size * 2 },
        $styleOverride,
      ]}
    >
      {line && (
        <View
          style={[
            $line,
            type === 'horizontal' && $horizontalLine,
            type === 'vertical' && $verticalLine,
          ]}
        />
      )}
    </View>
  );
}

const $border: ViewStyle = {
  justifyContent: 'center',
};

const $line: ViewStyle = {
  backgroundColor: colors.disabled,
  position: 'absolute',
};

const $horizontalLine: ViewStyle = {
  width: '100%',
  height: 1,
};

const $verticalLine: ViewStyle = {
  height: '100%',
  width: 1,
};
