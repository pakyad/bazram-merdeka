import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

export function PrayerZone() {
  const [x, y, z] = DIMENSIONS.PRAYER_POSITION;
  const qiblaAngle = -15 * Math.PI / 180;

  return (
    <group name="prayer-zone" position={[x, y, z]} rotation={[0, qiblaAngle, 0]}>
      <mesh name="prayer-mat" castShadow receiveShadow geometry={new THREE.BoxGeometry(DIMENSIONS.PRAYER_MAT.width, DIMENSIONS.PRAYER_MAT.height, DIMENSIONS.PRAYER_MAT.depth)}>
        <primitive object={MATERIALS.prayerMat} />
      </mesh>
      <mesh name="prayer-marker" castShadow geometry={new THREE.CylinderGeometry(0.15, 0.15, DIMENSIONS.PRAYER_MARKER_HEIGHT, 6)} position={[0, DIMENSIONS.PRAYER_MARKER_HEIGHT / 2 + 0.1, DIMENSIONS.PRAYER_MAT.depth / 2 + 0.5]}>
        <primitive object={MATERIALS.prayerMarker} />
      </mesh>
      <mesh name="prayer-minaret" castShadow geometry={new THREE.CylinderGeometry(0.25, 0.4, 3.5, 6)} position={[-DIMENSIONS.PRAYER_MAT.width / 2 - 1.5, 1.75, -DIMENSIONS.PRAYER_MAT.depth / 2 - 1]}>
        <primitive object={MATERIALS.towerCore} />
      </mesh>
      <mesh name="prayer-dome" castShadow geometry={new THREE.SphereGeometry(0.5, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2)} position={[-DIMENSIONS.PRAYER_MAT.width / 2 - 1.5, 5.25, -DIMENSIONS.PRAYER_MAT.depth / 2 - 1]}>
        <primitive object={MATERIALS.towerCrown} />
      </mesh>
    </group>
  );
}