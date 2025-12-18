import * as Application from "expo-application";
import { getCalendars } from "expo-localization";
import { Platform } from "react-native";

import { API_HOST } from "../config";
import useAuthStore from "../store/authStore";


class APIHandler {
    async removeToken() {
        try {
            useAuthStore.getState().logout();
        } catch (error) {
            console.error("Error removing token:", error);
        }
    }

    getHeaders() {
        const currentToken = useAuthStore.getState().token;
        return {
            "Content-Type": "application/json",
            Authorization: currentToken ? `Bearer ${currentToken}` : "",
            Accept: "application/json",
            "x-app-version": Application.nativeApplicationVersion,
            "x-app-platform": Platform.OS,
            "x-app-build-number": Application.nativeBuildVersion,
            "x-timezone": getCalendars()[0].timeZone,
            "ngrok-skip-browser-warning": "true",
        };
    }

    async post(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${API_HOST}${endpoint}`, {
                method: "POST",
                headers: {
                    ...this.getHeaders(),
                    ...options.headers,
                },
                signal: options.signal,
                body: JSON.stringify(data),
                credentials: "include",
            });
            if (response.status === 401) {
                await this.removeToken();
                return { ok: false, status: 401, error: "Unauthorized" };
            }
            const res = await response.json();
            return { ...res, status: response.status };
        } catch (error) {
            if (error.message.includes("NetworkError")) {
                await this.removeToken();
                return { ok: false, status: 401, error: "Unauthorized" };
            }
            throw error;
        }
    }

    async get(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_HOST}${endpoint}`, {
                method: "GET",
                headers: {
                    ...this.getHeaders(),
                    ...options.headers,
                },
                credentials: "include",
            });
            if (response.status === 401) {
                await this.removeToken();
                return { ok: false, status: 401, error: "Unauthorized" };
            }
            const res = await response.json();
            return { ...res, status: response.status };
        } catch (error) {
            if (error.message.includes("NetworkError")) {
                await this.removeToken();
                return { ok: false, status: 401, error: "Unauthorized" };
            }
            throw error;
        }
    }

    async put(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${API_HOST}${endpoint}`, {
                method: "PUT",
                headers: {
                    ...this.getHeaders(),
                    ...options.headers,
                },
                body: JSON.stringify(data),
                credentials: "include",
            });
            if (response.status === 401) {
                await this.removeToken();
                return { ok: false, status: 401, error: "Unauthorized" };
            }
            const res = await response.json();
            return { ...res, status: response.status };
        } catch (error) {
            if (error.message.includes("NetworkError")) {
                await this.removeToken();
                return { ok: false, status: 401, error: "Unauthorized" };
            }
            throw error;
        }
    }

    async delete(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${API_HOST}${endpoint}`, {
                method: "DELETE",
                headers: {
                    ...this.getHeaders(),
                    ...options.headers,
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
            if (response.status === 401) {
                await this.removeToken();
                return { ok: false, status: 401, error: "Unauthorized" };
            }
            const res = await response.json();
            return { ...res, status: response.status };
        } catch (error) {
            if (error.message.includes("NetworkError")) {
                await this.removeToken();
                return { ok: false, status: 401, error: "Unauthorized" };
            }
            throw error;
        }
    }
}
const api = new APIHandler();
export default api;
