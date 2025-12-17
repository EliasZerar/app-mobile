import {useCallback, useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {IconSymbol} from "@/app/components/ui/icon";
import useFavorites from "@/app/hooks/usefavorite";

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
    console.log("aaa",userId)

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
                            <View style={[styles.modalView, { backgroundColor: colors.card }]}>

                                <Pressable
                                    onPress={handleToggleFavorite}
                                >
                                    <IconSymbol
                                        style={styles.favoriteIcon}
                                        size={28}
                                        name={favoriteMatchIds.has(selectedMatch.id) ? "star.fill" : "star.circle"}
                                        color={'orange'}
                                    />
                                </Pressable>
                                <Text style={styles.modalText}>
                                    {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
                                </Text>
                                <Text style={[styles.modalText, { color: colors.subText }]}>
                                    {new Date(selectedMatch.utcDate).toLocaleString()}
                                </Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.textStyle}>Fermer</Text>
                                </Pressable>
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
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#ddd",
        height: 100,
        gap: 40,
        borderRadius: 10,
        boxShadow: "5 5 15 5 #ffffff",
    },
    col: {
        marginHorizontal: 6,
        flexShrink: 1,
        color: "#fff",
    },
    icon: {
        width: 50,
        aspectRatio: 1,
        resizeMode: "contain",
    },
    favoriteIcon: {
        textAlign: "right",
    },
    team: {
        flex: 0.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 1,
        gap: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        width: "100%",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        borderRadius: 20,
        padding: 35,
        paddingHorizontal: 70,
        width: "100%",
        height: "50%",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 18
    },
});
