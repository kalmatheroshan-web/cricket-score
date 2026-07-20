import { showToast } from "./apis";
import { apiconnector } from "../apiconnector";
import { methods } from "./apis";
import { TEAMS } from "./apis";

const { GET_TEAMS, CREATE_TEAM, DELETE_TEAM, GET_TEAM_PLAYERS, ADD_TEAM_PLAYER, UPDATE_TEAM_PLAYER, DELETE_TEAM_PLAYER, GET_TEAM_STATS, UPDATE_TEAM_STATS } = TEAMS;


export const createTeam = async (data) => {
    try {
        const response = await apiconnector(CREATE_TEAM, methods.post, data);
        if (response.success) showToast("Team created successfully", "success");
        return response;
    } catch (error) {
        console.error("Error creating team:", error);
        throw error;
    }
}

export const getTeams = async () => {
    try {
        const response = await apiconnector(GET_TEAMS, methods.get);
        return response;
    } catch (error) {
        console.error("Error fetching teams:", error);
        throw error;
    }
};

export const deleteTeam = async (data) => {
    try {
        const response = await apiconnector(DELETE_TEAM, methods.delete, data);
        if (response.success) showToast("Team deleted successfully", "success");
        return response;
    } catch (error) {
        console.error("Error deleting team:", error);
        throw error;
    }
}

export const getTeamPlayers = async (data) => {
    try {
        const response = await apiconnector(GET_TEAM_PLAYERS, methods.get, data);
        return response;
    } catch (error) {
        console.error("Error fetching team players:", error);
        throw error;
    }
}

export const addTeamPlayer = async (data) => {
    try {
        const response = await apiconnector(ADD_TEAM_PLAYER, methods.post, data);
        if (response.success) showToast("Team player added successfully", "success");
        return response;
    } catch (error) {
        console.error("Error adding team player:", error);
        throw error;
    }
}

export const updateTeamPlayer = async (data) => {
    try {
        const response = await apiconnector(UPDATE_TEAM_PLAYER, methods.put, data);
        if (response.success) showToast("Team player updated successfully", "success");
        return response;
    } catch (error) {
        console.error("Error updating team player:", error);
        throw error;
    }
}

export const deleteTeamPlayer = async (data) => {
    try {
        const response = await apiconnector(DELETE_TEAM_PLAYER, methods.delete, data);
        if (response.success) showToast("Team player deleted successfully", "success");
        return response;
    } catch (error) {
        console.error("Error deleting team player:", error);
        throw error;
    }
}

export const getTeamStats = async (data) => {
    try {
        const response = await apiconnector(GET_TEAM_STATS, methods.get, data);
        return response;
    } catch (error) {
        console.error("Error fetching team stats:", error);
        throw error;
    }
}

export const updateTeamStats = async (data) => {
    try {
        const response = await apiconnector(UPDATE_TEAM_STATS, methods.put, data);
        return response;
    } catch (error) {
        console.error("Error updating team stats:", error);
        throw error;
    }
}

