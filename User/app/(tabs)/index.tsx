import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // Make sure to install expo icons
import texts from "@/utils/texts";
import { useLanguage } from "@/context/LanguageContext";
import { Brain } from "lucide-react-native";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URI}/home`,
          {
            credentials: "include",
          }
        );
        const result = await response.json();
        if (response.status !== 200) {
          console.log(result);
          router.push("/onboarding");
          return;
        }
        setIsLoggedIn(true);
      } catch (err) {
        console.log(err);
        router.push("/onboarding");
      }
    };
    console.log(isLoggedIn);

    fetchData();
  }, []);

  if (!isLoggedIn) {
    return null; // Return null while redirecting
  }

  type Feature = {
    title: string;
    icon:
      | "record-voice-over"
      | "mood"
      | "bookmark"
      | "checklist"
      | "psychology"
      | "people";
    description: string;
    route: string;
  };

  const features: Feature[] = [
    {
      title: texts[language].features.realTimeTranscription.title,
      icon: "record-voice-over",
      description: texts[language].features.realTimeTranscription.description,
      route: "/real-time-transcription",
    },
    {
      title: texts[language].features.emotionDetection.title,
      icon: "mood",
      description: texts[language].features.emotionDetection.description,
      route: "/emotion-detection",
    },
    {
      title: texts[language].features.conversationBookmark.title,
      icon: "bookmark",
      description: texts[language].features.conversationBookmark.description,
      route: "/conversation-bookmark",
    },
    {
      title: texts[language].features.dailyTasks.title,
      icon: "checklist",
      description: texts[language].features.dailyTasks.description,
      route: "/daily-tasks",
    },
    {
      title: texts[language].features.cognitiveExercises.title,
      icon: "psychology",
      description: texts[language].features.cognitiveExercises.description,
      route: "/cognitive-exercises",
    },
    {
      title: texts[language].features.progressSharing.title,
      icon: "people",
      description: texts[language].features.progressSharing.description,
      route: "/progress-sharing",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      <View className="items-center mb-4">
        <Brain 
          color="#ffffff"  // Tailwind blue-600 
          size={100} 
          className="mb-2" 
        />
        <Text style={styles.title}>{texts[language].welcome}</Text>
      </View>
        <Text style={styles.subtitle}>
          {texts[language].welcomeSub}
        </Text>
      </View>

      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => {
              router.push(feature.route as any);
            }}
          >
            <MaterialIcons name={feature.icon} size={40} color="#4A90E2" />
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
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 20,
    backgroundColor: "#4A90E2",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
    marginTop: 8,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: "45%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureTitle: {
    fontSize:22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
});
