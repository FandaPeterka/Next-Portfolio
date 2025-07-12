"use client";
import { useEffect, useContext } from "react";
import { NavigationContext } from "@contexts/NavigationContext";

export default function Blog() {
  const { registerSections } = useContext(NavigationContext);

  /* zaregistrujeme prázdný seznam sekcí */
  useEffect(() => registerSections([]), []);

  return (
    <main style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <h1 style={{fontSize:"3rem",textAlign:"center"}}>Blog – coming soon 🚧</h1>
    </main>
  );
}