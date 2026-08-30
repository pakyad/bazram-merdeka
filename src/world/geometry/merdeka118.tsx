import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

export function Merdeka118() {
  const [x, y, z] = DIMENSIONS.MERDEKA118_POSITION;

  return (
    <group name="merdeka-118" position={[x, 0, z]}>
      <mesh name="tower-core" castShadow receiveShadow geometry={new THREE.CylinderGeometry(DIMENSIONS.MERDEKA118_TOP_RADIUS, DIMENSIONS.MERDEKA118_BASE_RADIUS, DIMENSIONS.MERDEKA118_HEIGHT, 8, 1, true)}>
        <primitive object={MATERIALS.towerCore} />
      </mesh>
      <group position={[0, DIMENSIONS.MERDEKA118_HEIGHT / 2 + 0.5, 0]}>
        <mesh name="tower-crown" castShadow receiveShadow geometry={new THREE.CylinderGeometry(1.2, 1.8, 4, 8, 1, true)}>
          <primitive object={MATERIALS.towerCrown} />
        </mesh>
        <mesh name="spire" castShadow receiveShadow geometry={new THREE.CylinderGeometry(0.35, 0.08, 6, 6)}>
          <primitive object={MATERIALS.towerCore} />
        </mesh>
      </group>
    </group>
  );
}