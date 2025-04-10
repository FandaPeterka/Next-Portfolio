"use client";
import React, { useRef, useState, Suspense, useMemo, useEffect, useCallback } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { Preload, CubeCamera } from "@react-three/drei";
import CameraControls from "camera-controls";
import { TextureLoader, Clock } from "three";
import * as THREE from "three";
import gsap from "gsap";
import Loader from "./Loader";
import "./ScreenCanvas.css";

// Inicializace RectAreaLightUniformsLib a instalace CameraControls
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
RectAreaLightUniformsLib.init();
CameraControls.install({ THREE });

/* DiffuseGlowLight – simuluje rozptýlené světlo s plynulejším přechodem jasu.
   Prop isHeld umožňuje pomocí GSAP animovat jeho opacity. */
const DiffuseGlowLight = React.memo(({
  position = [0, 0, 0],
  size = 10,
  intensity = 0.4,
  color = "#ffffff",
  isHeld = false,
}) => {
  const spriteRef = useRef();

  const glowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const threeColor = new THREE.Color(color);
    const r = Math.floor(threeColor.r * 255);
    const g = Math.floor(threeColor.g * 255);
    const b = Math.floor(threeColor.b * 255);
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(0.33, `rgba(${r}, ${g}, ${b}, 0.66)`);
    gradient.addColorStop(0.66, `rgba(${r}, ${g}, ${b}, 0.33)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [color]);

  useEffect(() => {
    if (spriteRef.current) {
      const targetOpacity = isHeld ? 0.2 : intensity;
      gsap.to(spriteRef.current.material, {
        opacity: targetOpacity,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [isHeld, intensity]);

  return (
    <sprite ref={spriteRef} position={position} scale={[size, size, size]}>
      <spriteMaterial
        attach="material"
        map={glowTexture}
        transparent
        opacity={intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
});

/* useDocumentTheme – hook pro sledování aktuálního tématu (data-theme) na dokumentu */
const useDocumentTheme = () => {
  const [docTheme, setDocTheme] = useState(
    document.documentElement.getAttribute("data-theme")
  );
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          setDocTheme(document.documentElement.getAttribute("data-theme"));
        }
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return docTheme;
};

/* CameraControlsImpl – komponenta ovládající kameru pomocí CameraControls.
   Zakazuje zoom a otáčení dle props. */
function CameraControlsImpl({ disableZoom = true, disableRotate = true }) {
  const controlsRef = useRef(null);
  const { camera, gl, invalidate } = useThree();
  const clockRef = useRef(new Clock());
  
  useEffect(() => {
    controlsRef.current = new CameraControls(camera, gl.domElement);
    if (disableZoom) {
      controlsRef.current.mouseButtons.wheel = CameraControls.ACTION.NONE;
      controlsRef.current.touches.two = CameraControls.ACTION.NONE;
    }
    if (disableRotate) {
      controlsRef.current.mouseButtons.left = CameraControls.ACTION.NONE;
      controlsRef.current.touches.one = CameraControls.ACTION.NONE;
    }
    controlsRef.current.mouseButtons.right = CameraControls.ACTION.NONE;
    controlsRef.current.addEventListener("change", invalidate);
    return () => {
      controlsRef.current.removeEventListener("change", invalidate);
    };
  }, [camera, gl, invalidate, disableZoom, disableRotate]);
  
  useFrame(() => {
    const delta = clockRef.current.getDelta();
    controlsRef.current?.update(delta);
  });
  
  return null;
}

/* EnableScreenLayer – povolí standardní vrstvu kamery (layer 0) */
function EnableScreenLayer() {
  const { camera } = useThree();
  useEffect(() => {
    camera.layers.enable(0);
  }, [camera]);
  return null;
}

/* ScreenBox – vykresluje objekt obrazovky v 3D scéně s texturovaným boxem, rámečkem
   a odleskem (CubeCamera + GSAP animace). Reaguje na pointer události. */
const ScreenBox = React.memo(({ reverse, imageUrl, dimensions, onHold, onRelease }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const { width, height, depth } = dimensions;
  const texture = useLoader(TextureLoader, imageUrl);
  const initialAngle = reverse ? -25 : 25;
  const initialAngleRad = useMemo(() => (initialAngle * Math.PI) / 180, [initialAngle]);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  
  useEffect(() => {
    if (groupRef.current) {
      const targetRotation = isHovering || isHeld ? 0 : initialAngleRad;
      gsap.to(groupRef.current.rotation, {
        y: targetRotation,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [isHovering, isHeld, initialAngleRad]);
  
  const handlePointerOver = useCallback(() => setIsHovering(true), []);
  const handlePointerOut = useCallback(() => setIsHovering(false), []);
  const handlePointerDown = useCallback(() => {
    setIsHeld(true);
    onHold && onHold();
  }, [onHold]);
  const handlePointerUp = useCallback(() => {
    setIsHeld(false);
    onRelease && onRelease();
  }, [onRelease]);
  
  // Konstrukce geometrie rámečku – memoizována podle šířky a výšky
  const bezelGeometry = useMemo(() => {
    const frameThickness = 0.25;
    const outerWidth = width + frameThickness * 2.5;
    const outerHeight = height + frameThickness * 2.5;
    const shape = new THREE.Shape();
    shape.moveTo(-outerWidth / 2, -outerHeight / 2);
    shape.lineTo(-outerWidth / 2, outerHeight / 2);
    shape.lineTo(outerWidth / 2, outerHeight / 2);
    shape.lineTo(outerWidth / 2, -outerHeight / 2);
    shape.lineTo(-outerWidth / 2, -outerHeight / 2);
    const hole = new THREE.Path();
    hole.moveTo(-width / 2, -height / 2);
    hole.lineTo(-width / 2, height / 2);
    hole.lineTo(width / 2, height / 2);
    hole.lineTo(width / 2, -height / 2);
    hole.lineTo(-width / 2, -height / 2);
    shape.holes.push(hole);
    return new THREE.ShapeGeometry(shape);
  }, [width, height]);
  
  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <boxGeometry args={[width, height, depth]} />
        {[...Array(6)].map((_, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            color={i === 4 ? "#ffffff" : "#4a5568"}
            metalness={i === 4 ? 0.2 : 0}
            roughness={i === 4 ? 0.7 : 1}
            map={i === 4 ? texture : null}
          />
        ))}
      </mesh>
      <mesh geometry={bezelGeometry} position={[0, 0, depth / 2 + 0.015]}>
        <meshStandardMaterial
          color={
            getComputedStyle(document.documentElement)
              .getPropertyValue("--bezel-color")
              .trim() || "#808080"
          }
        />
      </mesh>
      <CubeCamera resolution={128} frames={Infinity}>
        {(envMap) => (
          <mesh
            position={[0, 0, depth / 2 + 0.02]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <planeGeometry args={[width, height]} />
            <meshPhysicalMaterial
              envMap={envMap}
              transparent
              opacity={0.4}
              metalness={1}
              roughness={0.01}
              clearcoat={1}
              clearcoatRoughness={0}
              envMapIntensity={2}
            />
          </mesh>
        )}
      </CubeCamera>
    </group>
  );
});

/* Hlavní komponenta ScreenCanvas – obaluje Canvas se scénou, obsahuje kontrolní tlačítka
   a pomocí Suspense zobrazuje Loader při načítání 3D obsahu. */
const ScreenCanvas = React.memo(({ reverse, imageUrls, dimensions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = imageUrls.length;
  const currentImage = useMemo(() => imageUrls[currentIndex], [imageUrls, currentIndex]);
  const [isHeld, setIsHeld] = useState(false);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);
  const handleHold = useCallback(() => setIsHeld(true), []);
  const handleRelease = useCallback(() => setIsHeld(false), []);

  return (
    <div className="sc-container">
      <Canvas camera={{ position: [0, 0, 25], fov: 45 }} className="sc-canvas">
        <EnableScreenLayer />
        <Suspense fallback={<Loader />}>
          <CameraControlsImpl disableZoom disableRotate />
          <ambientLight intensity={7} />
          <spotLight
            position={[10, 20, 20]}
            intensity={2.5}
            angle={0.3}
            penumbra={0.5}
            castShadow
          />
          <DiffuseGlowLight
            position={[0, 0, 25]}
            size={30}
            intensity={0.4}
            color="#ffffff"
            isHeld={isHeld}
          />
          <ScreenBox
            reverse={reverse}
            imageUrl={currentImage}
            dimensions={dimensions}
            onHold={handleHold}
            onRelease={handleRelease}
          />
        </Suspense>
        <Preload all />
      </Canvas>
      <div className="sc-controls">
        <button onClick={handlePrev} className="sc-control-button">
          &lt;
        </button>
        <button onClick={handleNext} className="sc-control-button">
          &gt;
        </button>
      </div>
    </div>
  );
});

export default ScreenCanvas;