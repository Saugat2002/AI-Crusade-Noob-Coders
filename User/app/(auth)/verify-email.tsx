import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, useGlobalSearchParams } from "expo-router";
import { useLanguage } from "@/context/LanguageContext"; // Adjust the import as needed
import texts from "@/utils/texts";

export default function verifyEmail() {
  const [validUrl, setValidUrl] = useState(false);
  const queryParams = useGlobalSearchParams();
  const { language, setLanguage } = useLanguage(); // Adjust the import as needed

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
    <View>
      {validUrl ? (
        <View>
          <Text>{texts[language].emailVerified}</Text>
          <Link href="/signin">{texts[language].signIn}</Link>
          <TouchableOpacity
          onPress={() => {
            setLanguage(language === "english" ? "nepali" : "english");
          }}
        >
          <Text>{texts[language].switch}</Text>
        </TouchableOpacity>
        </View>
      ) : (
        <Text>404 not Found</Text>
      )}
    </View>
  );
}
