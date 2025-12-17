import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/app/utils/theme";
import useFavorites from "@/app/hooks/usefavorite";
import { useEffect, useState } from "react";

export default function FavoritesScreen() {
    const { colors } = useTheme();
    const { getUserFavorites } = useFavorites();
    const [favIds, setFavIds] = useState<number[]>([]);

    useEffect(() => {
        const load = async () => {
            const ids = await getUserFavorites();
            if(ids) setFavIds(ids);
        };
        load();
    }, [getUserFavorites]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={{ color: colors.text, fontSize: 20, textAlign: 'center', marginTop: 20 }}>
                Mes Favoris
            </Text>
            <Text style={{ color: colors.text, textAlign: 'center' }}>
                {favIds.length} matchs favoris trouvés.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    }
});
