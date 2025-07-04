"use client";               // Klientský kód v Next.js
import React, { useEffect, useState, useRef } from "react";
import config from "../data/dataLedMatrix";

/* ------------------------------ cache ------------------------------ */
const ledMatrixCache = new Map();

/* ------------------------- helper – load image --------------------- */
async function loadImageAndGetData(imgSrc, height, resolution, blurAmount) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const aspect = img.width / img.height;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = height * resolution;
      canvas.width  = canvas.height * aspect;
      if (blurAmount > 0) ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };
    img.onerror = reject;
  });
}

/* ========================== SingleLedMatrix ======================== */
function SingleLedMatrix({ configOverrides }) {
  const containerRef = useRef(null);
  const dotRefs      = useRef([]);

  const [initialized, setInit]   = useState(false);
  const [finalPixels, setPixels] = useState([]);
  const [matrixWidth, setW]      = useState(0);

  const {
    src, height, resolution, dotSize, gap, edgeThreshold, blurAmount,
  } = { ...config.global, ...configOverrides };

  /* --- barvy podle CSS custom props --- */
  const [ledOnColor,  setOn ] = useState("#00ffff");
  const [ledOffColor, setOff] = useState("transparent");
  useEffect(() => {
    const update = () => {
      const cs   = getComputedStyle(document.documentElement);
      setOn (cs.getPropertyValue("--led-on-color").trim()  || "#00ffff");
      setOff(cs.getPropertyValue("--led-off-color").trim() || "transparent");
    };
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  /* --- data přes worker / cache --- */
  useEffect(() => {
    const key = JSON.stringify({ src, height, resolution, blurAmount, edgeThreshold });
    if (ledMatrixCache.has(key)) {
      const { pixels, matrixWidth } = ledMatrixCache.get(key);
      setPixels(pixels); setW(matrixWidth); return;
    }
    (async () => {
      try {
        const imageData = await loadImageAndGetData(src, height, resolution, blurAmount);
        const worker = new Worker("/workers/LedMatrixWorker.js", { type: "module" });
        worker.onmessage = ({ data: { pixels, width } }) => {
          ledMatrixCache.set(key, { pixels, matrixWidth: width });
          setPixels(pixels); setW(width); worker.terminate();
        };
        worker.postMessage({ imageData, resolution, edgeThreshold });
      } catch (err) { console.error(err); }
    })();
  }, [src, height, resolution, blurAmount, edgeThreshold]);

  /* --- vytvoření DOM mřížky --- */
  useEffect(() => {
    if (!containerRef.current || !finalPixels.length) return;
    dotRefs.current = [];
    containerRef.current.innerHTML = "";

    finalPixels.forEach(() => {
      const d = document.createElement("div");
      d.className = "ledmatrix-dot";
      d.style.width  = `${dotSize}px`;
      d.style.height = `${dotSize}px`;
      d.style.backgroundColor = ledOffColor;
      containerRef.current.appendChild(d);
      dotRefs.current.push(d);
    });

    containerRef.current.style.display              = "grid";
    containerRef.current.style.gridTemplateColumns = `repeat(${matrixWidth}, ${dotSize}px)`;
    containerRef.current.style.gridTemplateRows    = `repeat(${height}, ${dotSize}px)`;
    containerRef.current.style.gap                 = `${gap}px`;

    setInit(true);
  }, [finalPixels, dotSize, ledOffColor, gap, matrixWidth, height]);

  /* --- blikání ----------------------------------------------------- */
  useEffect(() => {
    if (!initialized || !dotRefs.current.length) return;
    const start = Date.now();
    const tick  = () => {
      const elapsed = Date.now() - start;
      if (elapsed > 800) {
        finalPixels.forEach((on, i) => {
          dotRefs.current[i].style.backgroundColor = on ? ledOnColor : ledOffColor;
        });
        return;
      }
      dotRefs.current.forEach((dot, i) => {
        if (finalPixels[i] && Math.random() < 0.05) {
          const c = dot.style.backgroundColor;
          dot.style.backgroundColor = c === ledOnColor ? ledOffColor : ledOnColor;
        }
      });
    };
    const id = setInterval(tick, 150);
    return () => clearInterval(id);
  }, [initialized, finalPixels, ledOnColor, ledOffColor]);

  return (
    <div className="single-ledmatrix-container" aria-hidden="true">
      <div className="ledmatrix-grid" ref={containerRef} aria-hidden="true" />
    </div>
  );
}

/* =============================== LedMatrix ========================= */
/**
 * Props:
 *   – activeSection (index)  → určuje, kterou předlohu zobrazit
 *   – showDots (bool) [default = true] → zap / vyp mřížku
 */
export default function LedMatrix({ activeSection, showDots = true }) {
  const { images } = config;
  const [idx, setIdx] = useState(0);

  useEffect(() => setIdx(activeSection % images.length), [activeSection, images]);

  if (!images[idx]) return null;

  return (
    <div className="ledmatrix-wrapper" aria-hidden="true">
      {showDots && <SingleLedMatrix configOverrides={images[idx]} />}
    </div>
  );
}