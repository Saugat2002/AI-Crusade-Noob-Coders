import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function RealTimeTranscription() {
  const [transcript, setTranscript] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    // Request audio permissions
    Audio.requestPermissionsAsync().then(({ granted }) => {
      if (!granted) setError("Audio permission not granted");
    });
  }, []);

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
    } catch (err) {
      setError('Failed to start recording: ' + err);
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
        const destination = `${FileSystem.documentDirectory}${fileName}`;

        // Save the recording
        await FileSystem.moveAsync({
          from: uri,
          to: destination,
        });

        console.log('Recording saved at:', destination);
      }

      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      setError('Failed to stop recording: ' + err);
    }
  };

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
