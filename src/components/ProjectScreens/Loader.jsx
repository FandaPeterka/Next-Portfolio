"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Html, useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(progress);

  // Aktualizace displayProgress s mírným odkladem
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 0);
    return () => clearTimeout(timer);
  }, [progress]);

  // Memoizovaný objekt stylu – vytvoří se jen jednou
  const loaderStyle = useMemo(() => ({
    fontSize: 14,
    color: "#f1f1f1",
    fontWeight: 800,
    marginTop: 40,
  }), []);

  return (
    <Html center>
      <div style={loaderStyle}>
        {displayProgress.toFixed(2)}%
      </div>
    </Html>
  );
};

export default React.memo(Loader);