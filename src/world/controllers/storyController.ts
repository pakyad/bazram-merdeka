import * as THREE from 'three';
import { LIGHTING_TRANSITIONS, CAMERA_SEGMENTS } from '../constants';

export interface WorldState {
  sunPosition: THREE.Vector3;
  sunColor: THREE.Color;
  sunIntensity: number;
  moonVisible: number;
  moonPhase: number;
  starVisibility: number;
  skyColorTop: THREE.Color;
  skyColorBottom: THREE.Color;
  ambientIntensity: number;
  ambientColor: THREE.Color;
  hemisphereSkyColor: THREE.Color;
  hemisphereGroundColor: THREE.Color;
  floodlightIntensity: number;
  stallLightIntensity: number;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  cameraFov: number;
  stallLightsOn: boolean;
  floodlightsOn: boolean;
  crowdVisible: number;
}

const smoothstep = (e0: number, e1: number, x: number): number => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const lerpVec3 = (a: THREE.Vector3, b: THREE.Vector3, t: number, out = new THREE.Vector3()): THREE.Vector3 => out.lerpVectors(a, b, t);
const lerpColor = (a: THREE.Color, b: THREE.Color, t: number, out = new THREE.Color()): THREE.Color => out.lerpColors(a, b, t);

const SUN_DAY_POS = new THREE.Vector3(30, 50, 20);
const SUN_SET_POS = new THREE.Vector3(0, 2, -80);
const SUN_NIGHT_POS = new THREE.Vector3(-30, -20, -50);
const MOON_POS = new THREE.Vector3(-40, 35, -20);

const COLOR_SKY_DAY_TOP = new THREE.Color(0x56c8f5);
const COLOR_SKY_DAY_BOTTOM = new THREE.Color(0x9ed0f8);
const COLOR_SKY_SUNSET_TOP = new THREE.Color(0xf2a647);
const COLOR_SKY_SUNSET_BOTTOM = new THREE.Color(0xf5c96e);
const COLOR_SKY_NIGHT_TOP = new THREE.Color(0x0c0e18);
const COLOR_SKY_NIGHT_BOTTOM = new THREE.Color(0x12151c);

const COLOR_SUN_DAY = new THREE.Color(0xfff5e0);
const COLOR_SUN_SET = new THREE.Color(0xff8c42);
const COLOR_SUN_NIGHT = new THREE.Color(0xffaa66);

const COLOR_AMBIENT_DAY = new THREE.Color(0xfff8f0);
const COLOR_AMBIENT_NIGHT = new THREE.Color(0x1a1f2a);
const COLOR_HEMI_SKY_DAY = new THREE.Color(0xfff8f0);
const COLOR_HEMI_SKY_NIGHT = new THREE.Color(0x080a10);
const COLOR_HEMI_GROUND_DAY = new THREE.Color(0x2a2f3a);
const COLOR_HEMI_GROUND_NIGHT = new THREE.Color(0x06080c);

export function computeWorldState(progress: number): WorldState {
  const p = THREE.MathUtils.clamp(progress, 0, 1);

  const sunSetProgress = smoothstep(LIGHTING_TRANSITIONS.SUN_SET_START, LIGHTING_TRANSITIONS.SUN_SET_END, p);
  const nightProgress = smoothstep(0.55, 0.85, p);

  const floodlightIntensity = smoothstep(...LIGHTING_TRANSITIONS.FLOODLIGHT_FADE_IN, p);
  const stallLightIntensity = smoothstep(...LIGHTING_TRANSITIONS.STALL_LIGHTS_FADE_IN, p);
  const moonVisible = smoothstep(...LIGHTING_TRANSITIONS.MOON_RISE, p);
  const starVisibility = smoothstep(...LIGHTING_TRANSITIONS.STAR_FADE_IN, p);
  const crowdVisible = smoothstep(0.5, 0.7, p);

  const isNight = p > LIGHTING_TRANSITIONS.NIGHT_FULL;

  let sunPosition: THREE.Vector3;
  let sunColor: THREE.Color;
  let sunIntensity: number;

  if (p < 0.3) {
    const t = p / 0.3;
    sunPosition = lerpVec3(SUN_DAY_POS, new THREE.Vector3(15, 35, 15), smoothstep(0, 1, t));
    sunColor = lerpColor(COLOR_SUN_DAY, COLOR_SUN_SET, smoothstep(0, 1, t));
    sunIntensity = lerp(1.5, 1.2, smoothstep(0, 1, t));
  } else if (p < 0.55) {
    const t = (p - 0.3) / 0.25;
    sunPosition = lerpVec3(new THREE.Vector3(15, 35, 15), SUN_SET_POS, smoothstep(0, 1, t));
    sunColor = lerpColor(COLOR_SUN_SET, new THREE.Color(0xff5522), smoothstep(0, 1, t));
    sunIntensity = lerp(1.2, 0.3, smoothstep(0, 1, t));
  } else {
    sunPosition = SUN_NIGHT_POS.clone();
    sunColor = COLOR_SUN_NIGHT.clone();
    sunIntensity = 0;
  }

  const skyTop = p < 0.3
    ? lerpColor(COLOR_SKY_DAY_TOP, COLOR_SKY_SUNSET_TOP, smoothstep(0, 1, p / 0.3))
    : p < 0.55
      ? lerpColor(COLOR_SKY_SUNSET_TOP, COLOR_SKY_NIGHT_TOP, smoothstep(0, 1, (p - 0.3) / 0.25))
      : COLOR_SKY_NIGHT_TOP.clone();

  const skyBottom = p < 0.3
    ? lerpColor(COLOR_SKY_DAY_BOTTOM, COLOR_SKY_SUNSET_BOTTOM, smoothstep(0, 1, p / 0.3))
    : p < 0.55
      ? lerpColor(COLOR_SKY_SUNSET_BOTTOM, COLOR_SKY_NIGHT_BOTTOM, smoothstep(0, 1, (p - 0.3) / 0.25))
      : COLOR_SKY_NIGHT_BOTTOM.clone();

  const ambientColor = lerpColor(COLOR_AMBIENT_DAY, COLOR_AMBIENT_NIGHT, nightProgress);
  const ambientIntensity = lerp(0.6, 0.15, nightProgress);

  const hemiSky = lerpColor(COLOR_HEMI_SKY_DAY, COLOR_HEMI_SKY_NIGHT, nightProgress);
  const hemiGround = lerpColor(COLOR_HEMI_GROUND_DAY, COLOR_HEMI_GROUND_NIGHT, nightProgress);

  const cameraState = computeCameraState(p);

  return {
    sunPosition,
    sunColor,
    sunIntensity,
    moonVisible,
    moonPhase: smoothstep(0.55, 0.75, p),
    starVisibility,
    skyColorTop: skyTop,
    skyColorBottom: skyBottom,
    ambientIntensity,
    ambientColor,
    hemisphereSkyColor: hemiSky,
    hemisphereGroundColor: hemiGround,
    floodlightIntensity,
    stallLightIntensity,
    cameraPosition: cameraState.position,
    cameraTarget: cameraState.target,
    cameraFov: cameraState.fov,
    stallLightsOn: stallLightIntensity > 0.01,
    floodlightsOn: floodlightIntensity > 0.01,
    crowdVisible,
  };
}

