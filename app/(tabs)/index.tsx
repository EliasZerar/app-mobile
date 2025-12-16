import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
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
                            <Text style={[styles.modalText, { color: colors.text }]}>
                                {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
                            </Text>
                            <Text style={[styles.modalText, { color: colors.subText }]}>
                                {new Date(selectedMatch.utcDate).toLocaleString()}
                            </Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
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