const express = require('express');
const teamRouter = express.Router();
const { getTeamPlayers, addTeam, deleteTeam, addTeamPlayer, updateTeamPlayer, deleteTeamPlayer, getTeamStats, updateTeamStats } = require('../controller/Team');    

teamRouter.get('/players', getTeamPlayers);
teamRouter.post('/', addTeam);
teamRouter.delete('/', deleteTeam);
teamRouter.post('/players', addTeamPlayer);
teamRouter.put('/players', updateTeamPlayer);
teamRouter.delete('/players', deleteTeamPlayer);
teamRouter.get('/stats', getTeamStats);
teamRouter.put('/stats', updateTeamStats);

module.exports = teamRouter;