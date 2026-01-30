"use client";

import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BASE_Y_ROTATION = -Math.PI / 2;
const MAX_X_ROTATION = 0.08;

// same size as your original working code
const BASE_SCALE = 3;

type Props = {
  url: string;
  visible: boolean;
};

function toMaterialArray(
  material: THREE.Material | THREE.Material[] | undefined,
): THREE.Material[] {
  if (!material) return [];
  return Array.isArray(material) ? material : [material];
}

function applyOpacity(mat: THREE.Material, nextOpacity: number) {
  if (
    mat instanceof THREE.MeshStandardMaterial ||
    mat instanceof THREE.MeshPhysicalMaterial ||
    mat instanceof THREE.MeshPhongMaterial ||
    mat instanceof THREE.MeshLambertMaterial ||
    mat instanceof THREE.MeshBasicMaterial
  ) {
    mat.transparent = true;
    mat.opacity += (nextOpacity - mat.opacity) * 0.08;
    mat.needsUpdate = true;
  }
}

export default function Model({ url, visible }: Props) {
  const gltf = useGLTF(url);
  const modelRef = useRef<THREE.Group | null>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    const group = modelRef.current;
    if (!group) return;

    // Your original mouse rotation
    const targetY = BASE_Y_ROTATION + mouseX.current * 0.35;

    const targetX = THREE.MathUtils.clamp(
      mouseY.current * 0.06,
      -MAX_X_ROTATION,
      MAX_X_ROTATION,
    );

    group.rotation.y += (targetY - group.rotation.y) * 0.05;
    group.rotation.x += (targetX - group.rotation.x) * 0.035;

    // Smooth switch animation BUT keep original size
    const targetScale = visible ? BASE_SCALE : BASE_SCALE * 0.92; // tiny shrink only
    const s = group.scale.x + (targetScale - group.scale.x) * 0.1;
    group.scale.setScalar(s);

    // Smooth fade (if materials allow)
    const targetOpacity = visible ? 1 : 0;
    gltf.scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = toMaterialArray(obj.material);
      mats.forEach((m) => applyOpacity(m, targetOpacity));
    });
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={BASE_SCALE}
      position={[0, -1.3, 0]}
      rotation={[0, BASE_Y_ROTATION, 0]}
    />
  );
}
