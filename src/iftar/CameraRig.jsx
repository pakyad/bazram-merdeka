import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const bez = (a, c1, c2, b, t) => {
  const u = 1 - t
  return u*u*u*a + 3*u*u*t*c1 + 3*u*t*t*c2 + t*t*t*b
}

const lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (e0, e1, x) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

export function CameraRig({ progress, reducedMotion }) {
  const cameraRef = useRef()
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    if (reducedMotion) return
    const p = progress
    const cam = cameraRef.current
    if (!cam) return

    let pos, lookAt

    if (p < 0.32) {
      const t = p / 0.32
      const h = lerp(6, 5.5, smoothstep(0, 1, t))
      const dist = lerp(28, 26, smoothstep(0, 1, t))
      const angle = lerp(-0.35, -0.25, smoothstep(0, 1, t))
      pos = new THREE.Vector3(Math.sin(angle) * dist, h, Math.cos(angle) * dist)
      lookAt = new THREE.Vector3(0, 1.5, -2)
    } else if (p < 0.58) {
      const t = (p - 0.32) / 0.26
      const h = lerp(5.5, 7, smoothstep(0, 1, t))
      const dist = lerp(26, 22, smoothstep(0, 1, t))
      const angle = lerp(-0.25, -0.15, smoothstep(0, 1, t))
      pos = new THREE.Vector3(Math.sin(angle) * dist, h, Math.cos(angle) * dist)
      lookAt = new THREE.Vector3(0, 1.2, -1)
    } else if (p < 0.72) {
      const t = (p - 0.58) / 0.14
      const h = lerp(7, 7.5, smoothstep(0, 1, t))
      const dist = lerp(22, 20, smoothstep(0, 1, t))
      const angle = lerp(-0.15, -0.1, smoothstep(0, 1, t))
      pos = new THREE.Vector3(Math.sin(angle) * dist, h, Math.cos(angle) * dist)
      lookAt = new THREE.Vector3(0, 1, 0)
    } else if (p < 0.9) {
      const t = (p - 0.72) / 0.18
      const h = lerp(7.5, 26, smoothstep(0, 1, t))
      const dist = lerp(20, 3, smoothstep(0, 1, t))
      const angle = lerp(-0.1, 0, smoothstep(0, 1, t))
      const pitch = lerp(0, -Math.PI / 2 * 0.85, smoothstep(0, 1, t))
      pos = new THREE.Vector3(Math.sin(angle) * dist, h, Math.cos(angle) * dist)
      lookAt = new THREE.Vector3(0, 0, 0)
      cam.position.lerp(pos, 0.15)
      cam.lookAt(lookAt)
      return
    } else {
      const t = (p - 0.9) / 0.1
      const h = lerp(26, 28, smoothstep(0, 1, t))
      const dist = lerp(3, 2, smoothstep(0, 1, t))
      pos = new THREE.Vector3(0, h, dist)
      lookAt = new THREE.Vector3(0, 0, 0)
    }

    cam.position.lerp(pos, 0.1)
    cam.lookAt(lookAt)
  })

  return (
    <group>
      <camera ref={cameraRef} position={[0, 6, 28]} fov={50} near={0.1} far={200} />
    </group>
  )
}