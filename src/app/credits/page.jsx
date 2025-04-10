// app/credits/page.jsx
"use client"; // Pokud Credits komponenta potřebuje klientský kód; pokud je čistě statická, lze vynechat

import React from 'react';
import Credits from '@components/Credits'; // Ujisti se, že alias "@components" je správně nastaven v jsconfig.json

export default function CreditsPage() {
  return <Credits />;
}