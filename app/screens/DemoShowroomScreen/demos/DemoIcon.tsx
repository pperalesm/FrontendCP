/* eslint-disable react/jsx-key */
import React from 'react';
import { ImageStyle, TextStyle, View, ViewStyle } from 'react-native';
import { Icon, iconRegistry, IconTypes, Text } from '../../../components';
import { spacing } from '../../../theme';
import { Demo } from '../DemoShowroomScreen';
import { DemoUseCase } from '../DemoUseCase';

const $demoIconContainer: ViewStyle = {
  padding: spacing.extraSmall,
};

const $iconTile: ViewStyle = {
  width: '33.333%',
  alignItems: 'center',
  paddingVertical: spacing.extraSmall,
};

const $iconTileLabel: TextStyle = {
  marginTop: spacing.tiny,
};

const $customIconContainer: ViewStyle = {
  padding: spacing.medium,
};

const $customIcon: ImageStyle = {};

export const DemoIcon: Demo = {
  name: 'Icon',
  description:
    'A component to render a registered icon. It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.',
  data: [
    <DemoUseCase
      name="Icons"
      description="List of icons registered inside the component."
      layout="row"
    >
      {Object.keys(iconRegistry).map((icon) => (
        <View key={icon} style={$iconTile}>
          <Icon icon={icon as IconTypes} size={35} />

          <Text size="xs" style={$iconTileLabel}>
            {icon}
          </Text>
        </View>
      ))}
    </DemoUseCase>,

    <DemoUseCase name="Size" description="There's a size prop." layout="row">
      <Icon icon="ladybug" containerStyle={$demoIconContainer} />
      <Icon icon="ladybug" size={35} containerStyle={$demoIconContainer} />
      <Icon icon="ladybug" size={50} containerStyle={$demoIconContainer} />
      <Icon icon="ladybug" size={75} containerStyle={$demoIconContainer} />
    </DemoUseCase>,

    <DemoUseCase name="Color" description="There's a color prop." layout="row">
      <Icon icon="ladybug" containerStyle={$demoIconContainer} />
      <Icon icon="ladybug" containerStyle={$demoIconContainer} />
      <Icon icon="ladybug" containerStyle={$demoIconContainer} />
      <Icon icon="ladybug" containerStyle={$demoIconContainer} />
      <Icon icon="ladybug" containerStyle={$demoIconContainer} />
    </DemoUseCase>,

    <DemoUseCase
      name="Styling"
      description="The component can be styled easily."
      layout="row"
    >
      <Icon
        icon="ladybug"
        style={$customIcon}
        size={40}
        containerStyle={$customIconContainer}
      />
    </DemoUseCase>,
  ],
};

// @demo remove-file
