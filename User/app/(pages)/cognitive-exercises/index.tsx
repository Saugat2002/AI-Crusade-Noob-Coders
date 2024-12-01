import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import {
  GamepadIcon,
  BrainIcon,
  PuzzleIcon,
  HeartPulseIcon,
  Book,
  BookAIcon,
} from "lucide-react-native";
import SudokuGame from "./sudoku";
import texts from "@/utils/texts";
import { useLanguage } from "@/context/LanguageContext";

export default function ProgressSharing() {
  const { language } = useLanguage();

  const games = [
    {
      id: 1,
      title: texts[language].memoryMatchGame,
      description: texts[language].memoryMatchDescription,
      route: "/cognitive-exercises/memory-match",
      icon: BrainIcon,
    },
    {
      id: 2,
      title: texts[language].gaauKhaneKatha,
      description: texts[language].gaauKhaneKathaDescription,
      route: "/cognitive-exercises/gaau-khane-katha",
      icon: BookAIcon,
    },
    {
      id: 3,
      title: texts[language].sudoku,
      description: texts[language].sudokuDescription,
      route: "/cognitive-exercises/sudoku",
      icon: PuzzleIcon,
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{texts[language].cognitiveExercises}</Text>
        <Text style={styles.subHeader}>
          {texts[language].chooseGame}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {games.map((game) => {
          const GameIcon = game.icon;
          return (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={() => router.push(game.route)}
            >
              <View style={styles.gameCardContent}>
                <View style={styles.iconContainer}>
                  <GameIcon color="#4A90E2" size={28} strokeWidth={2} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <Text style={styles.gameDescription}>{game.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 22,
    color: "#7F8C8D",
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gameCard: {
    backgroundColor: "#F7F9FC",
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  gameCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#E6F2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 23,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 5,
  },
  gameDescription: {
    fontSize: 18,
    color: "#7F8C8D",
    lineHeight: 20,
  },
});
