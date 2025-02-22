import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';

// Move AnimatedCircle outside the component to avoid re-creation
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const TemperatureControlCircle = ({
  temperature,
  minTemperature,
  maxTemperature,
  disabled = false,
}) => {
  const theme = useTheme();
  const size = 200;
  const strokeWidth = 14; // Thickness of the progress circle
  const radius = (size - strokeWidth) / 2;
  const progressRadius = radius - 20;
  const smallCircleRadius = radius - 40;
  const circumference = 2 * Math.PI * progressRadius;

  const styles = StyleSheet.create({
    shadow: {
      shadowColor: theme.colors.toggleContainer, // The color of the shadow
      shadowOffset: {width: -14, height: -14}, // X and Y offset
      shadowOpacity: 0.5, // Opacity of the shadow
      shadowRadius: 50, // Blur radius
      elevation: 10,
    },
    textContainer: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      ...textStyles.mainHeadingMedium,
      color: disabled ? theme.colors.textSecondary : theme.colors.selected,
    },
  });

  // Normalize temperature to progress (0 to 1)
  const progress =
    (temperature - minTemperature) / (maxTemperature - minTemperature);

  // Ensure progress stays within bounds (0 to 1)
  const clampedProgress = Math.max(0, Math.min(1, progress));
  console.log('temperature', temperature);
  console.log('progress', progress);
  console.log('clampedProgress', clampedProgress);

  // Animated value for progress
  const animatedProgress = useSharedValue(clampedProgress);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {duration: 1000}); // Smooth animation
  }, [clampedProgress]);

  //   Derived animated stroke offset
  const animatedStrokeOffset = useDerivedValue(() => {
    return circumference * (1 - animatedProgress.value);
  });

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedStrokeOffset.value,
  }));

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        styles.shadow,
      ]}>
      {/* Bottom Black Circle */}
      <Svg width={size} height={size} style={{position: 'absolute'}}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={theme.colors.toggleContainer}
        />
      </Svg>

      {/* Middle Blue Circle with Animated Blue Progress */}
      <Svg
        width={size}
        height={size}
        style={{position: 'absolute', transform: [{rotate: '90deg'}]}}>
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={progressRadius} // Slightly smaller than the background
          fill="none"
          stroke={
            disabled
              ? theme.colors.textSecondary
              : theme.colors.buttonBackgroundPrimary
          }
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps} // Apply animated stroke offset
          strokeLinecap="round"
        />
      </Svg>

      {/* Top Black Cover Circle */}
      <Svg width={size} height={size} style={{position: 'absolute'}}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={smallCircleRadius}
          fill={theme.colors.toggleContainer}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{temperature}°C</Text>
      </View>
    </View>
  );
};

export default TemperatureControlCircle;
