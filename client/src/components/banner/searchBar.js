import React, { useContext } from 'react';
import { SearchTextContext } from '../searchTextContext';
import { useLocationContext } from '../locationContext';

function SearchBar() {
    const { setPageAndParams } = useLocationContext();
    const { setSearchQuery } = useContext(SearchTextContext);
    function handleSearchInput(event) {
        if (event.key === 'Enter') {;
            const query = event.target.value.trim();
            setSearchQuery(query + " ".repeat(Math.floor(Math.random() * 10)));
            setPageAndParams('questions');
        }
    }
    return (
        <input id='searchBar' type='text' placeholder='Search . . .' name='search' onKeyDown={handleSearchInput} />
    );
};

export default SearchBar;