import React, { createContext, useContext } from 'react';

// Theme type
export type ThemeMode = 'system' | 'light' | 'dark';

// Light theme colors
export const lightColors = {
    background: '#30207eff',
    cardDark: '#ffffff',
    cardLight: '#f8f8fc',
    lavender: '#b8a9f4',
    lavenderLight: '#d4c9f9',
    lavenderBg: '#f5f3ff',
    white: '#ffffff',
    black: '#000000',
    gray: '#6b7280',
    grayLight: '#9ca3af',
    grayDark: '#4b5563',
    green: '#059669',
    red: '#DC2626',
    // Theme-specific
    textPrimary: '#000000',
    textSecondary: '#4b5563',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    cardBorder: 'rgba(0,0,0,0.06)',
    isDark: false,
};

// Dark theme colors
export const darkColors = {
    background: '#0f0f13',
    cardDark: '#1a1a22',
    cardLight: '#25252f',
    lavender: '#b8a9f4',
    lavenderLight: '#d4c9f9',
    lavenderBg: '#1a1a22',
    white: '#ffffff',
    black: '#000000',
    gray: '#6b7280',
    grayLight: '#9ca3af',
    grayDark: '#4b5563',
    green: '#10B981',
    red: '#f4a9b8',
    // Theme-specific
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    border: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(255,255,255,0.06)',
    isDark: true,
};

// Default colors (for backward compatibility)
export const colors = darkColors;

// Theme Context
export type ThemeContextType = {
    colors: typeof lightColors;
    isDark: boolean;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    colors: darkColors,
    isDark: true,
    themeMode: 'system',
    setThemeMode: () => { },
});

export const useTheme = () => useContext(ThemeContext);
