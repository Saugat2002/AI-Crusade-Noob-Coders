import { Schema, model } from "mongoose";


const gameScoreSchema = new Schema({
    gameName: String,
    playerScore: Number,
    timeTaken: Number,
    playedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const gameScore = model("GameScore", gameScoreSchema);

export default gameScore;