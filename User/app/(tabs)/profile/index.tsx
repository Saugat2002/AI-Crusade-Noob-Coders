import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useUser } from "@/context/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Profile() {
  const { user, signOut } = useUser();

  const profileSections: {
    title: string;
    icon: "person" | "settings" | "trending-up";
    data: { label: string; value: string | undefined }[];
  }[] = [
      {
        title: "Personal Information",
        icon: "person",
        data: [
          { label: "Full Name", value: user?.fullName },
          { label: "Email", value: user?.email },
        ],
      },
      {
        title: "Care Settings",
        icon: "settings",
        data: [
          { label: "Language", value: "English" },
          { label: "Notifications", value: "Enabled" },
        ],
      },
      {
        title: "Progress Overview",
        icon: "trending-up",
        data: [
          { label: "Daily Tasks Completed", value: "8/10" },
          { label: "Weekly Exercise Score", value: "85%" },
        ],
      },
    ];

    const InitialAvatar = ({ name, size = 120 }) => {
      const initial = name ? name.charAt(0).toUpperCase() : '?';
      
      return (
        <View style={[styles.initialAvatar, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={styles.initialText}>{initial}</Text>
        </View>
      );
    };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
        {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <InitialAvatar name={user?.fullName} />
          )}
        </View>
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {profileSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name={section.icon} size={24} color="#4A90E2" />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>

          {section.data.map((item, idx) => (
            <View key={idx} style={styles.infoRow}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.editButton}>
        <MaterialIcons name="edit" size={20} color="white" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ ...styles.editButton, backgroundColor: "red" }}
        onPress={() => {
          signOut();
        }}
      >
        <MaterialIcons name="exit-to-app" size={20} color="white" />
        <Text style={styles.editButtonText}>Sign Out</Text>
      </TouchableOpacity>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',     
    alignItems: 'center',         
    overflow: 'hidden', 
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
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
    backgroundColor: '#E1E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  initialText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});
