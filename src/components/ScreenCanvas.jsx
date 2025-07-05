"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  Suspense,
} from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { Preload, CubeCamera, Html } from "@react-three/drei";
import CameraControls from "camera-controls";
import * as THREE from "three";
import {
  TextureLoader,
  Clock,
  ShapeGeometry,
  Shape,
} from "three";
import gsap from "gsap";

import Loader from "./Loader";                 // fallback % loader
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
RectAreaLightUniformsLib.init();

/* --------------------------------------------------------------------- */
/* 1.  UTILITKY                                                           */
/* --------------------------------------------------------------------- */
CameraControls.install({ THREE });

/** sleduje <html data-theme="…"> a vrací aktuální theme string */
const useDocumentTheme = () => {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme")
  );
  useEffect(() => {
    const mo = new MutationObserver(() =>
      setTheme(document.documentElement.getAttribute("data-theme"))
    );
    mo.observe(document.documentElement, { attributes: true });
    return () => mo.disconnect();
  }, []);
  return theme;
};

/* --------------------------------------------------------------------- */
/* 2.  SVĚTLO – DIFFUSE GLOW                                              */
/* --------------------------------------------------------------------- */
const DiffuseGlowLight = ({
  position = [0, 0, 0],
  size = 10,
  intensity = 0.4,
  color = "#ffffff",
  isHeld = false,
}) => {
  const spriteRef = useRef();

  /* ► rad-grad textura --------------------------------------------------- */
  const glowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const { r, g, b } = new THREE.Color(color);
    const gradient = ctx.createRadialGradient(
      128, 128, 0, 128, 128, 128
    );
    gradient.addColorStop(0,   `rgba(${r * 255},${g * 255},${b * 255},1)`);
    gradient.addColorStop(0.3, `rgba(${r * 255},${g * 255},${b * 255},.66)`);
    gradient.addColorStop(0.6, `rgba(${r * 255},${g * 255},${b * 255},.33)`);
    gradient.addColorStop(1,   `rgba(${r * 255},${g * 255},${b * 255},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, [color]);

  /* ► animujeme opacity podle isHeld ----------------------------------- */
  useEffect(() => {
    if (!spriteRef.current) return;
    gsap.to(spriteRef.current.material, {
      opacity: isHeld ? 0.2 : intensity,
      duration: 0.4,
      ease: "power2.inOut",
    });
  }, [isHeld, intensity]);

  /* ► render ------------------------------------------------------------ */
  return (
    <sprite ref={spriteRef} position={position} scale={[size, size, size]}>
      <spriteMaterial
        attach="material"
        map={glowTexture}
        transparent
        opacity={intensity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
};

/* --------------------------------------------------------------------- */
/* 3.  THREE CAMERA CONTROLS (pan-only)                                   */
/* --------------------------------------------------------------------- */
function CameraControlsImpl({ disableZoom = true, disableRotate = true }) {
  const { camera, gl, invalidate } = useThree();
  const controlsRef = useRef(null);
  const clock = useRef(new Clock());

  useEffect(() => {
    controlsRef.current = new CameraControls(camera, gl.domElement);

    if (disableZoom) {
      controlsRef.current.mouseButtons.wheel  = CameraControls.ACTION.NONE;
      controlsRef.current.touches.two         = CameraControls.ACTION.NONE;
    }
    if (disableRotate) {
      controlsRef.current.mouseButtons.left   = CameraControls.ACTION.NONE;
      controlsRef.current.touches.one         = CameraControls.ACTION.NONE;
    }
    controlsRef.current.mouseButtons.right     = CameraControls.ACTION.NONE;
    controlsRef.current.addEventListener("change", invalidate);
    return () =>
      controlsRef.current?.removeEventListener("change", invalidate);
  }, [camera, gl, invalidate, disableZoom, disableRotate]);

  useFrame(() => {
    controlsRef.current?.update(clock.current.getDelta());
  });

  return null;
}

/* ► vrstva 0 povolená pro kameru (pro jistotu) */
function EnableScreenLayer() {
  const { camera } = useThree();
  useEffect(() => {
    camera.layers.enable(0);
  }, [camera]);
  return null;
}

/* --------------------------------------------------------------------- */
/* 4.  SCREEN BOX                                                         */
/* --------------------------------------------------------------------- */
const ScreenBox = ({
  reverse,
  imageUrl,
  dimensions,
  onHold,
  onRelease,
  inView = true,           // <<< reaguje na IntersectionObserver
}) => {
  const groupRef  = useRef();
  const texture   = useLoader(TextureLoader, imageUrl);
  const { width, height, depth } = dimensions;

  /* ► stavy interakce --------------------------------------------------- */
  const [hover, setHover]   = useState(false);
  const [held,  setHeld]    = useState(false);

  /* ► cílová rotace ----------------------------------------------------- */
  const baseAngleDeg  = reverse ? -25 : 25;
  const baseAngleRad  = (baseAngleDeg * Math.PI) / 180;

  useEffect(() => {
    if (!groupRef.current) return;
    const shouldFaceUser = inView || hover || held;
    gsap.to(groupRef.current.rotation, {
      y: shouldFaceUser ? 0 : baseAngleRad,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [inView, hover, held, baseAngleRad]);

  /* ► bezel geo --------------------------------------------------------- */
  const bezelGeometry = useMemo(() => {
    const t  = 0.25;                           // tloušťka rámu
    const ow = width  + t * 2.5;
    const oh = height + t * 2.5;

    const shape = new Shape()
      .moveTo(-ow/2, -oh/2)
      .lineTo(-ow/2,  oh/2)
      .lineTo( ow/2,  oh/2)
      .lineTo( ow/2, -oh/2)
      .lineTo(-ow/2, -oh/2);

    const hole = new THREE.Path()
      .moveTo(-width/2, -height/2)
      .lineTo(-width/2,  height/2)
      .lineTo( width/2,  height/2)
      .lineTo( width/2, -height/2)
      .lineTo(-width/2, -height/2);
    shape.holes.push(hole);
    return new ShapeGeometry(shape);
  }, [width, height]);

  /* ► render ------------------------------------------------------------ */
  return (
    <group ref={groupRef}>
      {/* displej + tělo */}
      <mesh
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onPointerDown={() => { setHeld(true);  onHold?.();   }}
        onPointerUp  ={() => { setHeld(false); onRelease?.();}}
      >
        <boxGeometry args={[width, height, depth]} />
        {Array.from({ length: 6 }).map((_, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            color={i === 4 ? "#ffffff" : "#4a5568"}
            roughness={i === 4 ? 0.7 : 1}
            metalness={i === 4 ? 0.2 : 0}
            map={i === 4 ? texture : null}
          />
        ))}
      </mesh>

      {/* rámeček */}
      <mesh geometry={bezelGeometry} position={[0, 0, depth/2 + 0.015]}>
        <meshStandardMaterial
          color={
            getComputedStyle(document.documentElement)
              .getPropertyValue("--bezel-color")
              .trim() || "#808080"
          }
        />
      </mesh>

      {/* odlesk */}
      <CubeCamera resolution={128} frames={Infinity}>
        {(envMap) => (
          <mesh
            position={[0, 0, depth/2 + 0.02]}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
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
};

/* --------------------------------------------------------------------- */
/* 5.  SCREEN CANVAS (export default)                                     */
/* --------------------------------------------------------------------- */
const ScreenCanvas = ({ reverse, imageUrls, dimensions }) => {
  /* slideshow ----------------------------------------------------------- */
  const [idx, setIdx] = useState(0);
  const total = imageUrls.length;
  const currentImage = imageUrls[idx];

  const prev = () => setIdx((p) => (p - 1 + total) % total);
  const next = () => setIdx((p) => (p + 1) % total);

  /* held state pro světlo ---------------------------------------------- */
  const [held, setHeld] = useState(false);

  /* intersection observer pro „inView“ ---------------------------------- */
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.70 }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  /* render -------------------------------------------------------------- */
  return (
    <div ref={containerRef} className="sc-container">
      <Canvas
        className="sc-canvas"
        camera={{ position: [0, 0, 25], fov: 45 }}
      >
        <EnableScreenLayer />

        <Suspense fallback={<Loader />}>
          <CameraControlsImpl disableZoom disableRotate />

          {/* světla */}
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
            isHeld={held}
          />

          {/* obrazovka */}
          <ScreenBox
            reverse={reverse}
            imageUrl={currentImage}
            dimensions={dimensions}
            onHold={() => setHeld(true)}
            onRelease={() => setHeld(false)}
            inView={inView}
          />
        </Suspense>

        <Preload all />
      </Canvas>

      {/* ovládací šipky */}
      <div className="sc-controls">
        <button
          onClick={prev}
          className="sc-control-button"
          aria-label="Previous screen"
        >
          &lt;
        </button>
        <button
          onClick={next}
          className="sc-control-button"
          aria-label="Next screen"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ScreenCanvas;