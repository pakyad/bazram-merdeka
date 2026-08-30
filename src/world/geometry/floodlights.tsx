import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

interface FloodlightsProps {
  intensity: number;
}

export function Floodlights({ intensity }: FloodlightsProps) {
  const lampRefs = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => {
    lampRefs.current.forEach(lamp => {
      if (lamp && lamp.material instanceof THREE.MeshStandardMaterial) {
        lamp.material.emissiveIntensity = intensity;
      }
    });
  }, [intensity]);

  return (
    <group name="floodlights">
      {[-1, 1].map(x => [-1, 1].map((z, zi) => (
        <FloodlightTower
          key={`${x}-${z}`}
          x={x * 21}
          z={z * 12.5}
          intensity={intensity}
          lampRef={(el, i) => { lampRefs.current[zi + (x === -1 ? 0 : 2)] = el; }}
        />
      )))}
    </group>
  );
}

interface FloodlightTowerProps {
  x: number;
  z: number;
  intensity: number;
  lampRef: (el: THREE.Mesh | null, index: number) => void;
}

function FloodlightTower({ x, z, intensity, lampRef }: FloodlightTowerProps) {
  const targetRef = useRef<THREE.Object3D>(null!);
  return (
    <group position={[x, 0, z]}>
      <mesh name="pole" castShadow receiveShadow geometry={new THREE.CylinderGeometry(DIMENSIONS.FLOODLIGHT_POLE_RADIUS, DIMENSIONS.FLOODLIGHT_POLE_RADIUS, DIMENSIONS.FLOODLIGHT_HEIGHT, 8)}>
        <primitive object={MATERIALS.floodlightPole} />
      </mesh>
        <group position={[0, DIMENSIONS.FLOODLIGHT_HEIGHT, 0]} rotation={[-Math.PI / 6, 0, 0]}>
          <mesh
            ref={el => lampRef(el, 0)}
            name="lamp"
            castShadow
            geometry={new THREE.BoxGeometry(DIMENSIONS.FLOODLIGHT_LAMP_SIZE.width, DIMENSIONS.FLOODLIGHT_LAMP_SIZE.height, DIMENSIONS.FLOODLIGHT_LAMP_SIZE.depth)}
          >
            <primitive object={MATERIALS.floodlightLamp} />
          </mesh>
          <spotLight
            position={[0, 0, 0]}
            target={targetRef}
            angle={0.45}
            penumbra={0.35}
            decay={1.8}
            distance={45}
            intensity={intensity * 2.5}
          />
          <object3D ref={targetRef} position={[0, -DIMENSIONS.FLOODLIGHT_HEIGHT, 0]} />
        </group>
    </group>
  );
}