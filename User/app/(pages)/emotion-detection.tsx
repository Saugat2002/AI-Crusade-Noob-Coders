import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useTranscription } from "@/context/TranscriptionContext";
import axios from "axios";

export default function EmotionDetection() {
  const { accumulatedTranscriptions } = useTranscription();
  // const [emotionData, setEmotionData] = React.useState({
  //   sentiment: {
  //     overall_sentiment: null,
  //     negative_score: null,
  //     positive_score: null,
  //     neutral_score: null,
  //   },
  // } as any);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const textObj = { text: accumulatedTranscriptions };
  //       const response = await axios.post(
  //         `${process.env.EXPO_PUBLIC_API_URI}/sentiment-analysis`,
  //         textObj,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       const result = await response.data;
  //       // console.log("RESULT", result);
  //       const parsedSentiment = JSON.parse(result.sentiment);
  //       console.log("PARSED SENTIMENT", parsedSentiment);

  //       setEmotionData({ sentiment: parsedSentiment });
  //     } catch (err) {
  //       console.log("Emotion generation error:", err);
  //       // Alert.alert("Todo Generation Failed", "Unable to generate todo");
  //     }
  //   };
  //   fetchData();
  // }, []);

  // console.log(emotionData);

  const emotionData = {
    text: "Hello, I am very happy today.",
    sentiment: {
      overall: "positive",
      score: 0.85,
    },
    sentences: [
      {
        text: "Hello, I am very happy today.",
        sentiment: {
          score: 0.85,
          mood: "positive",
        },
      },
    ],
    details: {
      positive: 0.85,
      negative: 0.0,
      neutral: 0.15,
    },
  };

  const moodToEmoji = {
    positive: "😊",
    negative: "😢",
    neutral: "😐",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emotion Detection</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Overall Sentiment:</Text>
        <Text style={styles.value}>
          {moodToEmoji[emotionData.sentiment.overall]}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Score:</Text>
        <Text style={styles.value}>{emotionData.sentiment.score}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Details:</Text>
        <Text style={styles.value}>
          Positive: {emotionData.details.positive}
        </Text>
        <Text style={styles.value}>
          Negative: {emotionData.details.negative}
        </Text>
        <Text style={styles.value}>Neutral: {emotionData.details.neutral}</Text>
      </View>{" "}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#333",
  },
  sentenceContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e9f5ff",
    borderRadius: 8,
  },
  sentenceText: {
    fontSize: 16,
    color: "#333",
  },
  sentenceMood: {
    fontSize: 16,
    color: "#555",
  },
  sentenceScore: {
    fontSize: 16,
    color: "#555",
  },
});

export default EmotionDetection;
