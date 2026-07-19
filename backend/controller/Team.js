const Team = require('../dbs/teams');

/**
 * @desc Get all players belonging to a specific team
 * @route GET /api/teams/players
 */
async function getTeamPlayers(req, res) {
    try {
        const { teamId } = req.body;
        const team = await Team.findById(teamId).select('players');

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team franchise not found.' });
        }

        return res.status(200).json({ success: true, data: team.players });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc Initialize a completely new team record along with its roster
 * @route POST /api/teams
 */
async function addTeam(req, res) {
    try {
        const { teamName, roster } = req.body;

        if (!teamName) {
            return res.status(400).json({ success: false, message: 'Team identity name is required.' });
        }

        const newTeam = new Team({
            teamName,
            players: roster || [], 
            stats: { matchesPlayed: 0, matchesWon: 0, matchesLost: 0 }
        });

        await newTeam.save();
        return res.status(201).json({ success: true, data: newTeam });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc Delete an entire team profile from the database
 * @route DELETE /api/teams
 */
async function deleteTeam(req, res) {
    try {
        const { teamId } = req.body;
        const deletedTeam = await Team.findByIdAndDelete(teamId);

        if (!deletedTeam) {
            return res.status(404).json({ success: false, message: 'Team not found.' });
        }

        return res.status(200).json({ success: true, message: 'Team and related profile deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


async function getTeams(req, res) {
    try {
        const teams = await Team.find().select('teamName players stats');
        return res.status(200).json({ success: true, data: teams });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc Add a single player to an existing team's roster array
 * @route POST /api/teams/players
 */
async function addTeamPlayer(req, res) {
    try {
        const { teamId } = req.body;
        const { name, role, jerseyNumber } = req.body;

        if (!name || !role) {
            return res.status(400).json({ success: false, message: 'Player name and role details are required.' });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found.' });
        }

        if (team.players.length >= 12) {
            return res.status(400).json({ success: false, message: 'Squad capacity limits breached (Max 12 players).' });
        }

        // Push new player object into the subdocument array
        team.players.push({ name, role, jerseyNumber: jerseyNumber || 'N/A' });
        await team.save();

        return res.status(200).json({ success: true, data: team.players });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc Update a specific player's parameters within a team
 * @route PUT /api/teams/players
 */
async function updateTeamPlayer(req, res) {
    try {
        const { teamId, playerId } = req.body;
        const { name, role, jerseyNumber } = req.body;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team profile record missing.' });
        }

        const player = team.players.id(playerId);
        if (!player) {
            return res.status(404).json({ success: false, message: 'Player record not found in team context.' });
        }

        // Apply parameter updates dynamically if provided
        if (name) player.name = name;
        if (role) player.role = role;
        if (jerseyNumber) player.jerseyNumber = jerseyNumber;

        await team.save();
        return res.status(200).json({ success: true, data: team.players });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc Splice a player completely out of a team's roster array
 * @route DELETE /api/teams/players
 */
async function deleteTeamPlayer(req, res) {
    try {
        const { teamId, playerId } = req.body;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team records missing.' });
        }

        // Use Mongoose array pull subdocument method
        team.players.pull({ _id: playerId });
        await team.save();

        return res.status(200).json({ success: true, message: 'Player removed from squad.', data: team.players });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc Get analytics stats data for a specific team
 * @route GET /api/teams/stats
 */
async function getTeamStats(req, res) {
    try {
        const { teamId } = req.body;
        const team = await Team.findById(teamId).select('stats');

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team profile missing.' });
        }

        return res.status(200).json({ success: true, data: team.stats });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc Modify cumulative match analytics win/loss histories for a team
 * @route PUT /api/teams/stats
 */
async function updateTeamStats(req, res) {
    try {
        const { teamId } = req.body;
        const { matchesPlayed, matchesWon, matchesLost } = req.body;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found.' });
        }

        // Inject new statistics parameters gracefully
        if (matchesPlayed !== undefined) team.stats.matchesPlayed = matchesPlayed;
        if (matchesWon !== undefined) team.stats.matchesWon = matchesWon;
        if (matchesLost !== undefined) team.stats.matchesLost = matchesLost;

        await team.save();
        return res.status(200).json({ success: true, data: team.stats });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getTeamPlayers,
    addTeam,
    deleteTeam,
    addTeamPlayer,
    updateTeamPlayer,
    deleteTeamPlayer,
    getTeamStats,
    updateTeamStats,
    getTeams
};