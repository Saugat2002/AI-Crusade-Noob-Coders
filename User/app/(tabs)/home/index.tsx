import { View, Text } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";

export default function index() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/home", {
          credentials: "include",
        });
        const result = await response.json();
        if (response.status !== 200) {
          alert(result.message);
          router.push("/signin");
          return;
        }
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}
