import React from 'react';
import {
  View,
  Text,
  ViewProps,
  TextProps,
  ScrollViewProps,
  ImageProps,
  TouchableOpacityProps,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Image,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import tailwind from 'tailwind-rn';
import FastImage from 'react-native-fast-image'

interface ITailwindViewProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
}

function generateStyles(className = '') {
  return tailwind(
    className
      .split(' ')
      .filter(Boolean)
      .join(' '),
  );
}

function TailwindSafeAreaView({
  className = '',
  style,
  ...rest
}: ITailwindViewProps) {
  const styles = className ? tailwind(className) : undefined;

  return <SafeAreaView style={[styles, style]} {...rest} />;
}

function TailwindView({className = '', style, ...rest}: ITailwindViewProps) {
  const styles = className ? tailwind(className) : undefined;
  return <View style={[styles, style]} {...rest} />;
}

interface ITailwindTextProps extends TextProps {
  className?: string;
  children?: React.ReactNode;
}

interface ITailwindAnimatedTextProps extends Animated.AnimatedComponent<Text> {
  className?: string;
  children?: React.ReactNode;
  style?: any;
}

function TailwindAnimatedText({className = '', style, ...rest}: any) {
  const styles = generateStyles(className);
  return <Animated.Text style={[styles, style]} {...rest} />;
}

function TailwindText({className = '', style, ...rest}: ITailwindTextProps) {
  const styles = className ? tailwind(className) : undefined;
  return <Text style={[styles, style]} {...rest} />;
}

interface ITailwindScrollViewProps extends ScrollViewProps {
  className?: string;
  children?: React.ReactNode;
}

function TailwindScrollView({
  className = '',
  style,
  ...rest
}: ITailwindScrollViewProps) {
  const styles = className ? tailwind(className) : undefined;
  return <ScrollView style={[styles, style]} {...rest} />;
}

interface ITailwindImageProps extends ImageProps {
  className?: string;
  children?: React.ReactNode;
}

function TailwindImage({className, style, ...rest}: ITailwindImageProps) {
  const styles = className ? tailwind(className) : undefined;
  return <FastImage style={[styles, style]} {...rest} />;
}

interface ITailwindPressableProps extends TouchableOpacityProps {
  className?: string;
  children?: React.ReactNode;
}

function TailwindPressable({
  className = '',
  style,
  ...rest
}: ITailwindPressableProps) {
  const styles = className ? tailwind(className) : undefined;
  return <TouchableOpacity style={[styles, style]} {...rest} />;
}

export {
  TailwindView as View,
  TailwindSafeAreaView as SafeAreaView,
  TailwindText as Text,
  TailwindScrollView as ScrollView,
  TailwindImage as Image,
  TailwindPressable as Pressable,
  TailwindAnimatedText as AnimatedText,
};
