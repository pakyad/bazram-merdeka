import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

export function Gates() {
  return (
    <group name="gates">
      {[
        { pos: [0, 0, -23], rot: [0, 0, 0] },
        { pos: [-23, 0, 0], rot: [0, Math.PI / 2, 0] },
        { pos: [23, 0, 0], rot: [0, -Math.PI / 2, 0] },
      ].map((g, i) => (
        <Gate key={i} position={g.pos} rotation={g.rot} isMain={i === 0} />
      ))}
    </group>
  );
}

interface GateProps {
  position: [number, number, number];
  rotation: [number, number, number];
  isMain: boolean;
}

function Gate({ position, rotation, isMain }: GateProps) {
  const scale = isMain ? 1.3 : 1;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh name="gate-arch" castShadow receiveShadow geometry={new THREE.TorusGeometry(DIMENSIONS.GATE_ARCH_RADIUS, DIMENSIONS.GATE_ARCH_TUBE, 8, 16, Math.PI)}>
        <primitive object={MATERIALS.gate} />
      </mesh>
      <mesh name="gate-canopy" castShadow receiveShadow geometry={new THREE.BoxGeometry(DIMENSIONS.GATE_CANOPY.width, DIMENSIONS.GATE_CANOPY.height, DIMENSIONS.GATE_CANOPY.depth)} position={[0, DIMENSIONS.GATE_ARCH_RADIUS + 0.1, -1]}>
        <primitive object={MATERIALS.gate} />
      </mesh>
      {isMain && (
        <mesh name="gate-detail" castShadow receiveShadow geometry={new THREE.BoxGeometry(1.5, 0.15, 0.5)} position={[0, DIMENSIONS.GATE_ARCH_RADIUS + 0.5, -1.5]}>
          <primitive object={MATERIALS.stallAccent} />
        </mesh>
      )}
    </group>
  );
}