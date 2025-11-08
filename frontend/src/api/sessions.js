import axiosInstance from "../lib/axios.js";

export const sessionApi = {

    createSession: async (data) => {
       const response = axiosInstance.post("/sessions",data)
       return response.data 
    },

    getActiveSessions: async () => {
       const response = axiosInstance.get("/sessions/active",)
       return response.data 
    },

    getMyRecentSessions: async () => {
       const response = axiosInstance.get("/sessions/my-recent",)
       return response.data 
    },

    getSessionById: async (id) => {
       const response = axiosInstance.get(`/sessions/${id}`)
       return response.data 
    },

    joinSession: async (id) => {
       const response = axiosInstance.post(`/sessions/${id}/join`)
       return response.data 
    },

    endSession: async (id) => {
       const response = axiosInstance.post(`/sessions/${id}/end`)
       return response.data 
    },

    getStreamToken: async () => {
       const response = axiosInstance.get(`/chat/token`)
       return response.data 
    },
}