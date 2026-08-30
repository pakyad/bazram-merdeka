import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { computeWorldState } from '../controllers/storyController';

interface CameraRigProps {
  progress: number;
  reducedMotion: boolean;
}

export function CameraRig({ progress, reducedMotion }: CameraRigProps) {
  const { camera } = useThree();

  useFrame(() => {
    if (reducedMotion) return;

    const worldState = computeWorldState(progress);

    const lerpFactor = 0.12;
    camera.position.lerp(worldState.cameraPosition, lerpFactor);

    const target = worldState.cameraTarget;
    camera.lookAt(target.x, target.y, target.z);

    if (Math.abs(camera.fov - worldState.cameraFov) > 0.1) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, worldState.cameraFov, lerpFactor);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}