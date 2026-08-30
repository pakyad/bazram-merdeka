import * as THREE from 'three';
import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const SKY_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SKY_FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform float uProgress;
uniform float uTime;
uniform vec2 uResolution;

vec3 palette(float t, vec2 uv) {
  vec3 c0t = vec3(.56, .82, .96); vec3 c0b = vec3(.62, .78, .92);
  vec3 c1t = vec3(.95, .82, .55); vec3 c1b = vec3(.90, .70, .42);
  vec3 c2t = vec3(.92, .60, .28); vec3 c2b = vec3(.82, .48, .22);
  vec3 c3t = vec3(.50, .32, .48); vec3 c3b = vec3(.60, .38, .42);
  vec3 c4t = vec3(.12, .14, .24); vec3 c4b = vec3(.18, .18, .28);
  vec3 c5t = vec3(.04, .07, .14); vec3 c5b = vec3(.06, .08, .12);

  float k = t * 5.0;
  float s0 = clamp(k, 0.0, 1.0);
  float s1 = clamp(k - 1.0, 0.0, 1.0);
  float s2 = clamp(k - 2.0, 0.0, 1.0);
  float s3 = clamp(k - 3.0, 0.0, 1.0);
  float s4 = clamp(k - 4.0, 0.0, 1.0);

  vec3 top = c0t * (1.0 - s0);
  vec3 bot = c0b * (1.0 - s0);
  top += s0 * c1t; top -= s1 * c1t;
  bot += s0 * c1b; bot -= s1 * c1b;
  top += s1 * c2t; top -= s2 * c2t;
  bot += s1 * c2b; bot -= s2 * c2b;
  top += s2 * c3t; top -= s3 * c3t;
  bot += s2 * c3b; bot -= s3 * c3b;
  top += s3 * c4t; top -= s4 * c4t;
  bot += s3 * c4b; bot -= s4 * c4b;
  top += s4 * c5t;
  bot += s4 * c5b;

  return mix(bot, top, uv.y);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float ar = uResolution.x / uResolution.y;
  vec2 auv = vec2(uv.x * ar, uv.y);
  vec3 col = palette(uProgress, uv);

  float t = clamp(uProgress / 0.55, 0.0, 1.0);
  float st = t * t;
  float sx = mix(0.82, 0.35, t);
  float sy = 0.22 + st * 0.50;
  vec2 sun = vec2(sx * ar, sy);
  float sd = length(auv - sun);
  float disc = smoothstep(0.042, 0.018, sd);
  float glow = smoothstep(0.14, 0.0, sd);
  float sfade = 1.0 - smoothstep(0.35, 0.55, uProgress);
  col += vec3(1.0, .90, .50) * disc * sfade;
  col += vec3(1.0, .78, .38) * glow * 0.22 * sfade;

  float hg = smoothstep(0.25, 0.40, uProgress) * smoothstep(0.60, 0.42, uProgress);
  float hy = 1.0 - abs(uv.y - 0.12) / 0.18;
  col += vec3(0.95, 0.55, 0.20) * hg * max(hy, 0.0) * 0.15;

  float mf = smoothstep(0.55, 0.65, uProgress);
  vec2 moon = vec2(0.18 * ar, 0.20);
  float md = length(auv - moon);
  float mfill = smoothstep(0.065, 0.035, md);
  float mcut = smoothstep(0.072, 0.045, length(auv - moon + vec2(0.025, -0.012)));
  float crescent = (mfill - mcut) * mf;
  float mglow = smoothstep(0.22, 0.0, md) * 0.10 * mf;
  col += vec3(.96, .93, .84) * crescent + vec3(.90, .88, .82) * mglow;

  float sf = smoothstep(0.65, 0.85, uProgress);
  vec2 gid = floor(auv * 18.0);
  float h = hash(gid);
  float star = step(0.935, h) * sf;
  if (star > 0.01) {
    float d = length(fract(auv * 18.0) - 0.5);
    float br = 0.4 + 0.6 * hash(gid + 31.7);
    float tw = 0.5 + 0.5 * sin(uTime * (1.0 + h * 3.0) + h * 50.0);
    col += vec3(.93, .94, .97) * smoothstep(0.22, 0.0, d) * star * br * tw * 0.7;
  }

  float g = hash(auv * 800.0 + floor(uTime * 8.0) * 0.123) * 0.025;
  col += g - 0.0125;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const SKY_GEOMETRY = new THREE.PlaneGeometry(2, 2);

export function ProceduralSky({ progress, time }: { progress: number; time: number }) {
  const build = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
      uniforms: {
        uProgress: { value: progress },
        uTime: { value: time },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(SKY_GEOMETRY, material);
    mesh.renderOrder = -100;
    mesh.frustumCulled = false;

    return { material, mesh };
  }, []);

  useEffect(() => {
    return () => {
      build.material.dispose();
    };
  }, [build]);

  useFrame(({ gl }) => {
    build.material.uniforms.uProgress.value = progress;
    build.material.uniforms.uTime.value = time;
    build.material.uniforms.uResolution.value.set(gl.domElement.width, gl.domElement.height);
  }, -100);

  return <primitive object={build.mesh} />;
}