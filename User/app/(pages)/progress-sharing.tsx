import React from 'react';
import { Button } from 'react-native-paper';
import { ResponsiveContainer, LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar } from 'recharts';

export default function ProgressSharing() {
  const game_data = {
    "games": [
      {
        "game": "Memory Match",
        "plays": [
          { "play_id": 1, "flips": 34, "time_to_complete": "02:15" },
          { "play_id": 2, "flips": 40, "time_to_complete": "02:45" },
          { "play_id": 3, "flips": 30, "time_to_complete": "01:55" },
          { "play_id": 4, "flips": 36, "time_to_complete": "02:30" },
          { "play_id": 5, "flips": 42, "time_to_complete": "03:00" },
          { "play_id": 6, "flips": 28, "time_to_complete": "01:50" },
          { "play_id": 7, "flips": 38, "time_to_complete": "02:40" },
          { "play_id": 8, "flips": 35, "time_to_complete": "02:20" },
          { "play_id": 9, "flips": 32, "time_to_complete": "02:05" },
          { "play_id": 10, "flips": 44, "time_to_complete": "03:10" }
        ]
      },
      {
        "game": "Gaau Khane Katha",
        "plays": [
          { "play_id": 1, "score": 40 },
          { "play_id": 2, "score": 35 },
          { "play_id": 3, "score": 38 },
          { "play_id": 4, "score": 42 },
          { "play_id": 5, "score": 45 },
          { "play_id": 6, "score": 37 },
          { "play_id": 7, "score": 39 },
          { "play_id": 8, "score": 41 },
          { "play_id": 9, "score": 36 },
          { "play_id": 10, "score": 43 }
        ]
      },
      {
        "game": "Sudoku",
        "plays": [
          { "play_id": 1, "time_to_complete": "05:30" },
          { "play_id": 2, "time_to_complete": "06:15" },
          { "play_id": 3, "time_to_complete": "04:45" },
          { "play_id": 4, "time_to_complete": "05:00" },
          { "play_id": 5, "time_to_complete": "06:30" },
          { "play_id": 6, "time_to_complete": "05:15" },
          { "play_id": 7, "time_to_complete": "04:50" },
          { "play_id": 8, "time_to_complete": "05:45" },
          { "play_id": 9, "time_to_complete": "06:00" },
          { "play_id": 10, "time_to_complete": "04:30" }
        ]
      }
    ]
  };

  // Helper function to convert time to minutes
  const timeToMinutes = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes + seconds / 60;
  };

  // Prepare data for Memory Match (flips vs play_id)
  const memoryMatchFlipsData = game_data.games[0].plays.map(play => ({
    play_id: play.play_id,
    flips: play.flips
  }));

  // Prepare data for Memory Match (time vs play_id)
  const memoryMatchTimeData = game_data.games[0].plays.map(play => ({
    play_id: play.play_id,
    time: timeToMinutes(play.time_to_complete)
  }));

  // Prepare data for Gaau Khane Katha (score vs play_id)
  const gaauKhaneKathaScoreData = game_data.games[1].plays.map(play => ({
    play_id: play.play_id,
    score: play.score
  }));

  // Prepare data for Sudoku (time vs play_id)
  const sudokuTimeData = game_data.games[2].plays.map(play => ({
    play_id: play.play_id,
    time: timeToMinutes(play.time_to_complete)
  }));

  return (

    <div
      className="h-screen overflow-y-scroll bg-gray-100 p-4"
      style={{
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        scrollbarWidth: 'thin', // Thin scrollbar for Firefox
        scrollbarColor: 'rgba(0,0,0,0.3) transparent' // Scrollbar color
      }}
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4 text-center sticky top-0 bg-gray-100 z-10 pb-2">Game Progress Charts</h1>

        {/* Memory Match Flips Chart */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Memory Match - Flips per Play</h2>
          <div className="bg-white rounded-lg p-2 shadow-md">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={memoryMatchFlipsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="play_id"
                  label={{ value: 'Play ID', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  label={{ value: 'Flips', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  labelStyle={{ fontSize: 12 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 10 }}
                />
                <Line type="monotone" dataKey="flips" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory Match Time Chart */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Memory Match - Time per Play (minutes)</h2>
          <div className="bg-white rounded-lg p-2 shadow-md">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={memoryMatchTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="play_id"
                  label={{ value: 'Play ID', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  label={{ value: 'Time (minutes)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  labelStyle={{ fontSize: 12 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 10 }}
                />
                <Line type="monotone" dataKey="time" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gaau Khane Katha Score Chart */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Gaau Khane Katha - Score per Play</h2>
          <div className="bg-white rounded-lg p-2 shadow-md">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={gaauKhaneKathaScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="play_id"
                  label={{ value: 'Play ID', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  labelStyle={{ fontSize: 12 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 10 }}
                />
                <Line type="monotone" dataKey="score" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sudoku Time Chart */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Sudoku - Time per Play (minutes)</h2>
          <div className="bg-white rounded-lg p-2 shadow-md">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sudokuTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="play_id"
                  label={{ value: 'Play ID', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  label={{ value: 'Time (minutes)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  labelStyle={{ fontSize: 12 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 10 }}
                />
                <Line type="monotone" dataKey="time" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="text-center mt-8">
          <Button
            mode="contained"
            // onPress={}
            style={{
              backgroundColor: '#6200ee',
              padding: 10,
              borderRadius: 5
            }}
          >
            Notify Guardian
          </Button>
        </div>
      </div>
    </div>



  );
}