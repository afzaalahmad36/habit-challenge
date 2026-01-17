export type HabitType = 'sleep' | 'hydrate' | 'eat' | 'breath' | 'read' | 'exercise' | 'write';

export interface HabitRequirement {
    value: string | number;
    label: string;
}

// Backend requirement structure (from Postman)
export interface BackendHabitRequirement {
    type: 'hours' | 'glasses' | 'meals' | 'minutes';
    value: number;
}

export interface Habit {
    id: string;
    name: string;
    type: HabitType;
    icon: string;
    requirements: HabitRequirement[];
    description?: string;
    requirementType: 'hours' | 'glasses' | 'meals' | 'minutes';
}

// Frontend selected habit (for UI)
export interface SelectedHabit {
    habitId: string;
    habitType: HabitType;
    requirement: string;
}

// Backend habit format (for API)
export interface BackendSelectedHabit {
    habitId: string;
    requirement: BackendHabitRequirement;
}

export type ChallengeMode = 'solo' | 'one-on-one' | 'multiplayer';

// Backend challenge create request (matches Postman)
export interface CreateChallengeRequest {
    duration: number;
    startDate: string; // ISO string
    mode: ChallengeMode;
    habits: BackendSelectedHabit[];
}

export interface Challenge {
    id: string;
    userId: string;
    duration: number;
    startDate: Date;
    mode: ChallengeMode;
    habits: BackendSelectedHabit[];
    createdAt: Date;
    status: 'active' | 'completed' | 'cancelled';
}

export interface Task {
    id: string;
    challengeId: string;
    userId: string;
    habitType: HabitType;
    requirement: BackendHabitRequirement;
    completed: boolean;
    completedAt?: Date;
    date: Date;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    points: number;
}

// Auth response from backend
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

// Refresh token response
export interface RefreshTokenResponse {
    accessToken: string;
}

export interface DailyTasksResponse {
    tasks: Task[];
    totalPoints: number;
    completedTasks: number;
    totalTasks: number;
}

// Helper function to convert frontend habit to backend format
export function convertToBackendHabit(habit: SelectedHabit, habitInfo: Habit): BackendSelectedHabit {
    return {
        habitId: habit.habitType,
        requirement: {
            type: habitInfo.requirementType,
            value: Number(habit.requirement),
        },
    };
}