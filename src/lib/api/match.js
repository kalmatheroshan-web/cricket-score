import { showToast } from "./apis";
import { apiconnector } from "../apiconnector";
import { methods } from "./apis";
import { MATCHES } from "./apis";

const { LAUNCH_MATCHES, CREATE_MATCH, UPDATE_MATCH, GET_MATCHES, COMPLETE_MATCH } = MATCHES;

export const launchMatch = async (data) => {
    try {
        const response = await apiconnector(LAUNCH_MATCHES, methods.post, data);
        if (response.success) showToast("Match launched successfully", "success");
        return response;
    }
    catch (error) {
        console.error("Error launching match:", error);
        throw error;
    }
};

export const createMatch = async (data) => {
    try {
        const response = await apiconnector(CREATE_MATCH, methods.post, data);
        if (response.success) showToast("Match created successfully", "success");
        return response;
    }
    catch (error) {
        console.error("Error creating match:", error);
        throw error;
    }
}; 

export const updateMatch = async (data) => {
    try {
        const response = await apiconnector(UPDATE_MATCH, methods.put, data);
        if (response.success) showToast("Match score updated successfully", "success");
        return response;
    }
    catch (error) {
        console.error("Error updating match score:", error);
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
        throw error;
    }
};

export const completeMatch = async (id, data) => {
    try {
        const url = COMPLETE_MATCH.replace(':id', id);
        const response = await apiconnector(url, methods.post, data);
        if (response.success) showToast("Match completed successfully", "success");
        return response;
    } catch (error) {

        console.error("Error completing match:", error);
        throw error;
    }
};
