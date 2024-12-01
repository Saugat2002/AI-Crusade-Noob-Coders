import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstletter";
import { useLanguage } from "@/context/LanguageContext";
import RNPickerSelect from "react-native-picker-select";
import texts from "@/utils/texts";

export default function Profile() {
  const { user, signOut } = useUser();
  const { language, setLanguage } = useLanguage();
  const InitialAvatar = ({
    name,
    size,
  }: {
    name: string | undefined;
    size: number;
  }) => {
    const initial = name ? name.charAt(0).toUpperCase() : "?";

    return (
      <View
        style={[
          styles.initialAvatar,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Text style={styles.initialText}>{initial}</Text>
      </View>
    );
  };

  console.log(language);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <InitialAvatar name={user?.fullName} size={120} />
          )}
        </View>
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="person" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>
            {texts[language].personalInformation}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{texts[language].fullName}</Text>
          <Text style={styles.value}>{user?.fullName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{texts[language].email}</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{texts[language].gender}</Text>
          <Text style={styles.value}>
            {capitalizeFirstLetter(user?.gender || "")}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{texts[language].guardiansEmail}</Text>
          <Text style={styles.value}>{user?.guardiansEmail}</Text>
        </View>
      </View>

      {/* Care Settings Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="settings" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>{texts[language].languageSettings}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{texts[language].language}</Text>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <RNPickerSelect
              onValueChange={(value) => setLanguage(value)}
              items={[
                { label: "English", value: "english" },
                { label: "Nepali", value: "nepali" },
              ]}
              value={language}
              placeholder={{ label: "Choose a language", value: language }}
              style={{
                inputAndroid: styles.pickerInput,
              }}
            />
          </View>
        </View>
        {/* <View style={styles.infoRow}>
          <Text style={styles.label}>Notifications</Text>
          <Text style={styles.value}>Enabled</Text>
        </View> */}
      </View>

      {/* Progress Overview Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="trending-up" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>
            {texts[language].progressOverview}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>
            {texts[language].dailyTasksCompleted}
          </Text>
          <Text style={styles.value}>8/10</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{texts[language].weeklyExerciseScore}</Text>
          <Text style={styles.value}>85%</Text>
        </View>
      </View>

      {/* Buttons */}
      {/* <TouchableOpacity style={styles.editButton}>
        <MaterialIcons name="edit" size={20} color="white" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity> */}
      {user ? (
        <TouchableOpacity
          style={{ ...styles.editButton, backgroundColor: "red" }}
          onPress={signOut}
        >
          <MaterialIcons name="exit-to-app" size={20} color="white" />
          <Text style={styles.editButtonText}>{texts[language].signOut}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{ ...styles.editButton, backgroundColor: "green" }}
          onPress={() => router.push("/signin")}
        >
          <MaterialIcons name="login" size={20} color="white" />
          <Text style={styles.editButtonText}>{texts[language].signIn}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    padding: 3,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    resizeMode: "cover",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize:19,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  label: {
    fontSize: 15,
    color: "#666",
  },
  value: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  picker: {
    width: 150,
    color: "#333",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  initialAvatar: {
    backgroundColor: "#E1E8FF",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  initialText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  pickerInput: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingLeft: 50,
    width: "100%",
  },
});
