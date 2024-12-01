import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, useGlobalSearchParams } from "expo-router";
import { useLanguage } from "@/context/LanguageContext";
import texts from "@/utils/texts";

export default function VerifyEmail() {
  const [validUrl, setValidUrl] = useState(false);
  const queryParams = useGlobalSearchParams();
  const { language, setLanguage } = useLanguage();

  console.log("Query Params", queryParams);

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_SERVER_URI}/verify-email?id=${queryParams.id}&token=${queryParams.token}`;
        const response = await fetch(url);
        const result = await response.json();
        console.log(result);
        if (response.status !== 200) {
          setValidUrl(false);
          return;
        }
        setValidUrl(true);
      } catch (err) {
        console.log(err);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [queryParams]);

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <View className="flex-1 justify-center items-center px-6">
        {validUrl ? (
          <View className="w-full bg-white rounded-xl shadow-lg p-6 items-center">
            <Text className="text-2xl font-bold text-blue-600 mb-4">
              {texts[language].emailVerified}
            </Text>
            
            <TouchableOpacity 
              className="bg-blue-500 rounded-lg py-3 px-6 mb-4 w-full items-center"
              onPress={() => {
                // Add sign in navigation logic here
                console.log("Sign In");
              }}
            >
              <Text className="text-white font-semibold">
                {texts[language].signIn}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white border border-blue-500 rounded-lg py-3 px-6 w-full items-center"
              onPress={() => {
                setLanguage(language === "english" ? "nepali" : "english");
              }}
            >
              <Text className="text-blue-500 font-semibold">
                {texts[language].switch}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="w-full bg-white rounded-xl shadow-lg p-6 items-center">
            <Text className="text-2xl font-bold text-red-500 mb-4">
              404 Not Found
            </Text>
            <Text className="text-gray-600 text-center">
              The email verification link is invalid or has expired.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}