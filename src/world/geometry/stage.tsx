import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

export function Stage() {
  const [x, y, z] = DIMENSIONS.STAGE_POSITION;

  return (
    <group name="stage" position={[x, y, z]}>
      <mesh name="stage-platform" castShadow receiveShadow geometry={new THREE.BoxGeometry(DIMENSIONS.STAGE_PLATFORM.width, DIMENSIONS.STAGE_PLATFORM.height, DIMENSIONS.STAGE_PLATFORM.depth)}>
        <primitive object={MATERIALS.stagePlatform} />
      </mesh>
      <mesh name="stage-roof" castShadow geometry={new THREE.BoxGeometry(DIMENSIONS.STAGE_ROOF.width, DIMENSIONS.STAGE_ROOF.height, DIMENSIONS.STAGE_ROOF.depth)} position={[0, DIMENSIONS.STAGE_PLATFORM.height + DIMENSIONS.STAGE_ROOF.height / 2 + 1.4, 0]}>
        <primitive object={MATERIALS.stageRoof} />
      </mesh>
      <mesh name="stage-front" castShadow geometry={new THREE.PlaneGeometry(DIMENSIONS.STAGE_PLATFORM.width - 1, 2)} position={[0, 1.5, DIMENSIONS.STAGE_PLATFORM.depth / 2 + 0.01]} rotation={[-Math.PI / 12, 0, 0]}>
        <primitive object={MATERIALS.stallAccent} />
      </mesh>
    </group>
  );
}