import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

export function EntrancePins() {
  return (
    <group name="entrance-pins">
      {DIMENSIONS.ENTRANCE_PINS.map((p, i) => (
        <EntrancePin key={i} x={p.x} z={p.z} />
      ))}
    </group>
  );
}

interface EntrancePinProps {
  x: number;
  z: number;
}

function EntrancePin({ x, z }: EntrancePinProps) {
  return (
    <group position={[x, 0, z]} name="pin">
      <mesh name="pin-pole" castShadow geometry={new THREE.CylinderGeometry(0.08, 0.08, 2.5, 6)}>
        <primitive object={MATERIALS.entrancePin} />
      </mesh>
      <mesh name="pin-head" castShadow geometry={new THREE.SphereGeometry(0.35, 8, 8)} position={[0, 1.35, 0]}>
        <primitive object={MATERIALS.entrancePin} />
      </mesh>
    </group>
  );
}