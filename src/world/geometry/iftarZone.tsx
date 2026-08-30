import React, { useRef, useEffect } from 'react';
import { instancedMesh } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from '../materials/palette';
import { DIMENSIONS } from '../constants';

interface IftarZoneProps {
  crowdVisible: number;
}

export function IftarZone({ crowdVisible }: IftarZoneProps) {
  const matsRef = useRef<THREE.Mesh[]>([]);
  const tablesRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useRef(new THREE.Object3D());

  const matCount = 24;
  const tableCount = 12;

  useEffect(() => {
    matsRef.current.forEach(mat => {
      if (mat.material instanceof THREE.MeshStandardMaterial) {
        mat.material.opacity = crowdVisible;
        mat.material.transparent = crowdVisible < 1;
      }
    });
  }, [crowdVisible]);

  useEffect(() => {
    if (!tablesRef.current) return;
    const mesh = tablesRef.current;
    const count = tableCount;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 4 + (i % 2) * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      dummy.current.position.set(x, 0.25, z);
      dummy.current.rotation.y = Math.random() * Math.PI * 2;
      dummy.current.scale.setScalar(0.8 + Math.random() * 0.4);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group name="iftar-zone" position={DIMENSIONS.IFTAR_ZONE_CENTER}>
      <mesh name="center-mat" receiveShadow geometry={new THREE.BoxGeometry(DIMENSIONS.IFTAR_ZONE_SIZE.width, 0.15, DIMENSIONS.IFTAR_ZONE_SIZE.depth)} position={[0, 0.075, 0]}>
        <primitive object={MATERIALS.iftarMat} />
      </mesh>
      {Array.from({ length: matCount }, (_, i) => (
        <IftarMat key={i} index={i} ref={el => { matsRef.current[i] = el!; }} />
      ))}
      <instancedMesh
        ref={tablesRef}
        args={[new THREE.CylinderGeometry(0.6, 0.6, 0.35, 8), MATERIALS.iftarTable, tableCount]}
        receiveShadow
      />
    </group>
  );
}

interface IftarMatProps {
  index: number;
  ref: React.Ref<THREE.Mesh>;
}

function IftarMat({ index, ref }: IftarMatProps) {
  const angle = (index / 24) * Math.PI * 2;
  const radius = 5.5 + (index % 3) * 1.5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const w = 1.8 + (index % 2) * 0.6;
  const d = 1.2;

  return (
    <mesh
      ref={ref}
      name={`iftar-mat-${index}`}
      receiveShadow
      geometry={new THREE.BoxGeometry(w, 0.1, d)}
      position={[x, 0.05, z]}
      rotation={[0, angle + Math.PI / 2, 0]}
    >
      <primitive object={MATERIALS.iftarMat} />
    </mesh>
  );
}