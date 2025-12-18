import * as React from 'react';
import { Searchbar } from 'react-native-paper';

interface Props {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const MySearchBar = ({ searchQuery, setSearchQuery }: Props) => {
    return (
        <Searchbar
            placeholder="Rechercher un club..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ margin: 10 }}
        />
    );
};
