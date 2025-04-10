"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom/client";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import CameraControls from "camera-controls";
import { useTranslation } from "react-i18next";
import techData from "../../data/dataTech3DIcons";
import TechCard from "./TechCard";
import ControlButtons from "./ControlButtons";
import StaticDescription from "./StaticDescription";
import "./Tech3DIcons.css";
import FourDirectionalWaves from "../FourDirectionalWaves";
import { animateTransform, animateSelect, animateReset } from "./animations";

CameraControls.install({ THREE });

const Tech3DIconsInternal = React.memo(({ handleRestart, wavesAlreadyShown }) => {
  const { t } = useTranslation();
  const [activeLayout, setActiveLayout] = useState("sphere");
  const [selectedTech, setSelectedTech] = useState(null);

  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraControlsRef = useRef(null);

  const objects = useRef([]);
  const targets = useRef({ table: [], sphere: [], helix: [] });

  const transform = useCallback((targetList, duration) => {
    animateTransform(
      objects.current,
      targetList,
      rendererRef.current,
      sceneRef.current,
      cameraRef.current,
      duration
    );
  }, []);

  const selectCard = useCallback((index) => {
    setSelectedTech(index);
    animateSelect(
      objects.current,
      index,
      rendererRef.current,
      sceneRef.current,
      cameraRef.current
    );
  }, []);

  const resetSelection = useCallback((callback) => {
    animateReset(
      objects.current,
      targets.current,
      activeLayout,
      selectedTech,
      rendererRef.current,
      sceneRef.current,
      cameraRef.current,
      () => {
        setSelectedTech(null);
        if (callback) callback();
      }
    );
  }, [activeLayout, selectedTech]);

  const handleLayoutChange = useCallback((newLayout) => {
    if (selectedTech !== null) {
      resetSelection(() => {
        setActiveLayout(newLayout);
        transform(targets.current[newLayout], 1500);
      });
    } else {
      setActiveLayout(newLayout);
      transform(targets.current[newLayout], 1500);
    }
  }, [selectedTech, resetSelection, transform]);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 5000);
    camera.position.z = 800;
    cameraRef.current = camera;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const isSmallScreen = width < 600;
    const sphereRadius = isSmallScreen ? 150 : 200;
    const ringRadius = isSmallScreen ? 150 : 200;
    const spacingX = isSmallScreen ? 70 : 100;
    const spacingY = isSmallScreen ? 90 : 120;

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

    const handleCardClick = (i) => {
      if (selectedTech == null) {
        selectCard(i);
      }
    };

    techData.forEach((tech, i) => {
      const container = document.createElement("div");
      container.className = "element";
      container.addEventListener("click", () => handleCardClick(i));
      const root = ReactDOM.createRoot(container);
      root.render(
        <TechCard
          tech={tech}
          index={i}
          onClick={() => handleCardClick(i)}
          isSelected={selectedTech === i}
        />
      );
      const cssObject = new CSS3DObject(container);
      const pivot = new THREE.Object3D();
      pivot.position.copy(spherePositions[i]);
      pivot.add(cssObject);
      pivot.element = cssObject.element;
      scene.add(pivot);
      objects.current.push(pivot);

      const tableX = (i % 4) * spacingX - (3 * spacingX) / 2;
      const tableY = -Math.floor(i / 4) * spacingY + 80;
      const tableTarget = new THREE.Object3D();
      tableTarget.position.set(tableX, tableY, 0);
      targets.current.table.push(tableTarget);
    });

    for (let i = 0; i < l; i++) {
      const phi = Math.acos(-1 + (2 * i) / l);
      const theta = Math.sqrt(l * Math.PI) * phi;
      const sphereObj = new THREE.Object3D();
      sphereObj.position.setFromSphericalCoords(sphereRadius, phi, theta);
      vector.copy(sphereObj.position).multiplyScalar(1.5);
      sphereObj.lookAt(vector);
      targets.current.sphere.push(sphereObj);

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

    const renderer = new CSS3DRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

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
    cameraControlsRef.current = cameraControls;

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      cameraControls.update(delta);
      renderer.render(scene, camera);
    }
    animate();

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

    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      scene.clear();
      objects.current = [];
      targets.current = { table: [], sphere: [], helix: [] };
    };
  }, []);

  return (
    <div className="wrapper" style={{ position: "relative" }}>
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
          {/* Statický text pro SEO – přenos předpřeložených dat do serverové komponenty */}
          <StaticDescription 
            title={t(techData[selectedTech].title)} 
            description={t(techData[selectedTech].description)} 
          />
        </div>
      )}
      {!wavesAlreadyShown && <FourDirectionalWaves isOverlay={true} />}
    </div>
  );
});

export default Tech3DIconsInternal;