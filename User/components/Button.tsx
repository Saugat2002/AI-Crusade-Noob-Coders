import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";

type Props = {
  title: string;
  onPress: () => void;
  width?: number;
  backgroundColor?: string;
  textColor?: string;
};

const Button = ({
  title,
  onPress,
  width,
  backgroundColor,
  textColor,
}: Props) => {
  const widthString = "w-" + String(width);
  return (
    <Pressable
      onPress={onPress}
      className={`${backgroundColor} py-3 w-1/3 rounded-xl`}
    >
      <Text className={`${textColor} text-center`}>{title}</Text>
    </Pressable>
  );
};

export default Button;
