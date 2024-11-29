import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function RealTimeTranscription() {
  const [transcript, setTranscript] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {};

  const stopRecording = async () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-Time Transcription</Text>
      <View style={styles.transcriptionContainer}>
        <Text style={styles.transcriptionText}>{transcript}</Text>
      </View>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transcriptionContainer: {
    width: "100%",
    height: 200,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  transcriptionText: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
});
