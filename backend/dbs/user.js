const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: "user",
        enum: ['user', 'admin', 'scorer']
    },

    // ---------- Cricket App Specific Fields ----------
    favoriteTeams: [{
        type: String,          // e.g., "India", "RCB", "Australia"
    }],

    bookmarkedMatches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'           // Better to reference Match model
    }],

    venues: [{
        type: String,
    }],

    state: {
        type: String,
        trim: true,
        enum: [
            "Andhra Pradesh",
            "Arunachal Pradesh",
            "Assam",
            "Bihar",
            "Chhattisgarh",
            "Goa",
            "Gujarat",
            "Haryana",
            "Himachal Pradesh",
            "Jharkhand",
            "Karnataka",
            "Kerala",
            "Madhya Pradesh",
            "Maharashtra",
            "Manipur",
            "Meghalaya",
            "Mizoram",
            "Nagaland",
            "Odisha",
            "Punjab",
            "Rajasthan",
            "Sikkim",
            "Tamil Nadu",
            "Telangana",
            "Tripura",
            "Uttar Pradesh",
            "Uttarakhand",
            "West Bengal",
            // Union Territories
            "Andaman and Nicobar Islands",
            "Chandigarh",
            "Dadra and Nagar Haveli and Daman and Diu",
            "Delhi",
            "Jammu and Kashmir",
            "Ladakh",
            "Lakshadweep",
            "Puducherry"
        ]
    },

    stats: {
        matchesTracked: { type: Number, default: 0 },
        winsPredicted: { type: Number, default: 0 }
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);