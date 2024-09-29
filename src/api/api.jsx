// used axios
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = (username, password) => {
  return api.post("/login", { username, password });
};

export const register = (username, password, email) => {
  return api.post("/registration", { username, password, email });
};

export const getUserData = (userId) => {
  return api.get(`/data/${userId}`);
};

export const addMoodEntry = (mood, writing) => {
  return api.post("/data", { mood, writing });
};

export const addJournalEntry = (title, content) => {
  return api.post("/journal", { title, content });
};

export const updateUser = (userId, userData) => {
  return api.put(`/update_user/${userId}`, userData);
};

export const deleteUser = (userId) => {
  return api.delete(`/delete_user/${userId}`);
};

export default api;
