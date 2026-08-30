import React, { useRef, useEffect } from 'react';
import { instancedMesh } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

interface CrowdProps {
  crowdVisible: number;
}

export function Crowd({ crowdVisible }: CrowdProps) {
  const bodyRef = useRef<THREE.InstancedMesh | null>(null);
  const headRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useRef(new THREE.Object3D());
  const count = DIMENSIONS.CROWD_COUNT;
  const spreadX = DIMENSIONS.CROUD_SPREAD.x;
  const spreadZ = DIMENSIONS.CROUD_SPREAD.z;

  useEffect(() => {
    if (!bodyRef.current || !headRef.current) return;
    const bodyMesh = bodyRef.current;
    const headMesh = headRef.current;

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spreadX;
      const z = (Math.random() - 0.5) * spreadZ;
      const y = 0.05;
      const scale = 0.7 + Math.random() * 0.5;
      const rotY = Math.random() * Math.PI * 2;

      dummy.current.position.set(x, y, z);
      dummy.current.rotation.y = rotY;
      dummy.current.scale.setScalar(scale);
      dummy.current.updateMatrix();

      bodyMesh.setMatrixAt(i, dummy.current.matrix);
      headMesh.setMatrixAt(i, dummy.current.matrix);
    }

    bodyMesh.instanceMatrix.needsUpdate = true;
    headMesh.instanceMatrix.needsUpdate = true;
  }, []);

  useEffect(() => {
    if (bodyRef.current && bodyRef.current.material instanceof THREE.MeshStandardMaterial) {
      bodyRef.current.material.opacity = crowdVisible;
      bodyRef.current.material.transparent = crowdVisible < 1;
    }
    if (headRef.current && headRef.current.material instanceof THREE.MeshStandardMaterial) {
      headRef.current.material.opacity = crowdVisible;
      headRef.current.material.transparent = crowdVisible < 1;
    }
  }, [crowdVisible]);

  return (
    <group name="crowd">
      <instancedMesh
        ref={bodyRef}
        args={[new THREE.CapsuleGeometry(0.25, 0.7, 4, 8), MATERIALS.crowdBody, count]}
        receiveShadow
        castShadow
      />
      <instancedMesh
        ref={headRef}
        args={[new THREE.SphereGeometry(0.2, 8, 8), MATERIALS.crowdHead, count]}
        receiveShadow
        castShadow
      />
    </group>
  );
}