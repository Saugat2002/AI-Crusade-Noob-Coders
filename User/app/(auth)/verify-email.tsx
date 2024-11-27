import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, useGlobalSearchParams } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

export default function verifyEmail() {
  const [validUrl, setValidUrl] = useState(false);
  const queryParams = useGlobalSearchParams();

  console.log("Query Params", queryParams);

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:8000/api/v1/verify-email?id=${queryParams.id}&token=${queryParams.token}`;
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
          <Text>Email verified successfully</Text>
          <Link href="/signin">Go To Login</Link>
        </View>
      ) : (
        <Text>404 not Found</Text>
      )}
    </View>
  );
}
