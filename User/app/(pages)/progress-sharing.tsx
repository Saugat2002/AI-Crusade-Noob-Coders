import React from "react";
import { View, Text, Button, StyleSheet, ScrollView, Alert ,Linking} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useUser } from "@/context/UserContext";

export default function ProgressSharing() {
  const { user } = useUser();
  const screenWidth = Dimensions.get("window").width;
  

  const sendEmail = async () => {
    const email = user?.guardiansEmail;
    const subject = `Update on ${user?.fullName} - Recent Performance Decline`;
    const body = `We've noticed a decline in ${user?.fullName}'s recent performance on the app. We recommend consulting their healthcare provider and encouraging continued engagement with the app's activities. \nKind Regards,\nSmaran`;

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No email app installed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to open email app');
    }
  };

  const game_data = {
    games: [
      {
        game: "Memory Match",
        plays: [
          { play_id: 1, flips: 34, time_to_complete: "02:15" },
          { play_id: 2, flips: 40, time_to_complete: "02:45" },
          { play_id: 3, flips: 30, time_to_complete: "01:55" },
          { play_id: 4, flips: 36, time_to_complete: "02:30" },
          { play_id: 5, flips: 42, time_to_complete: "03:00" },
          { play_id: 6, flips: 28, time_to_complete: "01:50" },
          { play_id: 7, flips: 38, time_to_complete: "02:40" },
          { play_id: 8, flips: 35, time_to_complete: "02:20" },
          { play_id: 9, flips: 32, time_to_complete: "02:05" },
          { play_id: 10, flips: 44, time_to_complete: "03:10" },
        ],
      },
      {
        game: "Gaau Khane Katha",
        plays: [
          { play_id: 1, score: 40 },
          { play_id: 2, score: 35 },
          { play_id: 3, score: 38 },
          { play_id: 4, score: 42 },
          { play_id: 5, score: 45 },
          { play_id: 6, score: 37 },
          { play_id: 7, score: 39 },
          { play_id: 8, score: 41 },
          { play_id: 9, score: 36 },
          { play_id: 10, score: 43 },
        ],
      },
      {
        game: "Sudoku",
        plays: [
          { play_id: 1, time_to_complete: "05:30" },
          { play_id: 2, time_to_complete: "06:15" },
          { play_id: 3, time_to_complete: "04:45" },
          { play_id: 4, time_to_complete: "05:00" },
          { play_id: 5, time_to_complete: "06:30" },
          { play_id: 6, time_to_complete: "05:15" },
          { play_id: 7, time_to_complete: "04:50" },
          { play_id: 8, time_to_complete: "05:45" },
          { play_id: 9, time_to_complete: "06:00" },
          { play_id: 10, time_to_complete: "04:30" },
        ],
      },
    ],
  };

  // Helper function to convert time to minutes
  const timeToMinutes = (timeString : any) => {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return parseFloat((minutes + seconds / 60).toFixed(1));
  };

  // Prepare data for Memory Match (flips vs play_id)
  const memoryMatchFlipsData = game_data.games[0].plays.map((play) => ({
    play_id: play.play_id,
    flips: play.flips,
  }));

  // Prepare data for Memory Match (time vs play_id)
  const memoryMatchTimeData = game_data.games[0].plays.map((play) => ({
    play_id: play.play_id,
    time: timeToMinutes(play.time_to_complete),
  }));

  // Prepare data for Gaau Khane Katha (score vs play_id)
  const gaauKhaneKathaScoreData = game_data.games[1].plays.map((play) => ({
    play_id: play.play_id,
    score: play.score,
  }));

  // Prepare data for Sudoku (time vs play_id)
  const sudokuTimeData = game_data.games[2].plays.map((play) => ({
    play_id: play.play_id,
    time: timeToMinutes(play.time_to_complete),
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Game Progress Charts</Text>

        {/* Memory Match Flips Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Memory Match - Flips per Play</Text>
          <LineChart
            data={{
              labels: memoryMatchFlipsData.map((data) =>
                data.play_id.toString()
              ),
              datasets: [
                {
                  data: memoryMatchFlipsData.map((data) => data.flips),
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisSuffix=""
            yAxisInterval={1}
            fromZero={true}
            formatYLabel={(yValue) => parseInt(yValue).toString()}
          />
        </View>

        {/* Memory Match Time Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Memory Match - Time per Play (minutes)
          </Text>
          <LineChart
            data={{
              labels: memoryMatchTimeData.map((data) =>
                data.play_id.toString()
              ),
              datasets: [
                {
                  data: memoryMatchTimeData.map((data) => data.time),
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisSuffix=""
            yAxisInterval={1}
            fromZero={true}
            formatYLabel={(yValue) => parseFloat(yValue).toFixed(1)}
          />
        </View>

        {/* Gaau Khane Katha Score Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Gaau Khane Katha - Score per Play
          </Text>
          <LineChart
            data={{
              labels: gaauKhaneKathaScoreData.map((data) =>
                data.play_id.toString()
              ),
              datasets: [
                {
                  data: gaauKhaneKathaScoreData.map((data) => data.score),
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisSuffix=""
            yAxisInterval={1}
            fromZero={true}
            formatYLabel={(yValue) => parseInt(yValue).toString()}
          />
        </View>

        {/* Sudoku Time Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Sudoku - Time per Play (minutes)
          </Text>
          <LineChart
            data={{
              labels: sudokuTimeData.map((data) => data.play_id.toString()),
              datasets: [
                {
                  data: sudokuTimeData.map((data) => data.time),
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisSuffix=""
            yAxisInterval={1}
            fromZero={true}
            formatYLabel={(yValue) => parseFloat(yValue).toFixed(1)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Notify Guardian"
            onPress={sendEmail}
            color="#6200ee"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  // backgroundColor: "#59f769",
  backgroundGradientFrom: "#5fa365",
  backgroundGradientTo: "#3a8741",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "1",
    stroke: "#ffffff",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
