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
                name="match"
                options={{
                    title: 'Match',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="football.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}