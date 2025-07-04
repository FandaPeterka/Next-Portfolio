import React, { useState, useEffect } from "react";
import { Html, useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(progress);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 0);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <Html center>
      <div
        role="progressbar"
        aria-live="polite"
        aria-label="Loading progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={displayProgress.toFixed(2)}
        style={{
          fontSize: 14,
          color: "#f1f1f1",
          fontWeight: 800,
          marginTop: 40,
        }}
      >
        {displayProgress.toFixed(2)}%
      </div>
    </Html>
  );
};

export default Loader;