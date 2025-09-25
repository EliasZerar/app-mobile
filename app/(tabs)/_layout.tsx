import { Tabs } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/app/components/ui/icon';

export default function TabLayout() {

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
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

        </Tabs>
    );
}