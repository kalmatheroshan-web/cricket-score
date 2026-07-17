const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    shortName: { type: String, required: true, uppercase: true }, // e.g., "IND"
    logoUrl: { type: String }, // Optional URL to team crest/flag
    players: [{
        name: { type: String, required: true },
        role: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'] }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);