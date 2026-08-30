import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

interface StallsProps {
  stallLightIntensity: number;
}

export function Stalls({ stallLightIntensity }: StallsProps) {
  const lightRefs = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => {
    lightRefs.current.forEach(light => {
      if (light && light.material instanceof THREE.MeshStandardMaterial) {
        light.material.emissiveIntensity = stallLightIntensity;
      }
    });
  }, [stallLightIntensity]);

  return (
    <group name="food-lanes">
      {DIMENSIONS.STALL_LANES.map((s, i) => (
        <Stall
          key={i}
          x={s.x}
          z={s.z}
          w={s.w}
          d={s.d}
          rot={s.rot}
          lightRef={(el, lightIdx) => {
            const baseIdx = i * 4 + lightIdx;
            lightRefs.current[baseIdx] = el;
          }}
        />
      ))}
    </group>
  );
}

interface StallProps {
  x: number;
  z: number;
  w: number;
  d: number;
  rot: number;
  lightRef: (el: THREE.Mesh | null, lightIndex: number) => void;
}

function Stall({ x, z, w, d, rot, lightRef }: StallProps) {
  const lightPositions = [
    { x: -w * 0.35, z: d / 2 + 0.3 },
    { x: w * 0.35, z: d / 2 + 0.3 },
    { x: -w * 0.35, z: -d / 2 - 0.3 },
    { x: w * 0.35, z: -d / 2 - 0.3 },
  ];

  return (
    <group position={[x, 0.15, z]} rotation={[0, rot, 0]}>
      <mesh name="stall-base" castShadow receiveShadow geometry={new THREE.BoxGeometry(w, DIMENSIONS.STALL_BASE_HEIGHT, d)}>
        <primitive object={MATERIALS.stallBase} />
      </mesh>
      <mesh name="stall-awning" castShadow geometry={new THREE.BoxGeometry(w + 0.4, DIMENSIONS.STALL_AWNING_HEIGHT, d + 0.4)} position={[0, DIMENSIONS.STALL_BASE_HEIGHT + DIMENSIONS.STALL_AWNING_HEIGHT / 2, 0]}>
        <primitive object={MATERIALS.stallAccent} />
      </mesh>
      <mesh name="stall-sign" castShadow geometry={new THREE.PlaneGeometry(1.5, 0.6)} position={[0, 1.1, d / 2 + 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={MATERIALS.stallSign} />
      </mesh>
      {lightPositions.map((lp, li) => (
        <StallLight
          key={li}
          position={[lp.x, 0.6, lp.z]}
          lightRef={el => lightRef(el, li)}
        />
      ))}
    </group>
  );
}

function StallLight({ position, lightRef }: { position: [number, number, number]; lightRef: (el: THREE.Mesh | null) => void }) {
  return (
    <group position={position}>
      <mesh ref={lightRef} name="stall-light" castShadow geometry={new THREE.SphereGeometry(0.15, 8, 8)}>
        <primitive object={MATERIALS.stallLight} />
      </mesh>
    </group>
  );
}