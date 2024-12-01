import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { useTranscription } from "@/context/TranscriptionContext";
import texts from "@/utils/texts";

export default function RealTimeTranscription() {
  const { user } = useUser();
  const { language } = useLanguage();
  const { addTranscription } = useTranscription();
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const [todos, setTodos] = useState([]);

  // Backend API URL - replace with your actual backend URL
  const API_URL = process.env.EXPO_PUBLIC_API_URI;

  useEffect(() => {
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
      setError("Failed to start recording: " + err);
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
      const result = await response.data.transcript;
      // console.log("Response:", result);
      return result;
    } catch (err) {
      console.error("Transcription error:", err);
      Alert.alert("Transcription Failed", "Unable to transcribe audio");
    }
  };

  const generateTodo = async (transcript: any) => {
    try {
      // console.log("Transcription: ", transcript);
      const textObj = { text: transcript };
      const response = await axios.post(`${API_URL}/generate-todos`, textObj, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.data;
      console.log("Result:", result);
      return response.data;
    } catch (err) {
      console.error("Todo generation error:", err);
      // Alert.alert("Todo Generation Failed", "Unable to generate todo");
    }
  };

  const changeTranscript = (transcript: string) => {
    setTranscript(transcript);
    return;
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
        const result = await transcribeAudio(destination);
        console.log("Result", result);
        if (result) {
          changeTranscript(result);
          addTranscription(result);
        }
        const todos = await generateTodo(result);
        console.log("Todos:", todos);
        let newTodos;
        if (language === "english") {
          newTodos = todos.todosEnglish;
        } else {
          newTodos = todos.todosNepali;
        }
        console.log("New Todos:", newTodos);
        for (let i = 0; i < newTodos.length; i++) {
          const todo = newTodos[i];
          console.log("Todo:", i, todo);

          const request = new Request(
            `${process.env.EXPO_PUBLIC_SERVER_URI}/addTask`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: user?._id,
                task: todo.task,
                time: todo.time,
                completed: todo.completed,
                priority: todo.priority,
                category: todo.category,
              }),
              credentials: "include",
            }
          );
          try {
            const response = await fetch(request);
            const result = await response.json();
            if (response.status !== 201) {
              console.log(result.message);
              return;
            }
            Alert.alert("Task Added", "Task added successfully");
            console.log("Task added successfully");
          } catch (err) {
            console.error("Error creating task:", err);
          }
        }
      }

      setRecording(null);
    } catch (err) {
      setError("Failed to stop recording: " + err);
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{texts[language].realTimeTranscription}</Text>
      <View style={styles.transcriptionContainer}>
        <Text style={styles.transcriptionText}>
          {transcript || texts[language].transcriptionPlaceholder}
        </Text>
      </View>
      <View className="flex flex-row h-10 mx-16 gap-7 justify-between items-start">
        <TextInput
          style={styles.input}
          placeholder={texts[language].typeHere}
          onChangeText={(text) => setTranscript(text)}
          value={transcript || ""}
          className=""
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={async () => {
            if (transcript) {
              const todos = await generateTodo(transcript);
              console.log("Todos:", todos);
              let newTodos;
              if (language === "english") {
                newTodos = todos.todosEnglish;
              } else {
                newTodos = todos.todosNepali;
              }
              console.log("New Todos:", newTodos);
              for (let i = 0; i < newTodos.length; i++) {
                const todo = newTodos[i];
                console.log("Todo:", i, todo);

                const request = new Request(
                  `${process.env.EXPO_PUBLIC_SERVER_URI}/addTask`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userId: user?._id,
                      task: todo.task,
                      time: todo.time,
                      completed: todo.completed,
                      priority: todo.priority,
                      category: todo.category,
                    }),
                    credentials: "include",
                  }
                );
                try {
                  const response = await fetch(request);
                  const result = await response.json();
                  if (response.status !== 201) {
                    console.log(result.message);
                    return;
                  }
                  Alert.alert("Task Added", "Task added successfully");
                  console.log("Task added successfully");
                } catch (err) {
                  console.error("Error creating task:", err);
                }
              }
            } else {
              Alert.alert(
                "No Transcript",
                "Please provide a transcript to send."
              );
            }
          }}
        >
          <Text style={styles.sendButtonText}>{texts[language].send}</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        className="mt-10 px-5 w-16"
        style={styles.button}
      >
        <Text style={styles.sendButtonText}>
          {isRecording ? texts[language].stopRecording : texts[language].startRecording}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sendButtonText: {
    color: "#fff",
  },
  sendButton: {
    width: "30%",
    height: 40,
    borderRadius: 8,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  },
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
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
});
