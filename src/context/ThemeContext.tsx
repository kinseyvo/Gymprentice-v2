import React, { createContext, useContext, useState } from 'react';

type ThemeContextType = {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    darkMode: true,
    setDarkMode: () => { },
});

export const ThemeProvider = ({ children }: any) => {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);