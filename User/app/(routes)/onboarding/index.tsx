import { View, Text } from "react-native";
import Button from "../../../components/Button";
import { Link, router } from "expo-router";

export default function index() {
  return (
    <View className="w-full flex justify-center items-center gap-5 mt-16">
      <View>
        <Text className="text-5xl font-extrabold text-blue-800 text-center">
          Welcome to
        </Text>
        <Text className="text-3xl font-bold text-blue-800 text-center">
          Dementia Care
        </Text>
      </View>
      <Button
        title="Get Started"
        onPress={() => router.push("/signup")}
        width={7}
        backgroundColor="bg-blue-700"
        textColor="text-slate-100"
      />
      <View className="flex flex-row">
        <Text>Already have an account? </Text>
        <Link href="/signin" className="text-blue-700">
          <Text className="underline">Sign In</Text>
        </Link>
      </View>
    </View>
  );
}
