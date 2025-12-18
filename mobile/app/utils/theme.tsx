import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

const Colors = {
    light: {
        background: '#ffffff',
        text: '#000000',
        card: '#ffffff',
        border: '#dddddd',
        subText: '#343F3E',
        icon: 'black',
        shadow: '#ffffff'
    },
    dark: {
        background: '#121212',
        text: '#ffffff',
        card: '#1E1E1E',
        border: '#333333',
        subText: '#aaaaaa',
        icon: 'white',
        shadow: '#121212'
    },
};

type ThemeContextType = {
    theme: 'light' | 'dark';
    colors: typeof Colors.light;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState<'light' | 'dark'>(systemScheme === 'dark' ? 'dark' : 'light');

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const colors = Colors[theme];

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};