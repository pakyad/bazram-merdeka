import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

const TREE_POSITIONS: [number, number, number][] = [
  [-26, 0, -18], [-24, 0, -25], [-20, 0, -28], [-15, 0, -30], [-10, 0, -28], [-5, 0, -25],
  [5, 0, -25], [10, 0, -28], [15, 0, -30], [20, 0, -28], [24, 0, -25], [26, 0, -18],
  [28, 0, -10], [28, 0, -5], [28, 0, 0], [28, 0, 5], [28, 0, 10],
  [26, 0, 18], [24, 0, 25], [20, 0, 28], [15, 0, 30], [10, 0, 28], [5, 0, 25],
  [-5, 0, 25], [-10, 0, 28], [-15, 0, 30], [-20, 0, 28], [-24, 0, 25], [-26, 0, 18],
  [-28, 0, 10], [-28, 0, 5], [-28, 0, 0], [-28, 0, -5], [-28, 0, -10],
];

export function Trees() {
  return (
    <group name="trees">
      {TREE_POSITIONS.map((pos, i) => (
        <Tree key={i} position={pos} index={i} />
      ))}
    </group>
  );
}

interface TreeProps {
  position: [number, number, number];
  index: number;
}

function Tree({ position, index }: TreeProps) {
  const [minH, maxH] = DIMENSIONS.TREE_HEIGHT_RANGE;
  const height = minH + ((index * 73.1) % 1) * (maxH - minH);
  const trunkHeight = height * 0.35;
  const foliageHeight = height * 0.65;
  const foliageRadius = foliageHeight * 0.45;
  const scale = 0.85 + ((index * 17.3) % 1) * 0.3;

  return (
    <group position={position} scale={scale}>
      <mesh name="trunk" castShadow receiveShadow geometry={new THREE.CylinderGeometry(DIMENSIONS.TREE_TRUNK_RADIUS * 0.6, DIMENSIONS.TREE_TRUNK_RADIUS, trunkHeight, 6)}>
        <primitive object={MATERIALS.treeTrunk} />
      </mesh>
      <mesh name="foliage-1" castShadow receiveShadow geometry={new THREE.ConeGeometry(foliageRadius * 0.9, foliageHeight * 0.7, 6)} position={[0, trunkHeight + foliageHeight * 0.2, 0]}>
        <primitive object={MATERIALS.treeFoliage} />
      </mesh>
      <mesh name="foliage-2" castShadow receiveShadow geometry={new THREE.ConeGeometry(foliageRadius * 0.7, foliageHeight * 0.5, 6)} position={[0, trunkHeight + foliageHeight * 0.65, 0]}>
        <primitive object={MATERIALS.treeFoliage} />
      </mesh>
      <mesh name="foliage-3" castShadow receiveShadow geometry={new THREE.ConeGeometry(foliageRadius * 0.5, foliageHeight * 0.4, 6)} position={[0, trunkHeight + foliageHeight * 0.9, 0]}>
        <primitive object={MATERIALS.treeFoliage} />
      </mesh>
    </group>
  );
}