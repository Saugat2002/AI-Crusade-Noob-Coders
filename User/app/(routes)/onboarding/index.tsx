import { View, Text } from "react-native";
import Button from "../../../components/Button";
import { Link, router } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 bg-blue-50 justify-center items-center px-6">
      <View className="w-full max-w-md">
        {/* Welcome Text */}
        <View className="mb-10">
          <Text className="text-4xl font-extrabold text-blue-900 text-center mb-2">
            Welcome to
          </Text>
          <Text className="text-5xl font-bold text-blue-700 text-center tracking-tight">
            Smaran
          </Text>
        </View>
        
        {/* Get Started Button */}
        <View className="items-center mb-6">
          <Button
            title="Get Started"
            onPress={() => router.push("/signup")}
            width={7}
            backgroundColor="bg-blue-600"
            textColor="text-white"
            className="shadow-md"
          />
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600">
            Already have an account? 
          </Text>
          <Link href="/signin" className="ml-2">
            <Text className="text-blue-700 font-semibold underline">
              Sign In
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}