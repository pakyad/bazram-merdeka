import * as THREE from 'three';
import { PALETTE } from '../constants';

export const MATERIALS = {
  bowlOuter: new THREE.MeshStandardMaterial({
    color: PALETTE.PAPER,
    roughness: 0.85,
    metalness: 0.02,
    flatShading: true,
  }),

  bowlInner: new THREE.MeshStandardMaterial({
    color: PALETTE.BOWL_INNER,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
    side: THREE.BackSide,
  }),

  seat: new THREE.MeshStandardMaterial({
    color: PALETTE.SEAT,
    roughness: 0.95,
    metalness: 0,
    flatShading: true,
  }),

  field: new THREE.MeshStandardMaterial({
    color: PALETTE.GRASS,
    roughness: 0.95,
    metalness: 0,
    flatShading: true,
  }),

  track: new THREE.MeshStandardMaterial({
    color: PALETTE.TRACK,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  }),

  pitchLines: new THREE.MeshBasicMaterial({
    color: PALETTE.INK,
    opacity: 0.08,
    transparent: true,
    depthWrite: false,
  }),

  floodlightPole: new THREE.MeshStandardMaterial({
    color: PALETTE.STEEL,
    roughness: 0.7,
    metalness: 0.3,
    flatShading: true,
  }),

  floodlightLamp: new THREE.MeshStandardMaterial({
    color: PALETTE.FLOODLIGHT_GLOW,
    roughness: 0.1,
    metalness: 0.8,
    emissive: PALETTE.FLOODLIGHT_GLOW,
    emissiveIntensity: 0,
    flatShading: true,
  }),

  towerCore: new THREE.MeshStandardMaterial({
    color: 0x2a2f3a,
    roughness: 0.6,
    metalness: 0.2,
    flatShading: true,
  }),

  towerCrown: new THREE.MeshStandardMaterial({
    color: 0x4a5a6a,
    roughness: 0.5,
    metalness: 0.4,
    flatShading: true,
  }),

  gate: new THREE.MeshStandardMaterial({
    color: 0xe8e0d4,
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
  }),

  stallBase: new THREE.MeshStandardMaterial({
    color: PALETTE.STALL_BASE,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  }),

  stallAccent: new THREE.MeshStandardMaterial({
    color: PALETTE.TERRACOTTA,
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
  }),

  stallSign: new THREE.MeshBasicMaterial({
    color: PALETTE.INK,
    transparent: true,
    opacity: 0.9,
  }),

  stagePlatform: new THREE.MeshStandardMaterial({
    color: PALETTE.STAGE,
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
  }),

  stageRoof: new THREE.MeshStandardMaterial({
    color: PALETTE.TERRACOTTA,
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
  }),

  prayerMat: new THREE.MeshStandardMaterial({
    color: PALETTE.PRAYER,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  }),

  prayerMarker: new THREE.MeshStandardMaterial({
    color: PALETTE.INK,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  }),

  entrancePin: new THREE.MeshStandardMaterial({
    color: PALETTE.GOLD,
    roughness: 0.2,
    metalness: 0.6,
    emissive: PALETTE.GOLD,
    emissiveIntensity: 0.5,
    flatShading: true,
  }),

  treeTrunk: new THREE.MeshStandardMaterial({
    color: PALETTE.MUTED,
    roughness: 0.95,
    metalness: 0,
    flatShading: true,
  }),

  treeFoliage: new THREE.MeshStandardMaterial({
    color: 0x3a5a3a,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  }),

  iftarMat: new THREE.MeshStandardMaterial({
    color: 0xf5efe0,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  }),

  iftarTable: new THREE.MeshStandardMaterial({
    color: 0xe8dfd0,
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
  }),

  crowdBody: new THREE.MeshStandardMaterial({
    color: 0x4a4540,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  }),

  crowdHead: new THREE.MeshStandardMaterial({
    color: 0xd4c8b8,
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
  }),

  stallLight: new THREE.MeshStandardMaterial({
    color: PALETTE.GOLD,
    roughness: 0.1,
    metalness: 0.8,
    emissive: PALETTE.GOLD,
    emissiveIntensity: 0,
    flatShading: true,
  }),
} as const;

export type MaterialKey = keyof typeof MATERIALS;

export function getMaterial(key: MaterialKey): THREE.Material {
  return MATERIALS[key];
}

export function cloneMaterial(key: MaterialKey): THREE.Material {
  return MATERIALS[key].clone();
}

export function setEmissiveIntensity(material: THREE.MeshStandardMaterial, intensity: number): void {
  if (material.emissive) {
    material.emissiveIntensity = intensity;
  }
}