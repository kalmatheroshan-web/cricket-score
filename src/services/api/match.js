import { showToast } from "./apis";
import { apiconnector } from "../apiconnector";
import { methods } from "./apis";
import { MATCHES } from "./apis";

const { LAUNCH_MATCHES, CREATE_MATCH, UPDATE_MATCH, GET_MATCHES, COMPLETE_MATCH } = MATCHES;

export const launchMatch = async (data) => {
    try {
        const response = await apiconnector(LAUNCH_MATCHES, methods.post, data);
        if (response?.success) {
            showToast("success", "Match launched successfully");
        }
        return response;
    } catch (error) {
        console.error("Error launching match:", error);
        showToast("error", "Failed to launch match");
        throw error;
    }
};

export const createMatch = async (data) => {
    try {
        const response = await apiconnector(CREATE_MATCH, methods.post, data);
        if (response?.success) {
            showToast("success", "Match created successfully");
        }
        return response;
    } catch (error) {
        console.error("Error creating match:", error);
        showToast("error", "Failed to create match");
        throw error;
    }
};

export const updateMatch = async (data) => {
    try {
        const response = await apiconnector(UPDATE_MATCH, methods.put, data);
        if (response?.success) {
            showToast("success", "Match score updated successfully", "Fixture is now live.");
        }
        return response;
    } catch (error) {
        console.error("Error updating match score:", error);
        showToast("error", "Failed to update match score");
        throw error;
    }
};

export const getMatches = async (status) => {
    try {
        const url = status ? `${GET_MATCHES}?status=${status}` : GET_MATCHES;
        const response = await apiconnector(url, methods.get);
        return response;
    } catch (error) {
        console.error("Error fetching matches:", error);
        showToast("error", "Failed to fetch matches");
        throw error;
    }
};

export const completeMatch = async (id, data) => {
    try {
        const url = COMPLETE_MATCH.replace(":id", id);
        const response = await apiconnector(url, methods.post, data);
        if (response?.success) {
            showToast("success", "Match completed successfully");
        }
        return response;
    } catch (error) {
        console.error("Error completing match:", error);
        showToast("error", "Failed to complete match");
        throw error;
    }
};