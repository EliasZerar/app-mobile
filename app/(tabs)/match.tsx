import {Text, View, FlatList, ActivityIndicator, Image, StyleSheet, Modal, Alert, Pressable} from "react-native";
import { useEffect, useState } from "react";

type Team = {
    id: number;
    name: string;
    crest: string;
    tla: string;
};

type Competition = {
    id: number;
    name: string;
    emblem: string;
};

type Matche = {
    id: number;
    utcDate: string;
    homeTeam: Team;
    awayTeam: Team;
    competition: Competition;
};


export default function Match() {
    const [data, setData] = useState<Matche[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Matche | null>(null);

    const getMatches = async () => {
        try {
            const response = require("../../matches.json");
            setData(response.matches);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMatches();
    }, []);

    const renderItem = ({ item }: { item: Matche }) => (
        <Pressable
            style={styles.row}
            onPress={() => {
                setSelectedMatch(item);
                setModalVisible(true);
            }}
        >
            <View style={styles.team}>
                <Text style={styles.col}>{item.homeTeam.tla}</Text>
                <Image source={{ uri: item.homeTeam.crest }} style={styles.icon} />
            </View>

            <Text style={styles.col}>vs</Text>

            <View style={styles.team}>
                <Image source={{ uri: item.awayTeam.crest }} style={styles.icon} />
                <Text style={styles.col}>{item.awayTeam.tla}</Text>
            </View>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={({ id }) => id.toString()}
                    renderItem={renderItem}
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
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                {selectedMatch.homeTeam.tla} vs {selectedMatch.awayTeam.tla}
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
        boxShadow: "5 5 15 5 #ffffff"
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
    team: {
        flex: 0.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"center",
        flexShrink: 1,
        gap: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100%',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        paddingHorizontal: 70,
        width: '100%',
        height:'50%'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
