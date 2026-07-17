const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ['user', 'admin', 'scorer']
    },
    // ---------- Cricket App Specific Fields ----------
    favoriteTeams: [{
        type: String, // e.g., ["India", "Australia"]
        default: []
    }],
    // Stores match IDs that the user bookmarks (matching your UI bookmark button)
    bookmarkedMatches: [{
        type: String,
        default: []
    }],
    stats: {
        matchesTracked: { type: Number, default: 0 },
        winsPredicted: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);