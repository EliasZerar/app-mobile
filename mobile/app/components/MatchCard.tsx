import { Match } from '@/app/constants/type';
import { useTheme } from '@/app/utils/theme';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type MatchCardProps = {
    item: Match;
    onPress: () => void;
};

export default function MatchCard({ item, onPress }: MatchCardProps) {
    const { colors } = useTheme();

    return (
        <Pressable
            style={[
                styles.row,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }
            ]}
            onPress={onPress}
        >
            <View style={styles.team}>
                <Text style={[styles.col, { fontWeight: 'bold', color: colors.text }]}>
                    {item.homeTeam.tla}
                </Text>
                <Image source={{ uri: item.homeTeam.crest }} style={styles.icon} />
            </View>

            <View style={[styles.col, { justifyContent: 'center' }]}>
                <Text style={{ fontWeight: 'bold', textAlign: 'center', color: colors.text }}>
                    {new Date(item.utcDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </Text>
                <Text style={{ fontSize: 14, color: colors.subText, textAlign: 'center' }}>
                    {new Date(item.utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>

            <View style={styles.team}>
                <Image source={{ uri: item.awayTeam.crest }} style={styles.icon} />
                <Text style={[styles.col, { fontWeight: 'bold', color: colors.text }]}>
                    {item.awayTeam.tla}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        width: "100%",
        borderBottomWidth: 1,
        height: 100,
        gap: 40,
        borderRadius: 10,
    },
    col: {
        marginHorizontal: 6,
        flexShrink: 1,
    },
    icon: {
        width: 50,
        aspectRatio: 1,
        resizeMode: "contain",
    },
    team: {
        flex: 0.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 1,
        gap: 10,
    },
});