import { IconSymbol } from '@/app/components/ui/icon';
import { ThemeProvider, useTheme } from '@/app/utils/theme';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StatusBar, StatusBarStyle } from 'react-native';

function ThemeToggleButton() {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <Pressable onPress={toggleTheme} style={{ marginRight: 15 }}>
            <IconSymbol
                size={28}
                name={theme === 'light' ? 'moon.fill' : 'sun.max.fill'}
                color={colors.text}
            />
        </Pressable>
    );
}

export default function TabLayout() {
    return (
        <ThemeProvider>
            <TabsWithTheme />
        </ThemeProvider>
    );
}

function TabsWithTheme() {
    const { colors, theme } = useTheme();

    useEffect(() => {
        const style: StatusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

        StatusBar.setBarStyle(style);

        const timer = setTimeout(() => {
            StatusBar.setBarStyle(style);
        }, 100);

        return () => clearTimeout(timer);
    }, [theme]);

    return (
        <>
            <StatusBar
                animated={true}
                backgroundColor={colors.background}
                key={theme}
                barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
            />
            <Tabs
                screenOptions={{
                    headerStyle: { backgroundColor: colors.background, height: 120 },
                    headerTintColor: colors.text,
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopColor: colors.border
                    },
                    headerRight: () => <ThemeToggleButton />,
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Accueil',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="favorites"
                    options={{
                        title: 'Favorites',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="star.fill" color={color} />,
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profil',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
                    }}
                />
            </Tabs>
        </>
    );
}