interface CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

function computeCameraState(p: number): CameraState {
  if (p < 0.20) {
    const t = p / 0.20;
    const eased = smoothstep(0, 1, t);
    return {
      position: new THREE.Vector3(lerp(0, 0, eased), lerp(1.8, 1.8, eased), lerp(-35, -26, eased)),
      target: new THREE.Vector3(0, 3, -23),
      fov: lerp(55, 50, eased),
    };
  }
  if (p < 0.35) {
    const t = (p - 0.20) / 0.15;
    const eased = smoothstep(0, 1, t);
    return {
      position: new THREE.Vector3(lerp(0, -6, eased), lerp(1.8, 3.2, eased), lerp(-26, -12, eased)),
      target: new THREE.Vector3(lerp(0, -4, eased), 2.5, lerp(-23, -5, eased)),
      fov: lerp(50, 48, eased),
    };
  }
  if (p < 0.50) {
    const t = (p - 0.35) / 0.15;
    const eased = smoothstep(0, 1, t);
    return {
      position: new THREE.Vector3(lerp(-6, 8, eased), lerp(3.2, 2.8, eased), lerp(-12, 5, eased)),
      target: new THREE.Vector3(lerp(-4, 6, eased), 1.8, lerp(-5, 0, eased)),
      fov: 48,
    };
  }
  if (p < 0.65) {
    const t = (p - 0.50) / 0.15;
    const eased = smoothstep(0, 1, t);
    return {
      position: new THREE.Vector3(lerp(8, 0, eased), lerp(2.8, 1.6, eased), lerp(5, 0, eased)),
      target: new THREE.Vector3(lerp(6, 0, eased), 1.2, lerp(0, 0, eased)),
      fov: lerp(48, 45, eased),
    };
  }
  if (p < 0.75) {
    const t = (p - 0.65) / 0.10;
    const eased = smoothstep(0, 1, t);
    return {
      position: new THREE.Vector3(0, lerp(1.6, 1.8, eased), lerp(0, -2, eased)),
      target: new THREE.Vector3(0, 1, 0),
      fov: lerp(45, 40, eased),
    };
  }
  if (p < 0.90) {
    const t = (p - 0.75) / 0.15;
    const eased = smoothstep(0, 1, t);
    const h = lerp(1.8, 35, eased);
    const dist = lerp(2, 3, eased);
    const pitch = lerp(0, -Math.PI / 2 * 0.88, eased);
    return {
      position: new THREE.Vector3(0, h, dist),
      target: new THREE.Vector3(0, 0, 0),
      fov: lerp(40, 35, eased),
    };
  }
  {
    const t = (p - 0.90) / 0.10;
    const eased = smoothstep(0, 1, t);
    const h = lerp(35, 38, eased);
    const dist = lerp(3, 2, eased);
    return {
      position: new THREE.Vector3(0, h, dist),
      target: new THREE.Vector3(0, 0, 0),
      fov: lerp(35, 30, eased),
    };
  }
}