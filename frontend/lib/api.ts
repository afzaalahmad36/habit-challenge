import axios from "axios";

// Configure your backend API URL here
// Based on Postman collection: {{BASE_URL}}/api/v1
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we have a refresh token, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem("authToken", accessToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);

// API endpoints based on Postman collection
export const authAPI = {
  // POST {{BASE_URL}}/api/v1/auth/login
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  // POST {{BASE_URL}}/api/v1/auth/refresh
  refreshToken: (refreshToken: string) =>
    api.post("/auth/refresh", { refreshToken }),

  // Additional auth endpoints (if needed)
  register: (data: any) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
};

export const challengeAPI = {
  // POST {{BASE_URL}}/api/v1/challenge/
  // Body format from Postman:
  // {
  //   "duration": 7,
  //   "startDate": "2026-02-01T00:00:00.000Z",
  //   "mode": "solo",
  //   "habits": [
  //     {
  //       "habitId": "sleep",
  //       "requirement": {
  //         "type": "hours",
  //         "value": 6
  //       }
  //     }
  //   ]
  // }
  createChallenge: (data: {
    duration: number;
    startDate: string;
    mode: "solo" | "one-on-one" | "multiplayer";
    habits: Array<{
      habitId: string;
      requirement: {
        type: string;
        value: number;
      };
    }>;
  }) => api.post("/challenge/", data),

  // GET endpoints (add these based on your backend)
  getChallenges: () => api.get("/challenge/"),
  getChallenge: (id: string) => api.get(`/challenge/${id}`),
  getUserChallenges: () => api.get("/challenge/user"),
  updateChallengeMode: (id: string, mode: string) =>
    api.patch(`/challenge/${id}/mode`, { mode }),
};

export const taskAPI = {
  // Add these endpoints based on your backend implementation
  getDailyTasks: (challengeId?: string) =>
    api.get("/tasks/daily", challengeId ? { params: { challengeId } } : {}),

  getTasks: (challengeId: string) => api.get(`/tasks/${challengeId}`),

  markTaskComplete: (taskId: string) => api.patch(`/tasks/${taskId}/complete`),

  getTaskHistory: (challengeId: string) =>
    api.get(`/tasks/${challengeId}/history`),
};

// Utility function to handle login and store tokens
export const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authAPI.login(email, password);
    const { accessToken, refreshToken, user } = response.data;

    // Store tokens
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Store user info if needed
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Utility function to handle logout
export const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export default api;
