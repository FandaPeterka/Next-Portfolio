"use client";
import React from "react";
import AnimatedButton from "./AnimatedButton";

const AnimatedButtons = React.memo(({ handleLayoutChange }) => {
  return (
    <>
      <AnimatedButton type="table" onClick={() => handleLayoutChange("table")} />
      <AnimatedButton type="sphere" onClick={() => handleLayoutChange("sphere")} />
      <AnimatedButton type="ring" onClick={() => handleLayoutChange("helix")} />
    </>
  );
});

export default AnimatedButtons;