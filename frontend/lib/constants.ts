import { Habit } from '@/types';

export const HABITS: Habit[] = [
    {
        id: '1',
        name: 'Sleep',
        type: 'sleep',
        icon: '😴',
        description: '7 hrs',
        requirementType: 'hours',
        requirements: [
            { value: '6', label: '6 hrs' },
            { value: '7', label: '7 hrs' },
            { value: '8', label: '8 hrs' },
        ],
    },
    {
        id: '2',
        name: 'Hydrate',
        type: 'hydrate',
        icon: '💧',
        description: '8 glasses',
        requirementType: 'glasses',
        requirements: [
            { value: '4', label: '4 glasses' },
            { value: '8', label: '8 glasses' },
            { value: '12', label: '12 glasses' },
        ],
    },
    {
        id: '3',
        name: 'Eat',
        type: 'eat',
        icon: '🍎',
        description: '3 Meals',
        requirementType: 'meals',
        requirements: [
            { value: '1', label: '1 Meal' },
            { value: '2', label: '2 Meals' },
            { value: '3', label: '3 Meals' },
        ],
    },
    {
        id: '4',
        name: 'Breath',
        type: 'breath',
        icon: '🧘',
        description: '10 mins',
        requirementType: 'minutes',
        requirements: [
            { value: '10', label: '10 mins' },
            { value: '20', label: '20 mins' },
            { value: '30', label: '30 mins' },
        ],
    },
    {
        id: '5',
        name: 'Read',
        type: 'read',
        icon: '📚',
        description: '10 mins',
        requirementType: 'minutes',
        requirements: [
            { value: '10', label: '10 mins' },
            { value: '20', label: '20 mins' },
            { value: '30', label: '30 mins' },
        ],
    },
    {
        id: '6',
        name: 'Exercise',
        type: 'exercise',
        icon: '💪',
        description: '10 mins',
        requirementType: 'minutes',
        requirements: [
            { value: '10', label: '10 mins' },
            { value: '20', label: '20 mins' },
            { value: '30', label: '30 mins' },
        ],
    },
    {
        id: '7',
        name: 'Write',
        type: 'write',
        icon: '✍️',
        description: '10 mins',
        requirementType: 'minutes',
        requirements: [
            { value: '10', label: '10 mins' },
            { value: '20', label: '20 mins' },
            { value: '30', label: '30 mins' },
        ],
    },
];

export const DURATION_OPTIONS = [
    { value: 3, label: '3 Days' },
    { value: 7, label: '7 Days' },
    { value: 14, label: '14 Days' },
    { value: 30, label: '30 Days' },
];

export const START_DATE_OPTIONS = [
    { value: 'today', label: 'Start Today' },
    { value: 'tomorrow', label: 'Start Tomorrow' },
    { value: 'custom', label: 'Custom Start Date' },
];

export const CHALLENGE_MODES = [
    {
        value: 'solo',
        label: 'Solo Challenge',
        icon: '🏃',
        description: 'Play alone for personal growth',
    },
    {
        value: 'one-on-one',
        label: '1v1 Challenge',
        icon: '⚔️',
        description: 'Compete head-to-head with a friend',
    },
    {
        value: 'multiplayer',
        label: 'Multiplayer Challenge',
        icon: '👥',
        description: 'Play with multiple friends',
    },
];