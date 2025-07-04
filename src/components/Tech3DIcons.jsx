"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import CameraControls from "camera-controls";
import { BiMove, BiBlock } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { FaStar } from "react-icons/fa";
import techData from "../data/dataTech3DIcons";
import TechCard from "./TechCard";
import ControlButtons from "./ControlButtons";
import FourDirectionalWaves from "./FourDirectionalWaves";

// Animace
import {
  animateTransform,
  animateSelect,
  animateReset
} from "../motion/animations";

// Nutné pro CameraControls
CameraControls.install({ THREE });

function Tech3DIconsInternal({ handleRestart, wavesAlreadyShown }) {
  const { t } = useTranslation();

  // Výchozí layout = "sphere"
  const [activeLayout, setActiveLayout] = useState("sphere");
  // Index vybrané karty (nebo null)
  const [selectedTech, setSelectedTech] = useState(null);
  // Stav povolení/zakázání pohybu
  const [isMovementEnabled, setIsMovementEnabled] = useState(false);

  // Refs na scénu
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraControlsRef = useRef(null);

  // Všechny 3D objekty (karty)
  const objects = useRef([]);
  // Cílové pozice pro jednotlivé layouty: table, sphere, helix
  const targets = useRef({ table: [], sphere: [], helix: [] });

  // Přepnutí layoutu – animuje se nový layout
  const transform = (targetList, duration) => {
    animateTransform(
      objects.current,
      targetList,
      rendererRef.current,
      sceneRef.current,
      cameraRef.current,
      duration
    );
  };

  // Klik na kartu – vybere kartu
  const selectCard = (index) => {
    setSelectedTech(index);
    animateSelect(objects.current, index, rendererRef.current, sceneRef.current, cameraRef.current);
  };

  // Klik na Back – vrací vybranou kartu do aktuálně aktivního layoutu (activeLayout)
  const resetSelection = (callback) => {
    animateReset(
      objects.current,
      targets.current,
      activeLayout, // Použije se aktuální layout
      selectedTech,
      rendererRef.current,
      sceneRef.current,
      cameraRef.current,
      () => {
        setSelectedTech(null);
        if (callback) callback();
      }
    );
  };

  // Přepnutí layoutu pomocí tlačítek
  const handleLayoutChange = (newLayout) => {
    if (selectedTech !== null) {
      // Nejdříve resetovat vybranou kartu do aktuálního layoutu
      resetSelection(() => {
        setActiveLayout(newLayout);
        transform(targets.current[newLayout], 1500);
      });
    } else {
      setActiveLayout(newLayout);
      transform(targets.current[newLayout], 1500);
    }
  };

  // Přepínání povolení pohybu
  const toggleMovement = () => {
    setIsMovementEnabled((prev) => !prev);
  };

  // Vytvoření scény – inicializace tříd a objektů
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Kamera
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 5000);
    camera.position.z = 800;
    cameraRef.current = camera;

    // Scéna
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Responsivní parametry
    const isSmallScreen = width < 600;
    const sphereRadius = isSmallScreen ? 150 : 200;
    const ringRadius = isSmallScreen ? 150 : 200;
    const spacingX = isSmallScreen ? 70 : 100;
    const spacingY = isSmallScreen ? 90 : 120;

    // Vypočítané pozice pro sphere (výchozí rozložení)
    const l = techData.length;
    const spherePositions = [];
    const vector = new THREE.Vector3();

    for (let i = 0; i < l; i++) {
      const phi = Math.acos(-1 + (2 * i) / l);
      const theta = Math.sqrt(l * Math.PI) * phi;
      const pos = new THREE.Vector3();
      pos.setFromSphericalCoords(sphereRadius, phi, theta);
      spherePositions.push(pos);
    }

    // Vytváření karet
    const handleCardClick = (i) => {
      if (selectedTech == null) {
        selectCard(i);
      }
    };

    techData.forEach((tech, i) => {
      // HTML container karty
      const container = document.createElement("div");
      container.className = "element";
      container.addEventListener("click", () => handleCardClick(i));

      // React root pro TechCard
      const root = ReactDOM.createRoot(container);
      root.render(
        <TechCard
          tech={tech}
          index={i}
          onClick={() => handleCardClick(i)}
          isSelected={selectedTech === i}
        />
      );

      // Vytvoření CSS3DObject
      const cssObject = new CSS3DObject(container);
      // Pivot – výchozí pozice je v rozložení sphere
      const pivot = new THREE.Object3D();
      pivot.position.copy(spherePositions[i]);
      pivot.add(cssObject);

      pivot.element = cssObject.element;
      scene.add(pivot);
      objects.current.push(pivot);

      // Cílová pozice pro layout "table"
      const tableX = (i % 4) * spacingX - (3 * spacingX) / 2;
      const tableY = -Math.floor(i / 4) * spacingY + 80;
      const tableTarget = new THREE.Object3D();
      tableTarget.position.set(tableX, tableY, 0);
      targets.current.table.push(tableTarget);
    });

    // Nastavení cílových pozic pro rozložení "sphere" a "helix"
    for (let i = 0; i < l; i++) {
      // Sphere cíl
      const phi = Math.acos(-1 + (2 * i) / l);
      const theta = Math.sqrt(l * Math.PI) * phi;
      const sphereObj = new THREE.Object3D();
      sphereObj.position.setFromSphericalCoords(sphereRadius, phi, theta);
      vector.copy(sphereObj.position).multiplyScalar(1.5);
      sphereObj.lookAt(vector);
      targets.current.sphere.push(sphereObj);

      // Helix cíl
      const helixTheta = i * 0.523 + Math.PI;
      const helixObj = new THREE.Object3D();
      helixObj.position.setFromCylindricalCoords(ringRadius, helixTheta, 0);
      vector.set(
        helixObj.position.x * 1.5,
        helixObj.position.y,
        helixObj.position.z * 1.5
      );
      helixObj.lookAt(vector);
      targets.current.helix.push(helixObj);
    }

    // Renderer
    const renderer = new CSS3DRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // CameraControls
    const cameraControls = new CameraControls(camera, renderer.domElement);
    cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    cameraControls.mouseButtons.right = CameraControls.ACTION.NONE;
    cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;
    cameraControls.touches.one = CameraControls.ACTION.TOUCH_ROTATE;
    cameraControls.touches.two = CameraControls.ACTION.NONE;
    cameraControls.minDistance = 200;
    cameraControls.maxDistance = 2000;
    cameraControls.smoothTime = 0.1;
    cameraControls.draggingSmoothTime = 0.2;
    cameraControls.enabled = isMovementEnabled; // výchozí stav pohybu
    cameraControlsRef.current = cameraControls;

    // Renderovací smyčka
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      cameraControls.update(delta);
      renderer.render(scene, camera);
    }
    animate();

    // Responzivita
    const handleResize = () => {
      const scaleFactor = Math.max(0.8, window.innerWidth / 1920);
      objects.current.forEach((pivot, i) => {
        if (selectedTech !== null && i === selectedTech) {
          pivot.scale.set(1.1, 1.1, 1.1);
        } else {
          pivot.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup při odmountování
    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      scene.clear();
      objects.current = [];
      targets.current = { table: [], sphere: [], helix: [] };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Upravujeme povolení pohybu při změně stavu
  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.enabled = isMovementEnabled;
    }
  }, [isMovementEnabled]);

  // Renderování komponenty
  return (
    <div className="wrapper" style={{ position: "relative" }}>
      {/* Tlačítko pro povolení/zakázání pohybu */}
<button
  onClick={toggleMovement}
  style={{
    position: "absolute",
    top: "40px",                // posun dolů
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    padding: "8px 20px",
    borderRadius: "8px",
    background: "#222",
    color: "#fff",
    border: isMovementEnabled ? "2px solid #4CAF50" : "2px solid #444",
    boxShadow: isMovementEnabled ? "0 0 10px #4CAF50" : "none",
    display: "flex",
    alignItems: "center",
    gap: "3px",
    cursor: "pointer"
  }}
>
  {isMovementEnabled ? <BiMove size={18} /> : <BiBlock size={18} />}
  {isMovementEnabled ? "Moving enabled" : "Moving disabled"}
</button>

      <div ref={mountRef} className="stage" />

      <ControlButtons
        selectedTech={selectedTech}
        handleLayoutChange={handleLayoutChange}
        activeLayout={activeLayout}
        handleRestart={handleRestart}
        resetSelection={resetSelection}
      />

      {selectedTech !== null && (
        <div className="description">
          <h2>{t(techData[selectedTech].title)}</h2>
          <p>{t(techData[selectedTech].description)}</p>
          <p>
            <strong>{t("experience")}: </strong>
            {techData[selectedTech].experience} {" "}
            {techData[selectedTech].experience === 1 ? t("year") : t("years")}
          </p>
          <p>
            <strong>{t("skill")}: </strong>
            {Array.from({ length: techData[selectedTech].rating }).map((_, i) => (
              <FaStar key={i} />
            ))}
          </p>
        </div>
      )}

      {!wavesAlreadyShown && <FourDirectionalWaves isOverlay={true} />}
    </div>
  );
}

// Obalová komponenta – restart (unmount/mount)
export default function Tech3DIcons() {
  const [resetKey, setResetKey] = useState(0);
  const [wavesShown, setWavesShown] = useState(false);

  const handleRestart = () => {
    setResetKey((prev) => prev + 1);
    setWavesShown(true);
  };

  return (
    <div>
      <Tech3DIconsInternal
        key={resetKey}
        handleRestart={handleRestart}
        wavesAlreadyShown={wavesShown}
      />
    </div>
  );
}