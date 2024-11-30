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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState("male");
  const [guardiansEmail, setGuardiansEmail] = useState("");

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
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Gender:</Text>
        <RadioButton.Group
          onValueChange={(value: string) => setGender(value)}
          value={gender}
        >
          <View style={styles.radioButton}>
            <RadioButton value="male" />
            <Text>Male</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="female" />
            <Text>Female</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="other" />
            <Text>Other</Text>
          </View>
        </RadioButton.Group>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Guardian's Email"
        value={guardiansEmail}
        onChangeText={setGuardiansEmail}
      />
      <Text>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={(e) => handleSignUp(e)}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
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
