import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { useLanguage } from "@/context/LanguageContext";
import texts from "@/utils/texts";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState("male");
  const [guardiansEmail, setGuardiansEmail] = useState("");
  const { language, setLanguage} = useLanguage();

  const handleSignUp = async (e: GestureResponderEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const request = new Request(
      `${process.env.EXPO_PUBLIC_SERVER_URI}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          gender,
          guardiansEmail,
        }),
        credentials: "include",
      }
    );

    try {
      const response = await fetch(request);
      console.log(response);

      const result = await response.json();
      if (response.status !== 201) {
        alert(result.message);
        return;
      }
      setMessage(result.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{texts[language].signUp}</Text>
      <TextInput
        style={styles.input}
        placeholder={texts[language].fullName}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder={texts[language].email}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={texts[language].password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder={texts[language].confirmPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>{texts[language].gender}:</Text>
        <RadioButton.Group
          onValueChange={(value: string) => setGender(value)}
          value={gender}
        >
          <View style={styles.radioButton}>
            <RadioButton value="male" />
            <Text>{texts[language].male}</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="female" />
            <Text>{texts[language].female}</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="other" />
            <Text>{texts[language].other}</Text>
          </View>
        </RadioButton.Group>
      </View>
      <TextInput
        style={styles.input}
        placeholder={texts[language].guardiansEmail}
        value={guardiansEmail}
        onChangeText={setGuardiansEmail}
      />
      <Text>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={(e) => handleSignUp(e)}>
        <Text style={styles.buttonText}>{texts[language].signUp}</Text>
      </TouchableOpacity>

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
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    width: "100%",
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUp;
