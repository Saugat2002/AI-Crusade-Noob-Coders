import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';

const COLORS = {
  background: '#E6F2FF',
  cardBack: '#2196F3',
  cardFront: '#FFFFFF',
  text: '#1565C0',
  matched: '#4CAF50'
};

const cardPairs = [
  { id: 1, value: '🌟' },
  { id: 2, value: '🌙' },
  { id: 3, value: '🌍' },
  { id: 4, value: '🌈' },
  { id: 1, value: '🌟' },
  { id: 2, value: '🌙' },
  { id: 3, value: '🌍' },
  { id: 4, value: '🌈' },
  { id: 5, value: '😭' },
  { id: 5, value: '😭' },
  { id: 6, value: '😊' },
  { id: 6, value: '😊' },
];

export default function MemoryGame() {
  const [cards, setCards] = useState(shuffleCards([...cardPairs]));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [flips, setFlips] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Timer effect
  useEffect(() => {
    let interval;
    if (isGameStarted && !isGameWon) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameStarted, isGameWon]);

  // Win condition check
  useEffect(() => {
    if (matchedPairs.length === cardPairs.length / 2) {
      setIsGameWon(true);
      setIsGameStarted(false);
    }
  }, [matchedPairs]);

  const resetGame = () => {
    setCards(shuffleCards([...cardPairs]));
    setSelectedCards([]);
    setMatchedPairs([]);
    setFlips(0);
    setTime(0);
    setIsGameStarted(false);
    setIsGameWon(false);
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      setFlips(prevFlips => prevFlips + 1);
      
      if (selectedCards[0].id === selectedCards[1].id) {
        setMatchedPairs([...matchedPairs, selectedCards[0].id]);
      }
      setTimeout(() => setSelectedCards([]), 1000);
    }
  }, [selectedCards]);

  const handleCardPress = (card) => {
    // Start the game on first card press
    if (!isGameStarted) {
      setIsGameStarted(true);
    }

    if (selectedCards.length < 2 && !selectedCards.includes(card)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const isCardFlipped = (card) => {
    return selectedCards.includes(card) || matchedPairs.includes(card.id);
  };

  // Format time to minutes and seconds
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match</Text>
      
      {/* Game Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Flips: {flips}</Text>
        <Text style={styles.statsText}>Time: {formatTime(time)}</Text>
      </View>

      <View style={styles.cardGrid}>
        {cards.map((card, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.card, 
              isCardFlipped(card) && styles.cardFlipped,
              matchedPairs.includes(card.id) && styles.matchedCard
            ]}
            onPress={() => handleCardPress(card)}
            disabled={isCardFlipped(card)}
          >
            <Text style={styles.cardText}>
              {isCardFlipped(card) ? card.value : '?'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isGameWon && (
        <View style={styles.winContainer}>
          <Text style={styles.winText}>You Won!</Text>
          <Text style={styles.winDetailsText}>
            Flips: {flips} | Time: {formatTime(time)}
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  statsText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.cardBack,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  cardFlipped: {
    backgroundColor: COLORS.cardFront,
    borderWidth: 2,
    borderColor: COLORS.cardBack,
  },
  matchedCard: {
    backgroundColor: COLORS.matched,
    opacity: 0.5,
  },
  cardText: {
    fontSize: 40,
  },
  winContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  winText: {
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 10,
  },
  winDetailsText: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: COLORS.cardBack,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});