// src/AppSettingsContext.js
import React, { createContext, useState, useEffect } from "react";

export const AppSettingsContext = createContext();

export const AppSettingsProvider = ({ children }) => {
  // Defaults
  const defaultFontSize = 16;
  const defaultLanguage = "en"; // 'en' = English, 'mr' = Marathi

  // Load from localStorage or use defaults
  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem("fontSize");
    return stored ? parseInt(stored, 10) : defaultFontSize;
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || defaultLanguage;
  });

  // Apply font size globally
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  //   useEffect(() => {
  //   const safeFont = Math.round(fontSize); // avoid decimal px issues
  //   document.documentElement.style.fontSize = `${safeFont}px`;
  //   localStorage.setItem("fontSize", safeFont);
  // }, [fontSize]);

  // Save language and update html lang attribute
  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("lang", language);
  }, [language]);
  
  return (
    <AppSettingsContext.Provider value={{ fontSize, setFontSize, language, setLanguage }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
