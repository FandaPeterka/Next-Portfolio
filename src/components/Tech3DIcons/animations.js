// animations.js
"use client";
import gsap from "gsap";

export const animateTransform = (
  objects,
  targetList,
  renderer,
  scene,
  camera,
  duration
) => {
  const sec = duration / 1000;
  objects.forEach((object, i) => {
    gsap.killTweensOf(object.position);
    gsap.killTweensOf(object.rotation);
    const target = targetList[i];
    const tl = gsap.timeline({
      onUpdate: () => renderer.render(scene, camera),
    });
    tl.to(object.position, {
      x: target.position.x,
      y: target.position.y,
      z: target.position.z,
      duration: sec,
      ease: "power3.inOut",
    });
    tl.to(
      object.rotation,
      {
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z,
        duration: sec,
        ease: "power3.inOut",
      },
      0
    );
    object.element.style.opacity = 1;
    object.element.classList.remove("selected");
  });
};

export const animateSelect = (objects, index, renderer, scene, camera) => {
  objects.forEach((object, i) => {
    gsap.killTweensOf(object.position);
    gsap.killTweensOf(object.rotation);
    gsap.killTweensOf(object.scale);
    gsap.killTweensOf(object.element);
    if (i !== index) {
      const tl = gsap.timeline({ onUpdate: () => renderer.render(scene, camera) });
      tl.to(object.position, {
        x: window.innerWidth,
        duration: 1,
        ease: "power3.inOut",
      });
      tl.to(
        object.element,
        {
          opacity: 0,
          duration: 1,
          ease: "power3.inOut",
        },
        0
      );
    } else {
      const tl = gsap.timeline({ onUpdate: () => renderer.render(scene, camera) });
      tl.to(object.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "power3.inOut",
      });
      tl.to(
        object.scale,
        {
          x: 1.1,
          y: 1.1,
          z: 1.1,
          duration: 1,
          ease: "power3.inOut",
        },
        "<"
      );
      object.element.classList.add("selected");
    }
  });
};

export const animateReset = (
  objects,
  targets,
  selectedLayout,
  selectedTech,
  renderer,
  scene,
  camera,
  callback
) => {
  if (!selectedLayout) {
    if (callback) callback();
    return;
  }
  const sec = 0.8;
  const masterTL = gsap.timeline({
    onUpdate: () => renderer.render(scene, camera),
    onComplete: () => {
      if (callback) callback();
    },
  });
  objects.forEach((object, i) => {
    gsap.killTweensOf(object.position);
    gsap.killTweensOf(object.rotation);
    gsap.killTweensOf(object.scale);
    gsap.killTweensOf(object.element);
    const target = targets[selectedLayout][i];
    masterTL.to(
      object.position,
      {
        x: target.position.x,
        y: target.position.y,
        z: target.position.z,
        duration: sec,
        ease: "power3.inOut",
      },
      0
    );
    masterTL.to(
      object.rotation,
      {
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z,
        duration: sec,
        ease: "power3.inOut",
      },
      0
    );
    masterTL.to(
      object.scale,
      {
        x: target.scale ? target.scale.x : object.scale.x,
        y: target.scale ? target.scale.y : object.scale.y,
        z: target.scale ? target.scale.z : object.scale.z,
        duration: sec,
        ease: "power3.inOut",
      },
      0
    );
    masterTL.to(
      object.element,
      {
        opacity: 1,
        duration: sec,
        ease: "power3.inOut",
      },
      0
    );
    object.element.classList.remove("selected");
  });
};