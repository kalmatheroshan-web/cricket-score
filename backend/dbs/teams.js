const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamName: { type: String, required: true, unique: true, trim: true },
    shortName: { type: String, required: true, uppercase: true, trim: true },
    logoUrl: { type: String },
    players: [{
        name: { type: String, required: true },
        jerseyNumber: { type: Number, required: false },
        role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'] }
    }],
    stats: {
        matchesPlayed: { type: Number, default: 0 },
        matchesWon: { type: Number, default: 0 },
        matchesLost: { type: Number, default: 0 },
    },
    // team owner rcb may be srk
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);