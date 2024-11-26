import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons'; // Make sure to install expo icons

export default function Index() {
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

  const features = [
    { title: "Real-time Transcription", icon: "record-voice-over", description: "Convert speech to text instantly" },
    { title: "Emotion Detection", icon: "mood", description: "Track mood changes and emotional well-being" },
    { title: "Conversation Bookmark", icon: "bookmark", description: "Save and revisit meaningful conversations" },
    { title: "Daily Tasks", icon: "checklist", description: "AI-generated to-do lists and reminders" },
    { title: "Cognitive Exercises", icon: "psychology", description: "Brain games for mental stimulation" },
    { title: "Progress Sharing", icon: "people", description: "Keep family updated on condition" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Dementia Care</Text>
        <Text style={styles.subtitle}>Your AI-Powered Dementia Support Companion</Text>
      </View>

      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <TouchableOpacity key={index} style={styles.featureCard}>
            <MaterialIcons name={feature.icon} size={32} color="#4A90E2" />
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});
