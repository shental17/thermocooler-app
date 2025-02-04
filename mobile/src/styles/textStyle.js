import {StyleSheet, Dimensions} from 'react-native';

// Get the device screen width to adjust the font sizes dynamically
const {width} = Dimensions.get('window');
const scale = width / 375; // 375 is considered the base width for design

const textStyles = StyleSheet.create({
  smallText: {
    fontFamily: 'SF Pro Display',
    fontSize: 11 * scale,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 14 * scale,
  },
  bodyTextSmall: {
    fontFamily: 'SF Pro Display',
    fontSize: 13 * scale,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18 * scale,
  },
  bodyTextMedium: {
    fontFamily: 'SF Pro Display',
    fontSize: 14 * scale,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20 * scale,
  },
  bodyTextLarge: {
    fontFamily: 'SF Pro Display',
    fontSize: 15 * scale,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 22 * scale,
  },
  subheadingSmall: {
    fontFamily: 'SF Pro Display',
    fontSize: 15 * scale,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 22 * scale,
  },
  subheadingMedium: {
    fontFamily: 'SF Pro Display',
    fontSize: 17 * scale,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 26 * scale,
  },
  subheadingLarge: {
    fontFamily: 'SF Pro Display',
    fontSize: 18 * scale,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 30 * scale,
  },
  headingSmall: {
    fontFamily: 'SF Pro Display',
    fontSize: 18 * scale,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 26 * scale,
  },
  headingMedium: {
    fontFamily: 'SF Pro Display',
    fontSize: 20 * scale,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 30 * scale,
  },
  headingLarge: {
    fontFamily: 'SF Pro Display',
    fontSize: 22 * scale,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 32 * scale,
  },
  mainHeadingSmall: {
    fontFamily: 'SF Pro Display',
    fontSize: 22 * scale,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 30 * scale,
  },
  mainHeadingMedium: {
    fontFamily: 'SF Pro Display',
    fontSize: 25 * scale,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 32 * scale,
  },
  mainHeadingLarge: {
    fontFamily: 'SF Pro Display',
    fontSize: 28 * scale,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 36 * scale,
  },
  displayText: {
    fontFamily: 'SF Pro Display',
    fontSize: 30 * scale,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
  },
});

export default textStyles;
