import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Link, router } from "expo-router";
import { useUser } from "@/context/UserContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();

  const handleSignIn = async (e: GestureResponderEvent) => {
    e.preventDefault();
    // Handle sign
    const request = new Request(`${process.env.EXPO_PUBLIC_SERVER_URI}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    try {
      const response = await fetch(request);
      const result = await response.json();
      if (response.status !== 200) {
        alert(result.message);
        return;
      }
      console.log("Success:", result);
      setUser(result.user);
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-2xl font-bold mb-6">Sign In</Text>
        <TextInput
          className="border border-gray-300 rounded p-2 mb-4 w-80"
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          className="border border-gray-300 rounded p-2 mb-6 w-80"
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
        />
        {/* <Link href="/" className="text-blue-700 mb-6">
          <Text className="underline">Forgot Password?</Text>
        </Link> */}
        <TouchableOpacity
          className="bg-blue-500 rounded p-2 w-80"
          onPress={(e) => handleSignIn(e)}
        >
          <Text className="text-white text-center">Sign In</Text>
        </TouchableOpacity>
        <View className="flex flex-row mt-4">
          <Text>Don't have an account? </Text>
          <Link href="/signup" className="text-blue-700">
            <Text className="underline">Sign Up</Text>
          </Link>
        </View>
      </View>
    </>
  );
};

export default SignIn;
