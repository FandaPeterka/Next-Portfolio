"use client";
import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; // Ujisti se, že tato cesta je správná
import { ThemeProvider } from "@contexts/ThemeContext";

export default function ClientProviders({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </I18nextProvider>
  );
} 