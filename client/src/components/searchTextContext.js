import React from 'react';
import { createContext, useState } from "react";

export const SearchTextContext = createContext();

// Search box text context provider
export function SearchTextContextProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState();
    return (
        <SearchTextContext.Provider value={{ searchQuery, setSearchQuery }}>
            {children}
        </SearchTextContext.Provider>
    );
}