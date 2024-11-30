import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";

export default function ProgressSharing() {
    // Array of 100 riddles
    const riddles = [
        { id: "1", question: "आगि बलेको धुवाँ छैन, के होला?", options: ["पिपलको बोट", "आगो", "धुवाँ", "चुरा"], answer: "पिपलको बोट" },
        { id: "2", question: "दश खोले पसे, एउटा पाउ नसे, के होला?", options: ["मसाल", "चुरा", "मकै", "काग"], answer: "चुरा" },
        { id: "3", question: "छोरा पिट्दा बाबु रुन्छ, के होला?", options: ["ढोल", "मादल", "टाँगा", "घण्टी"], answer: "मादल" },
        { id: "4", question: "दुई मुख छ, चार कान, दाँत छैन, के होला?", options: ["पशु", "मसाल", "पिपलको बोट", "घडी"], answer: "मसाल" },
        { id: "5", question: "आफ्नो सरे अर्कोको पर्‍यो, के होला?", options: ["मकैको घोगा", "टोकरी", "घण्टी", "खेत"], answer: "मकैको घोगा" },
        { id: "6", question: "सात समुद्र पारी के उभिन्छ?", options: ["काँध", "आँसु", "भूत", "छाया"], answer: "छाया" },
        { id: "7", question: "के छ कानले नसुन्ने, आँखाले नदेख्ने?", options: ["सपना", "चन्द्रमा", "आकाश", "मुटु"], answer: "सपना" },
        { id: "8", question: "पानीमा पौडिन्छ तर भिज्दैन, के होला?", options: ["छाया", "माछा", "डुंगा", "पात"], answer: "छाया" },
        { id: "9", question: "जति खायो उति भोक, के होला?", options: ["आगो", "पानी", "हावा", "माटो"], answer: "आगो" },
        { id: "10", question: "टाउको छैन टोपी लगाउँछ, के होला?", options: ["सिसाकलम", "कलम", "काठको किला", "बत्ती"], answer: "सिसाकलम" },
        { id: "11", question: "एउटा रुखमा बाह्र हाँगा, के होला?", options: ["बाह्र महिना", "चरा", "फल", "पात"], answer: "बाह्र महिना" },
        { id: "12", question: "काला दाजु गोरा भाइ, के होला?", options: ["दिन र रात", "आकाश", "बादल", "तारा"], answer: "दिन र रात" },
        { id: "13", question: "हजार टाउका एउटै जिउ, के होला?", options: ["कपाल", "झ्याल", "खेत", "बाटो"], answer: "कपाल" },
        { id: "14", question: "बिहान चार खुट्टा, दिउँसो दुई खुट्टा, बेलुका तीन खुट्टा, के होला?", options: ["मान्छे", "जनावर", "चरा", "रुख"], answer: "मान्छे" },
        { id: "15", question: "आमा एक्लै छोरा सय, के होला?", options: ["कुखुरा र चल्ला", "माछा", "चरा", "फूल"], answer: "कुखुरा र चल्ला" },
        { id: "16", question: "नजन्मिदै बुढो हुन्छ, के होला?", options: ["धुवाँ", "बादल", "कपाल", "आगो"], answer: "धुवाँ" },
        { id: "17", question: "जन्मिने बित्तिकै दौडन्छ, के होला?", options: ["पानी", "हावा", "आगो", "बिजुली"], answer: "पानी" },
        { id: "18", question: "बोल्दैन तर सबैलाई जगाउँछ, के होला?", options: ["भाले", "घण्टी", "सूर्य", "चन्द्रमा"], answer: "घण्टी" },
        { id: "19", question: "पानी बिना पनि पौडिन्छ, के होला?", options: ["माछा", "सपना", "कल्पना", "विचार"], answer: "सपना" },
        { id: "20", question: "हात छैन लेख्छ, मुख छैन बोल्छ, के होला?", options: ["कलम", "किताब", "पत्र", "कागज"], answer: "कलम" },
        { id: "21", question: "सपना हो तर कहिल्यै सकिंदैन, के होला?", options: ["आकाश", "सागर", "कल्पना", "चन्द्रमा"], answer: "कल्पना" },
        { id: "22", question: "न हावा, न पानी, न आगो, तर बल्दछ, के होला?", options: ["मन", "कल्पना", "इच्छा", "सूर्य"], answer: "मन" },
        { id: "23", question: "आकाशबाट खस्दा भुइँमै हराउँछ, के होला?", options: ["शीत", "हिउँ", "पानी", "ओस"], answer: "शीत" },
        { id: "24", question: "जहाँ पुगे पनि खाली हुन्छ, के होला?", options: ["जुत्ता", "गाग्री", "कचौरा", "झोला"], answer: "जुत्ता" },
        { id: "25", question: "घरभित्र घर, भित्र एक बत्ती बल्दछ, के होला?", options: ["मकै", "लामखुट्टे", "अण्डा", "मैनबत्ती"], answer: "अण्डा" },
        { id: "26", question: "चार पाउ, सिंग छैन, दूध दिन्छ, के होला?", options: ["गाई", "भैँसी", "घोडा", "मान्छे"], answer: "गाई" },
        { id: "27", question: "खसीको बच्चा, रगत छैन, के होला?", options: ["नरिवल", "अण्डा", "फल", "कुखुरा"], answer: "नरिवल" },
        { id: "28", question: "जन्मिंदा सेतो, बाँचेपछि कालो, मरेपछि रातो, के होला?", options: ["लालमो", "फलाम", "दियालो", "गहुँ"], answer: "फलाम" },
        { id: "29", question: "जति काट्यो उति नै बढ्छ, के होला?", options: ["घाँस", "कपाल", "पानी", "पात"], answer: "कपाल" },
        { id: "30", question: "दुई आँखा तर हेर्न सक्दैन, के होला?", options: ["सुगर", "आलु", "टमाटर", "पुतली"], answer: "सुगर" },
        { id: "31", question: "न बाँसको घर, न काठको, बत्ती बल्दछ, के होला?", options: ["जुग्नू", "घाम", "चन्द्रमा", "तारा"], answer: "जुग्नू" },
        { id: "32", question: "जति पिए पनि कम हुँदैन, के होला?", options: ["ज्ञान", "पानी", "माया", "चिया"], answer: "ज्ञान" },
        { id: "33", question: "आफूलाई चिन्न सक्दैन, सबैलाई चिनाउँछ, के होला?", options: ["ऐना", "पानी", "छाया", "प्रकाश"], answer: "ऐना" },
        { id: "34", question: "गाउँमा छेउमा बस्छ, सबैलाई गाउँने गीत सुनाउँछ, के होला?", options: ["रेडियो", "पन्छी", "घण्टी", "भाले"], answer: "रेडियो" },
        { id: "35", question: "छिनभरमै हजारै यात्रा गर्छ, के होला?", options: ["बिजुली", "कल्पना", "हावा", "सपना"], answer: "बिजुली" },
        { id: "36", question: "दिनभर तातो, रातभर चिसो, के होला?", options: ["भुइँ", "पानी", "ढुङ्गा", "बालुवा"], answer: "बालुवा" },
        { id: "37", question: "कहिले चिल्लो, कहिले खाल्टो, कहिले उकालो, कहिले ओरालो, के होला?", options: ["बाटो", "रुख", "कुटी", "दिया"], answer: "बाटो" },
        { id: "38", question: "छुने भए खस्छ, हेर्ने भए जाँदैन, के होला?", options: ["तारा", "आकाश", "छाया", "जुनेली"], answer: "छाया" },
        { id: "39", question: "दिनरात घुमिरहन्छ, के होला?", options: ["घडी", "पृथ्वी", "सूर्य", "चन्द्रमा"], answer: "घडी" },
        { id: "40", question: "घाम लाग्दा हराउँछ, पानी परे झर्छ, के होला?", options: ["हिउँ", "शीत", "छाया", "ओस"], answer: "शीत" },
        { id: "41", question: "कहिले ओइलाउँछ, कहिले हराउँछ, तर कहिल्यै मर्दैन, के होला?", options: ["झरना", "आकाश", "पानी", "सागर"], answer: "पानी" },
        { id: "42", question: "माथि जाउँ, तल जान्छु, तल जाउँ, माथि जान्छु, के होला?", options: ["बाल्टी", "घाम", "झरना", "झूला"], answer: "बाल्टी" },
        { id: "43", question: "बिना खुट्टा दौडिन्छ, के होला?", options: ["हावा", "पानी", "सपना", "बिजुली"], answer: "हावा" },
        { id: "44", question: "न पानी, न हावा, तर बल्दछ, के होला?", options: ["चन्द्रमा", "मुटु", "सपना", "कल्पना"], answer: "कल्पना" },
        { id: "45", question: "जसलाई सबैले छोप्न खोज्छन्, तर छोप्न सक्दैनन्, के होला?", options: ["आकाश", "हावा", "तारा", "सूर्य"], answer: "आकाश" }
    ];


    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [questionsAsked, setQuestionsAsked] = useState([]);
    const [currentRiddle, setCurrentRiddle] = useState(null);
    const [gameOverModalVisible, setGameOverModalVisible] = useState(false);

    const getRandomRiddle = () => {
        const remainingRiddles = riddles.filter((riddle) => !questionsAsked.includes(riddle.id));
        if (remainingRiddles.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * remainingRiddles.length);
        return remainingRiddles[randomIndex];
    };

    const startNextQuestion = () => {
        const riddle = getRandomRiddle();
        if (riddle) {
            setCurrentRiddle(riddle);
            setQuestionsAsked([...questionsAsked, riddle.id]);
        } else {
            Alert.alert("क्विज समाप्त!", `तपाईंको स्कोर: ${score}`);
            resetGame();
        }
    };

    const handleAnswer = (selectedOption) => {
        if (!currentRiddle) return;

        if (selectedOption === currentRiddle.answer) {
            setScore(score + 1);
            Alert.alert("सही उत्तर!", "तपाईंले सही जवाफ दिनुभयो। 🎉");
        } else {
            const newLives = lives - 1;
            setLives(newLives);
            Alert.alert("गलत उत्तर!", `सही उत्तर: ${currentRiddle.answer}`);

            if (newLives === 0) {
                setGameOverModalVisible(true);
            } else {
                startNextQuestion();
            }
        }
    };

    const resetGame = () => {
        setLives(3);
        setScore(0);
        setQuestionsAsked([]);
        setCurrentRiddle(null);
        setGameOverModalVisible(false);
        startNextQuestion();
    };

    React.useEffect(() => {
        startNextQuestion(); // Start the first question when the game loads
    }, []);

    return (
        <View style={styles.container}>
            {currentRiddle ? (
                <>
                    <Text style={styles.title}>Gaau-Khane-Katha Quiz</Text>
                    <Text style={styles.question}>
                        Q: {currentRiddle.question}
                    </Text>
                    <View style={styles.optionsContainer}>
                        {currentRiddle.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.optionButton}
                                onPress={() => handleAnswer(option)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.lives}>Remaining Lives: {lives}</Text>
                    <Text style={styles.score}>Current Score: {score}</Text>
                </>
            ) : (
                <Text style={styles.message}>Loading...</Text>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={gameOverModalVisible}
                onRequestClose={() => setGameOverModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Game Over!</Text>
                        <Text style={styles.modalScore}>Your Score: {score}</Text>
                        <TouchableOpacity
                            style={styles.playAgainButton}
                            onPress={resetGame}
                        >
                            <Text style={styles.playAgainText}>Play Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "80%",
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#2c3e50",
    },
    modalScore: {
        fontSize: 20,
        marginBottom: 25,
        color: "#3498db",
    },
    playAgainButton: {
        backgroundColor: "#3498db",
        borderRadius: 10,
        padding: 15,
        width: "100%",
        alignItems: "center",
    },
    playAgainText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#E6F2FF", // Light blue-gray background
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#1a5f7a", // Deep blue color for title
        textShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow for depth
    },
    question: {
        fontSize: 20,
        marginBottom: 30,
        textAlign: "center",
        color: "#2c3e50", // Dark blue-gray for question text
        lineHeight: 30,
        fontWeight: "500",
    },
    optionsContainer: {
        marginTop: 20,
    },
    optionButton: {
        backgroundColor: "#ffffff", // White background for options
        padding: 15,
        marginVertical: 10,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#3498db", // Bright blue border
        shadowColor: "#2980b9", // Shadow for 3D effect
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        transition: "transform 0.2s", // Smooth transform for press effect
    },
    optionButtonPressed: {
        transform: [{ scale: 0.95 }], // Slight press effect
    },
    optionText: {
        fontSize: 18,
        textAlign: "center",
        color: "#2c3e50", // Dark blue-gray text
        fontWeight: "600",
    },
    lives: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 25,
        color: "#e74c3c", // Vibrant red for lives
        letterSpacing: 1,
    },
    score: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 15,
        color: "#27ae60", // Green color for score
        letterSpacing: 1,
    },
    message: {
        fontSize: 22,
        textAlign: "center",
        color: "#34495e", // Subdued blue-gray for message
        fontWeight: "500",
    },
});