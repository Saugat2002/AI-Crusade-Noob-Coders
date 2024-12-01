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
import { useLanguage } from "@/context/LanguageContext";
import texts from "@/utils/texts";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const { language, setLanguage } = useLanguage();
  console.log(language);
  
  const handleSignIn = async (e: GestureResponderEvent) => {
    e.preventDefault();
    const request = new Request(
      `${process.env.EXPO_PUBLIC_SERVER_URI}/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      }
    );
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
        <Text className="text-2xl font-bold mb-6">
          {texts[language].signIn}
        </Text>
        <TextInput
          className="border border-gray-300 rounded p-2 mb-4 w-80"
          placeholder={texts[language].email}
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          className="border border-gray-300 rounded p-2 mb-6 w-80"
          placeholder={texts[language].password}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity
          className="bg-blue-500 rounded p-2 w-80"
          onPress={(e) => handleSignIn(e)}
        >
          <Text className="text-white text-center">
            {texts[language].signIn}
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row mt-4">
          <Text>{texts[language].dontHaveAccount}</Text>
          <Link href="/signup" className="text-blue-700">
            <Text className="underline">{texts[language].signUp}</Text>
          </Link>
        </View>
        <View className="mt-6"> {/* Added margin-top of 6 (1.5rem/24px) */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-blue-500 rounded-full px-4 py-2 self-center shadow-sm"
            onPress={() => {
              setLanguage(language === "english" ? "nepali" : "english");
            }}
          >
            <View className="flex-row items-center">
              {language === "english" ? (
                <Text className="text-blue-500 font-semibold mr-2">🇬🇧 English</Text>
              ) : (
                <Text className="text-blue-500 font-semibold mr-2">🇳🇵 Nepali</Text>
              )}
              <View className="bg-blue-100 rounded-full p-1">
                <Text className="text-blue-700 text-xs">
                  {language === "english" ? "NP" : "EN"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default SignIn;