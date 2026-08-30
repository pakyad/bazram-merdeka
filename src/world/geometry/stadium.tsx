import React, { useRef, useEffect } from 'react';
import { instancedMesh } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

export function StadiumBowl() {
  return (
    <group name="bowl">
      <mesh name="outer-bowl" receiveShadow geometry={new THREE.CylinderGeometry(DIMENSIONS.BOWL_INNER_RADIUS, DIMENSIONS.BOWL_OUTER_RADIUS, DIMENSIONS.BOWL_HEIGHT, DIMENSIONS.BOWL_SEGMENTS, 1, true)}>
        <primitive object={MATERIALS.bowlOuter} />
      </mesh>
      <mesh name="inner-bowl" receiveShadow geometry={new THREE.CylinderGeometry(DIMENSIONS.BOWL_INNER_RADIUS - 2, DIMENSIONS.BOWL_INNER_RADIUS - 4, DIMENSIONS.BOWL_HEIGHT, DIMENSIONS.BOWL_SEGMENTS, 1, true)}>
        <primitive object={MATERIALS.bowlInner} />
      </mesh>
      <SeatRows />
    </group>
  );
}

function SeatRows() {
  const dummy = useRef(new THREE.Object3D());
  const count = DIMENSIONS.SEAT_COUNT;
  const innerR = DIMENSIONS.BOWL_INNER_RADIUS - 4;
  const outerR = DIMENSIONS.BOWL_INNER_RADIUS - 2;
  const height = DIMENSIONS.BOWL_HEIGHT;
  const rows = 4;
  const perRow = count / rows;

  useEffect(() => {
    if (!dummy.current) return;
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const radius = THREE.MathUtils.lerp(outerR, innerR + 0.5, r / (rows - 1));
      const y = -height / 2 + 0.2 + r * (height / rows);
      for (let i = 0; i < perRow; i++) {
        const angle = (i / perRow) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        dummy.current.position.set(x, y, z);
        dummy.current.rotation.y = angle + Math.PI / 2;
        dummy.current.scale.setScalar(THREE.MathUtils.randFloat(0.95, 1.05));
        dummy.current.updateMatrix();
        dummy.current.matrix.toArray(dummy.current.matrix.elements);
        idx++;
      }
    }
  }, []);

  return (
    <instancedMesh
      args={[new THREE.BoxGeometry(DIMENSIONS.SEAT_SIZE.width, DIMENSIONS.SEAT_SIZE.height, DIMENSIONS.SEAT_SIZE.depth), MATERIALS.seat, count]}
      receiveShadow
    >
      <bufferGeometry attach="geometry" args={[new THREE.BoxGeometry(DIMENSIONS.SEAT_SIZE.width, DIMENSIONS.SEAT_SIZE.height, DIMENSIONS.SEAT_SIZE.depth)]} />
    </instancedMesh>
  );
}

export function Field() {
  const grassShape = new THREE.Shape();
  const curve = new THREE.EllipseCurve(0, 0, DIMENSIONS.FIELD_MAJOR, DIMENSIONS.FIELD_MINOR);
  const points = curve.getPoints(64);
  grassShape.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) grassShape.lineTo(points[i].x, points[i].y);
  const grassGeometry = new THREE.ShapeGeometry(grassShape);

  return (
    <group name="field">
      <mesh name="grass" receiveShadow geometry={grassGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <primitive object={MATERIALS.field} />
      </mesh>
      <mesh name="track" receiveShadow geometry={new THREE.RingGeometry(DIMENSIONS.TRACK_INNER, DIMENSIONS.TRACK_OUTER, 64)} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <primitive object={MATERIALS.track} />
      </mesh>
      <mesh name="pitch-lines" receiveShadow geometry={new THREE.PlaneGeometry(24, 14)} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <primitive object={MATERIALS.pitchLines} />
      </mesh>
    </group>
  );
}