const Match = require('../dbs/match');
const User = require('../dbs/user');

/**
 * 1. CREATE MATCH FIXTURE (Upcoming Match)
 */
async function createMatch(req, res) {
    try {
        const { team1, team2, dateTime, venue, assignedScorer } = req.body;

        if (!team1 || !team2 || !dateTime || !venue) {
            return res.status(400).json({ success: false, message: 'Missing required fixture fields.' });
        }

        const newMatch = new Match({
            team1,
            team2,
            dateTime,
            venue,
            assignedScorer,
            status: 'Upcoming',
            score: {
                team1Score: { runs: 0, wickets: 0, overs: 0 },
                team2Score: { runs: 0, wickets: 0, overs: 0 },
                currentInnings: 1,
                battingTeam: team1, // Defaults to team1 starting
                bowlingTeam: team2
            }
        });

        const savedMatch = await newMatch.save();
        res.status(201).json({ success: true, data: savedMatch });
    } catch (error) {
        console.error("Error creating match:", error);
        res.status(500).json({ success: false, message: 'Error creating match', error: error.message });
    }
}

/**
 * 2. LAUNCH MATCH (Initialize active lineup from Admin Roster)
 */
async function launchMatch(req, res) {
    try {
        const { id } = req.body;
        const { selectedBatsman, selectedBowler, battingTeamId, bowlingTeamId } = req.body;

        const updatedMatch = await Match.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: 'Live',
                    'score.battingTeam': battingTeamId,
                    'score.bowlingTeam': bowlingTeamId,
                    'score.currentStriker': selectedBatsman,
                    'score.currentBowler': selectedBowler
                }
            },
            { new: true }
        ).populate('team1 team2');

        if (!updatedMatch) {
            return res.status(404).json({ success: false, message: 'Match fixture not found.' });
        }

        res.status(200).json({ success: true, data: updatedMatch });
    } catch (error) {
        console.error("Error launching match:", error);
        res.status(500).json({ success: false, message: 'Error launching match', error: error.message });
    }
}

/**
 * 3. UPDATE LIVE SCORE (Runs, Wickets, Overs)
 */
async function updateLiveScore(req, res) {
    try {
        const { id } = req.params;
        const { runs, wickets, overs, currentInnings, currentStriker, currentBowler } = req.body;

        const match = await Match.findById(id);
        if (!match) return res.status(404).json({ success: false, message: 'Match context not found.' });
        if (match.status !== 'Live') {
            return res.status(400).json({ success: false, message: 'Cannot adjust scores on an inactive match.' });
        }

        // Target the score subdocument for whichever team is currently batting
        const targetScoreField = match.score.currentInnings === 1 ? 'score.team1Score' : 'score.team2Score';

        const updatePayload = {
            $set: {
                [`${targetScoreField}.runs`]: runs,
                [`${targetScoreField}.wickets`]: wickets,
                [`${targetScoreField}.overs`]: overs,
            }
        };

        if (currentInnings) updatePayload.$set['score.currentInnings'] = currentInnings;
        if (currentStriker) updatePayload.$set['score.currentStriker'] = currentStriker;
        if (currentBowler) updatePayload.$set['score.currentBowler'] = currentBowler;

        const updatedMatch = await Match.findByIdAndUpdate(id, updatePayload, { new: true });
        res.status(200).json({ success: true, data: updatedMatch });
    } catch (error) {
        console.error("Error updating live score:", error);
        res.status(500).json({ success: false, message: 'Error updating live score', error: error.message });
    }
}

/**
 * 4. GET ALL MATCHES (With optional ?status= filter)
 */
async function getMatches(req, res) {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const matches = await Match.find(filter)
            .populate('team1 team2')
            .sort({ dateTime: -1 });

        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        console.error("Error retrieving matches:", error);
        res.status(500).json({ success: false, message: 'Error fetching matches', error: error.message });
    }
}

/**
 * 5. COMPLETE MATCH & SET RESULTS
 */
async function completeMatch(req, res) {
    try {
        const { id } = req.params;
        const { winnerId, margin } = req.body;

        const updatedMatch = await Match.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: 'Completed',
                    'result.winner': winnerId,
                    'result.margin': margin
                }
            },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedMatch });
    } catch (error) {
        console.error("Error completing match:", error);
        res.status(500).json({ success: false, message: 'Error closing match instance', error: error.message });
    }
}

// @desc    Add a new venue to a user's profile
// @route   POST /api/users/:userId/venues
async function createVenue(req, res) {
    try {
        const { userId } = req.params;
        const { venue } = req.body;

        if (!venue) {
            return res.status(400).json({ success: false, message: "Venue name is required" });
        }

        // $addToSet prevents adding duplicate venue names
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { venue: venue } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Venue added successfully",
            data: updatedUser.venue,
        });
    } catch (error) {
        console.error("Error creating venue:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

// @desc    Remove a venue from a user's profile
// @route   DELETE /api/users/:userId/venues
async function deleteVenue(req, res) {
    try {
        const { userId } = req.params;
        const { venue } = req.body;

        if (!venue) {
            return res.status(400).json({ success: false, message: "Venue name is required" });
        }

        // $pull removes the specified venue string from the array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { venue: venue } },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Venue removed successfully",
            data: updatedUser.venue,
        });
    } catch (error) {
        console.error("Error deleting venue:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

// @desc    Update/Rename an existing venue entry or replace the entire list
// @route   PUT /api/users/:userId/venues
async function updateVenue(req, res) {
    try {
        const { userId } = req.params;
        const { oldVenue, newVenue, venues } = req.body;

        let updatedUser;

        // Option A: If an array of 'venues' is provided, replace the entire venue list
        if (Array.isArray(venues)) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { venue: venues } },
                { new: true, runValidators: true }
            ).select("-password");
        }
        // Option B: Rename a specific venue (replaces oldVenue with newVenue)
        else if (oldVenue && newVenue) {
            updatedUser = await User.findOneAndUpdate(
                { _id: userId, venue: oldVenue },
                { $set: { "venue.$": newVenue } },
                { new: true, runValidators: true }
            ).select("-password");
        } else {
            return res.status(400).json({
                success: false,
                message: "Provide either 'oldVenue' & 'newVenue' to rename, or a 'venues' array to overwrite.",
            });
        }

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User or venue not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Venue updated successfully",
            data: updatedUser.venue,
        });
    } catch (error) {
        console.error("Error updating venue:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

module.exports = {
    createVenue,
    deleteVenue,
    updateVenue,
    createMatch,
    launchMatch,
    updateLiveScore,
    getMatches,
    completeMatch
};