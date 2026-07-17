const mongoose = require('mongoose');

const BallLogSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
  inning: { type: Number, required: true },
  overNumber: { type: Number, required: true }, // e.g., 5
  ballNumber: { type: Number, required: true }, // e.g., 3 (Over 5.3)
  batsman: { type: String, required: true },
  bowler: { type: String, required: true },
  runsScored: { type: Number, required: true },
  extraType: { type: String, enum: ['none', 'wide', 'no-ball', 'bye', 'leg-bye'], default: 'none' },
  isWicket: { type: Boolean, default: false },
  wicketType: { type: String, enum: ['none', 'bowled', 'caught', 'lbw', 'run-out', 'stumped'] }
}, { timestamps: true });

module.exports = mongoose.model('BallLog', BallLogSchema);