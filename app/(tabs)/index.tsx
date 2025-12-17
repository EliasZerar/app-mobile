import { IconSymbol } from "@/app/components/ui/icon";
import useFavorites from "@/app/hooks/usefavorite";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import MatchCard from "@/app/components/MatchCard";
import { Match } from "@/app/constants/type";
import { useTheme } from "@/app/utils/theme";
import api from "../services/api";

export default function MatchScreen() {
    const { colors } = useTheme();
    const [data, setData] = useState<Match[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [favoriteMatchIds, setFavoriteMatchIds] = useState<Set<number>>(new Set());

    const { toggleFavorite, getUserFavorites, userId } = useFavorites();

    const getMatches = async () => {
        try {
            const response = await api.get("/match");
            if (response.status === 200) {
                setData(response.matches);
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMatches();
    }, []);

    const loadUserFavorites = useCallback(async () => {
        if (userId) {
            const favoritesArray = await getUserFavorites();
            console.log("favorite", favoritesArray);
            setFavoriteMatchIds(new Set(favoritesArray.map(Number)));
        }
    }, [userId, getUserFavorites]);

    useEffect(() => {
        loadUserFavorites();
    }, [loadUserFavorites]);

    const handleToggleFavorite = async () => {
        if (!selectedMatch) return;

        const matchId = selectedMatch.id;
        const isCurrentlyFavorite = favoriteMatchIds.has(matchId);

        const success = await toggleFavorite(matchId, isCurrentlyFavorite);

        if (success) {
            setFavoriteMatchIds(prev => {
                const newSet = new Set(prev);
                if (isCurrentlyFavorite) {
                    newSet.delete(matchId);
                } else {
                    newSet.add(matchId);
                }
                return newSet;
            });
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isLoading ? (
                <ActivityIndicator color={colors.text} size="large" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={({ id }) => id.toString()}
                    renderItem={({ item }) => (
                        <MatchCard
                            item={item}
                            onPress={() => {
                                setSelectedMatch(item);
                                setModalVisible(true);
                            }}
                        />
                    )}
                />
            )}
            {selectedMatch && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)} />

                        <View style={[styles.modalView, { backgroundColor: colors.card }]}>

                            <View style={styles.modalHeader}>
                                <Text style={[styles.competitionText, { color: colors.subText }]}>
                                    Détails du match
                                </Text>
                                <Pressable
                                    onPress={() => setModalVisible(false)}
                                    style={[styles.closeIconBtn, { backgroundColor: colors.background }]}
                                >
                                    <IconSymbol name="xmark" size={16} color={colors.text} />
                                </Pressable>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.scoreBoardContainer}>
                                    <View style={styles.teamColumn}>
                                        <View style={[styles.logoPlaceholder, { borderColor: colors.border, backgroundColor: 'white', overflow: 'hidden' }]}>
                                            <Image
                                                source={{ uri: selectedMatch.homeTeam.crest }}
                                                style={{ width: '80%', height: '80%' }}
                                            />
                                        </View>
                                        <Text style={[styles.teamNameModal, { color: colors.text }]} numberOfLines={2}>
                                            {selectedMatch.homeTeam.name}
                                        </Text>
                                    </View>

                                    <View style={styles.scoreColumn}>
                                        <Text style={[styles.scoreText, { color: colors.text }]}>VS</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: colors.background }]}>
                                            <Text style={[styles.statusText, { color: colors.text }]}>
                                                {new Date(selectedMatch.utcDate) > new Date() ? 'PRÉVU' : 'TERMINÉ'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.teamColumn}>
                                        <View style={[styles.logoPlaceholder, { borderColor: colors.border, backgroundColor: 'white', overflow: 'hidden' }]}>
                                            <Image
                                                source={{ uri: selectedMatch.awayTeam.crest }}
                                                style={{ width: '80%', height: '80%' }}
                                            />
                                        </View>
                                        <Text style={[styles.teamNameModal, { color: colors.text }]} numberOfLines={2}>
                                            {selectedMatch.awayTeam.name}
                                        </Text>
                                    </View>
                                </View>

                                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                                <View style={styles.detailsGrid}>
                                    <View style={[styles.detailItem, { backgroundColor: colors.background }]}>
                                        <IconSymbol name="calendar" size={20} color={colors.subText} />
                                        <Text style={[styles.detailLabel, { color: colors.subText }]}>Date</Text>
                                        <Text style={[styles.detailValue, { color: colors.text }]}>
                                            {new Date(selectedMatch.utcDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                        </Text>
                                    </View>

                                    <View style={[styles.detailItem, { backgroundColor: colors.background }]}>
                                        <IconSymbol name="clock.circle" size={20} color={colors.subText} />
                                        <Text style={[styles.detailLabel, { color: colors.subText }]}>Heure</Text>
                                        <Text style={[styles.detailValue, { color: colors.text }]}>
                                            {new Date(selectedMatch.utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                </View>

                                <Pressable
                                    style={[
                                        styles.favoriteButton,
                                        {
                                            backgroundColor: favoriteMatchIds.has(selectedMatch.id) ? colors.background : colors.card
                                        }
                                    ]}
                                    onPress={handleToggleFavorite}
                                >
                                    <IconSymbol
                                        name={favoriteMatchIds.has(selectedMatch.id) ? "star.fill" : "star"}
                                        size={20}
                                        color={'white'}
                                    />
                                    <Text style={styles.favoriteButtonText}>
                                        {favoriteMatchIds.has(selectedMatch.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                                    </Text>
                                </Pressable>

                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        margin: "auto",
        backgroundColor: "#262626",
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalView: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        width: "100%",
        maxHeight: "85%",
        minHeight: "50%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    competitionText: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    closeIconBtn: {
        padding: 8,
        borderRadius: 20,
    },
    scoreBoardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    teamColumn: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    logoPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    teamNameModal: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    scoreColumn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        width: 80,
    },
    scoreText: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 20,
        opacity: 0.2,
    },
    detailsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    detailItem: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        gap: 6,
    },
    detailLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 10,
        marginTop: 'auto',
    },
    favoriteButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});