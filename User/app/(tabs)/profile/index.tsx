import { View, Text } from "react-native";
import React from "react";
import { useUser } from "@/context/UserContext";

export default function index() {
  const { user } = useUser();
  console.log(user);
  
  return (
    <View>
      <Text>{user?.email}</Text>
      <Text>{user?.fullName}</Text>
    </View>
  );
}
