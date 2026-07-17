const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Live', 'Completed'], 
    default: 'Upcoming' 
  },
  dateTime: { type: Date, required: true }, // Schedule time
  venue: { type: String, required: true },
  
  // Scorer Assignment (Security: Only this user ID can modify scores)
  assignedScorer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Live Scoring Data
  score: {
    team1Score: {
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      overs: { type: Number, default: 0 }
    },
    team2Score: {
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      overs: { type: Number, default: 0 }
    },
    currentInnings: { type: Number, default: 1 }, // 1 or 2
    battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    bowlingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  },
  
  result: {
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    margin: { type: String } // e.g., "India won by 4 wickets"
  }
}, { timestamps: true });

module.exports = mongoose.model('Match', MatchSchema);