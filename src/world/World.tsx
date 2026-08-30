import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { computeWorldState } from './controllers/storyController';
import { CameraRig } from './camera/cameraPath';
import { ProceduralSky } from './sky/proceduralSky';
import { StadiumBowl, Field } from './geometry/stadium';
import { Floodlights } from './geometry/floodlights';
import { Gates } from './geometry/gates';
import { Merdeka118 } from './geometry/merdeka118';
import { Trees } from './geometry/trees';
import { Stalls } from './geometry/stalls';
import { IftarZone } from './geometry/iftarZone';
import { PrayerZone } from './geometry/prayerZone';
import { Crowd } from './geometry/crowd';
import { EntrancePins } from './geometry/entrancePins';
import { Stage } from './geometry/stage';

interface WorldProps {
  progress: number;
  time: number;
  reducedMotion: boolean;
}

function WorldScene({ progress, time, reducedMotion }: WorldProps) {
  const worldState = useMemo(() => computeWorldState(progress), [progress]);

  useFrame((state) => {
    const { gl } = state;
    if (!reducedMotion) {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }, 1);

  return (
    <>
      <ProceduralSky progress={progress} time={time} />

      <CameraRig progress={progress} reducedMotion={reducedMotion} />

      <color attach="background" args={[worldState.skyColorBottom]} />
      <fog attach="fog" args={[worldState.skyColorBottom, 15, 100]} />

      <directionalLight
        position={worldState.sunPosition}
        color={worldState.sunColor}
        intensity={worldState.sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0005}
      />

      <ambientLight color={worldState.ambientColor} intensity={worldState.ambientIntensity} />
      <hemisphereLight
        skyColor={worldState.hemisphereSkyColor}
        groundColor={worldState.hemisphereGroundColor}
        intensity={0.5}
      />

      <Floodlights intensity={worldState.floodlightIntensity} />

      <StadiumBowl />
      <Field />
      <Gates />
      <Merdeka118 />
      <Trees />
      <Stalls stallLightIntensity={worldState.stallLightIntensity} />
      <IftarZone crowdVisible={worldState.crowdVisible} />
      <PrayerZone />
      <Crowd crowdVisible={worldState.crowdVisible} />
      <EntrancePins />
      <Stage />

    </>
  );
}

export function World({ progress, time, reducedMotion }: WorldProps) {
  return (
    <div className="world-canvas" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        gl={{
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
          antialias: true,
          alpha: false,
        }}
        camera={{ position: [0, 6, 28], fov: 50, near: 0.1, far: 200 }}
        shadows={{ type: THREE.PCFSoftShadowMap, autoClear: true }}
        frameloop="demand"
      >
        <WorldScene progress={progress} time={time} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}