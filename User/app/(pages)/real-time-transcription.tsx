import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import axios from "axios";

export default function RealTimeTranscription() {
  const [transcript, setTranscript] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  // Backend API URL - replace with your actual backend URL
  const API_URL = "http://192.168.10.170:9000";

  useEffect(() => {
    console.log(transcript);

    // Request audio permissions
    (async () => {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) setError("Audio permission not granted");
    })();

    return () => {
      // Cleanup
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [transcript]);

  const startRecording = async () => {
    try {
      // Configure audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create recording instance
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setTranscript(""); // Clear previous transcript
    } catch (err) {
      setError("Failed to start recording: " + err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        // Create a unique filename
        const fileName = `recording-${Date.now()}.mp3`;
        const destination = `${FileSystem.cacheDirectory}${fileName}`;

        // Save the recording
        await FileSystem.moveAsync({
          from: uri,
          to: destination,
        });

        setRecordingUri(destination);
        setIsRecording(false);

        // Send audio to backend for transcription
        await transcribeAudio(destination);
        await generateTodo();
      }

      setRecording(null);
    } catch (err) {
      setError("Failed to stop recording: " + err);
    }
  };

  const transcribeAudio = async (audioUri: string) => {
    try {
      // Create form data to send audio file
      const formData = new FormData();
      formData.append("file", {
        uri: audioUri,
        type: "audio/mp3",
        name: `recording-${Date.now()}.mp3`,
      } as any);

      console.log("Sending to URL:", API_URL);
      // Send to backend
      const response = await axios.post(`${API_URL}/transcribe`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log("Response:", response.data);
      setTranscript(response.data.transcript);
    } catch (err) {
      console.error("Transcription error:", err);
      Alert.alert("Transcription Failed", "Unable to transcribe audio");
    }
  };

  const generateTodo = async () => {
    try {
      if (!transcript){
        console.log("No transcript to generate todos");
        return
      };
      const response = await axios.post(
        `${API_URL}/generate-todos`,
        transcript,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      console.log("Result:", response);
    } catch (err) {
      console.error("Todo generation error:", err);
      // Alert.alert("Todo Generation Failed", "Unable to generate todo");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-Time Transcription</Text>
      <View style={styles.transcriptionContainer}>
        <Text style={styles.transcriptionText}>
          {transcript || "Transcription will appear here"}
        </Text>
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
