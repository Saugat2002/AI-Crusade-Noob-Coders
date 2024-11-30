import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import {
    GamepadIcon,
    BrainIcon,
    PuzzleIcon,
    HeartPulseIcon
} from "lucide-react-native";

export default function ProgressSharing() {
    const games = [
        {
            id: 1,
            title: "Memory Match Game",
            description: "Match pairs of cards to train your memory",
            route: "/cognitive-exercises/memory-match",
            icon: BrainIcon
        },
        {
            id: 2,
            title: "Gaau Khane Katha",
            description: "Solve questions to enhance cognitive skills",
            route: "/cognitive-exercises/gaau-khane-katha",
            icon: PuzzleIcon
        },
        {
            id: 3,
            title: "Sudoku",
            description: "Play with numbers",
            route: "/cognitive-exercises/sudoku",
            icon: HeartPulseIcon
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Cognitive Exercises</Text>
                <Text style={styles.subHeader}>Choose a game to challenge your mind</Text>
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
                                    <GameIcon
                                        color="#4A90E2"
                                        size={28}
                                        strokeWidth={2}
                                    />
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
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        color: '#7F8C8D',
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    gameCard: {
        backgroundColor: '#F7F9FC',
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#4A90E2',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    gameCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#E6F2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 5,
    },
    gameDescription: {
        fontSize: 14,
        color: '#7F8C8D',
        lineHeight: 20,
    },
});