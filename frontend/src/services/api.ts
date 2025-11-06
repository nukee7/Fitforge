const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// API service for making HTTP requests
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Get authentication headers
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    // Console logging for debugging
    console.log(`🔗 API Request: ${options.method || 'GET'} ${url}`);
    if (this.token) {
      console.log('🔐 Using authentication token');
    }

    try {
      const response = await fetch(url, config);
      
      console.log(`📊 Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Success:', data.status || 'Data received');
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API instance
const api = new ApiService(API_BASE_URL);

// Exercise API endpoints
export const exerciseApi = {
  // Get all exercises with optional filtering
  getExercises: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    equipment?: string;
    muscleGroup?: string;
    search?: string;
    popular?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    return api.get<{
      status: string;
      data: {
        exercises: Exercise[];
        pagination: {
          current: number;
          pages: number;
          total: number;
        };
        filters: {
          categories: string[];
          difficulties: string[];
          equipmentTypes: string[];
          muscleGroups: string[];
        };
      };
    }>(`/exercises${queryString ? `?${queryString}` : ''}`);

  },

  // Get single exercise by ID
  getExercise: (id: string) => {
    return api.get<{
      status: string;
      data: {
        exercise: Exercise;
      };
    }>(`/exercises/${id}`);
  },

  // Get exercise categories
  getCategories: () => {
    return api.get<{
      status: string;
      data: {
        categories: Array<{
          _id: string;
          count: number;
        }>;
      };
    }>('/exercises/categories');
  },

  // Get popular exercises
  getPopularExercises: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    return api.get<{
      status: string;
      data: {
        exercises: Exercise[];
      };
    }>(`/exercises/popular${params}`);
  }
};

// Workout API endpoints
export const workoutApi = {
  // Get user workouts
  getWorkouts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    return api.get<{
      status: string;
      data: {
        workouts: Workout[];
        pagination: {
          current: number;
          pages: number;
          total: number;
        };
        stats: {
          totalWorkouts: number;
          totalSets: number;
          totalReps: number;
          totalCalories: number;
          totalVolume: number;
        };
      };
    }>(`/workouts${queryString ? `?${queryString}` : ''}`);
  },

  // Create new workout
  createWorkout: (workoutData: CreateWorkoutData) => {
    return api.post<{
      status: string;
      message: string;
      data: {
        workout: Workout;
      };
    }>('/workouts', workoutData);
  },

  // Get workout statistics
  getWorkoutStats: (period?: string) => {
    const params = period ? `?period=${period}` : '';
    return api.get<{
      status: string;
      data: {
        period: string;
        dateRange: {
          startDate: string;
          endDate: string;
        };
        dailyStats: Array<{
          date: string;
          workouts: number;
          sets: number;
          reps: number;
          calories: number;
          volume: number;
        }>;
        categoryStats: Array<{
          _id: string;
          count: number;
          totalSets: number;
          totalCalories: number;
        }>;
        overallStats: {
          totalWorkouts: number;
          totalSets: number;
          totalReps: number;
          totalCalories: number;
          totalVolume: number;
          avgCaloriesPerWorkout: number;
        };
      };
    }>(`/workouts/stats${params}`);
  }
};

// Auth API endpoints
export const authApi = {
  // Register user
  register: (userData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    weight?: number;
    height?: number;
    fitnessLevel?: string;
    goals?: string[];
  }) => {
    return api.post<{
      status: string;
      message: string;
      data: {
        user: User;
        token: string;
      };
    }>('/auth/register', userData);
  },

  // Login user
  login: (credentials: { email: string; password: string }) => {
    return api.post<{
      status: string;
      message: string;
      data: {
        user: User;
        token: string;
      };
    }>('/auth/login', credentials);
  },

  // Get current user
  getMe: () => {
    return api.get<{
      status: string;
      data: {
        user: User;
      };
    }>('/auth/me');
  },

  // Logout user
  logout: () => {
    return api.post<{
      status: string;
      message: string;
    }>('/auth/logout');
  }
};

// Type definitions
export interface Exercise {
  _id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  muscleGroups: string[];
  primaryMuscle: string;
  description: string;
  instructions: Array<{
    step: number;
    instruction: string;
  }>;
  tips: string[];
  variations: Array<{
    name: string;
    description: string;
  }>;
  caloriesPerMinute: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  _id: string;
  user: string;
  exerciseName: string;
  category: string;
  sets: number;
  reps: number;
  weight: number;
  duration?: number;
  calories: number;
  notes?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  date: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutData {
  exerciseName: string;
  category: string;
  sets: number;
  reps: number;
  weight: number;
  calories: number;
  duration?: number;
  notes?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  date?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  goals: string[];
  preferences: {
    units: 'metric' | 'imperial';
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  stats: {
    totalWorkouts: number;
    totalSets: number;
    totalReps: number;
    caloriesBurned: number;
    currentStreak: number;
    longestStreak: number;
  };
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export default api;
