"use client";
import React, { useState, useCallback } from "react";
import Tech3DIconsInternal from "./Tech3DIconsInternal";

const Tech3DIcons = React.memo(() => {
  const [resetKey, setResetKey] = useState(0);
  const [wavesShown, setWavesShown] = useState(false);

  const handleRestart = useCallback(() => {
    setResetKey((prev) => prev + 1);
    setWavesShown(true);
  }, []);

  return (
    <section aria-label="3D Technology Icons">
      <Tech3DIconsInternal
        key={resetKey}
        handleRestart={handleRestart}
        wavesAlreadyShown={wavesShown}
      />
    </section>
  );
});

export default Tech3DIcons;