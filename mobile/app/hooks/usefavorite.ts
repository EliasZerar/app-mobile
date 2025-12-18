import { Alert } from "react-native";
import api from "@/app/services/api";
import useAuthStore from "@/app/store/authStore";

export default function useFavorites() {
    const { user } = useAuthStore();

    const userId = user?.id;

    const toggleFavorite = async (matchId: number, isFavorite: boolean) => {
        try {
            if (isFavorite) {
                await api.delete(`/favorite/${matchId}`);
            } else {
                await api.post("/favorite", { matchId });
            }
            return true;
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                return true;
            }
            Alert.alert("Erreur", "Une erreur est survenue.");
            return false;
        }
    }

    const getUserFavorites = async () => {
        if (!userId) {
            return [];
        }
        try {
            const response = await api.get(`/favorite`);
            console.log("response",response);
            return response.favorites.map((fav: any) => fav.matchId);
        } catch (error) {
            console.log(error)
        }
    }
    return { toggleFavorite, getUserFavorites, userId };
}
