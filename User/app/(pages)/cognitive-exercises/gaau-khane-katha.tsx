import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function ProgressSharing() {
  // Array of questions with four options
  const riddles = [
    {
      id: "1",
      question: "आगि बलेको धुवाँ छैन, के होला?",
      options: ["पिपलको बोट", "आगो", "धुवाँ", "चुरा"],
      answer: "पिपलको बोट",
    },
    {
      id: "2",
      question: "दश खोले पसे, एउटा पाउ नसे, के होला?",
      options: ["मसाल", "चुरा", "मकै", "काग"],
      answer: "चुरा",
    },
    {
      id: "3",
      question: "छोरा पिट्दा बाबु रुन्छ, के होला?",
      options: ["ढोल", "मादल", "टाँगा", "घण्टी"],
      answer: "मादल",
    },
    {
      id: "4",
      question: "दुई मुख छ, चार कान, दाँत छैन, के होला?",
      options: ["पशु", "मसाल", "पिपलको बोट", "घडी"],
      answer: "मसाल",
    },
    {
      id: "5",
      question: "आफ्नो सरे अर्कोको पर्‍यो, के होला?",
      options: ["मकैको घोगा", "टोकरी", "घण्टी", "खेत"],
      answer: "मकैको घोगा",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (selectedOption) => {
    const currentRiddle = riddles[currentIndex];
    if (selectedOption === currentRiddle.answer) {
      setScore(score + 1);
      Alert.alert("सही उत्तर!", "तपाईंले सही जवाफ दिनुभयो। 🎉");
    } else {
      Alert.alert("गलत उत्तर!", `सही उत्तर: ${currentRiddle.answer}`);
    }

    // Move to the next question or end quiz
    if (currentIndex < riddles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert(
        "क्विज समाप्त!",
        `तपाईंको स्कोर: ${score + (selectedOption === currentRiddle.answer ? 1 : 0)} / ${
          riddles.length
        }`
      );
      setCurrentIndex(0);
      setScore(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gaau-Khane-Katha Quiz</Text>
      <Text style={styles.question}>
        Q: {riddles[currentIndex].question}
      </Text>
      <View style={styles.optionsContainer}>
        {riddles[currentIndex].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: "#e6f7ff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: "#007acc",
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});
