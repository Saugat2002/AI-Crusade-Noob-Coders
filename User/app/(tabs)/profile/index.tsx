import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useUser } from "@/context/UserContext";
import { MaterialIcons } from '@expo/vector-icons';

export default function Profile() {
  const { user } = useUser();

  const profileSections = [
    {
      title: "Personal Information",
      icon: "person",
      data: [
        { label: "Full Name", value: user?.fullName },
        { label: "Email", value: user?.email },
      ]
    },
    {
      title: "Care Settings",
      icon: "settings",
      data: [
        { label: "Language", value: "English" },
        { label: "Notifications", value: "Enabled" },
      ]
    },
    {
      title: "Progress Overview",
      icon: "trending-up",
      data: [
        { label: "Daily Tasks Completed", value: "8/10" },
        { label: "Weekly Exercise Score", value: "85%" },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    padding: 3,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
