import React from 'react'
import * as THREE from 'three'

const PAPER = 0xfffaf2
const INK = 0x242321
const YELLOW = 0xf7c531
const RED = 0xee4429
const MUTED = 0x68625d
const GRASS = 0xcfe3c9
const STEEL = 0x3a3f4a

function FloodlightTower({ x, z, intensity, poleMaterial, lampMaterial }) {
  const targetRef = React.useRef()
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow name="pole">
        <cylinderGeometry args={[0.18, 0.18, 14, 8]} />
        <primitive object={poleMaterial} />
      </mesh>
      <group position={[0, 14, 0]} rotation={[-Math.PI / 6, 0, 0]}>
        <mesh castShadow className="floodlight-lamp" name="lamp">
          <boxGeometry args={[1.8, 0.25, 1.2]} />
          <primitive object={lampMaterial} />
        </mesh>
        <spotLight
          position={[0, 0, 0]}
          target={targetRef}
          angle={0.45}
          penumbra={0.35}
          decay={1.8}
          distance={35}
          intensity={intensity * 2.5}
        />
        <object3D ref={targetRef} position={[0, -14, 0]} />
      </group>
    </group>
  )
}

export function Stadium({ progress, floodlightIntensity }) {
  const group = React.useRef()

  React.useEffect(() => {
    if (!group.current) return
    group.current.traverse(o => {
      if (o.name === 'lamp' && o.material) o.material.emissiveIntensity = floodlightIntensity
    })
  }, [floodlightIntensity])

  const bowlMaterial = new THREE.MeshStandardMaterial({
    color: PAPER,
    roughness: 0.85,
    metalness: 0.02,
    flatShading: true,
  })
  const innerBowlMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5efe8,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
    side: THREE.BackSide,
  })
  const seatMaterial = new THREE.MeshStandardMaterial({
    color: 0xede7dd,
    roughness: 0.95,
    metalness: 0,
    flatShading: true,
  })
  const fieldMaterial = new THREE.MeshStandardMaterial({
    color: GRASS,
    roughness: 0.95,
    metalness: 0,
    flatShading: true,
  })
  const trackMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4c9b8,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  })
  const floodlightPoleMaterial = new THREE.MeshStandardMaterial({
    color: STEEL,
    roughness: 0.7,
    metalness: 0.3,
    flatShading: true,
  })
  const floodlightLampMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff3d8,
    roughness: 0.1,
    metalness: 0.8,
    emissive: 0xfff3d8,
    emissiveIntensity: 0,
    flatShading: true,
  })
  const towerMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2f3a,
    roughness: 0.6,
    metalness: 0.2,
    flatShading: true,
  })
  const towerCrownMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a5a6a,
    roughness: 0.5,
    metalness: 0.4,
    flatShading: true,
  })
  const gateMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8e0d4,
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
  })
  const stallMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff8e8,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  })
  const stallAccentMaterial = new THREE.MeshStandardMaterial({
    color: RED,
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
  })
  const stageMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff0d8,
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
  })
  const prayerMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8f4ec,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  })
  const pinMaterial = new THREE.MeshStandardMaterial({
    color: YELLOW,
    roughness: 0.2,
    metalness: 0.6,
    emissive: YELLOW,
    emissiveIntensity: 0.5,
    flatShading: true,
  })

  return (
    <group ref={group}>
      <group name="bowl">
        <mesh receiveShadow name="outer-bowl">
          <cylinderGeometry args={[22, 24, 3.2, 32, 1, true]} />
          <primitive object={bowlMaterial} />
        </mesh>
        <mesh receiveShadow name="inner-bowl">
          <cylinderGeometry args={[20, 18, 3.2, 32, 1, true]} />
          <primitive object={innerBowlMaterial} />
        </mesh>
        <mesh receiveShadow name="seat-rows">
          <instancedMesh args={[null, null, 160]}>
            <boxGeometry args={[0.6, 0.35, 1.8]} />
            <primitive object={seatMaterial} />
          </instancedMesh>
        </mesh>
      </group>

      <group name="field">
        <mesh receiveShadow name="grass">
          <ellipseCurve args={[16, 10]} />
          <primitive object={fieldMaterial} />
        </mesh>
        <mesh receiveShadow name="track">
          <ringGeometry args={[10.5, 11.5, 32]} />
          <primitive object={trackMaterial} />
        </mesh>
        <mesh receiveShadow name="pitch-lines">
          <planeGeometry args={[24, 14]} />
          <meshBasicMaterial color={INK} opacity={0.08} transparent depthWrite={false} />
        </mesh>
      </group>

      <group name="floodlights">
        {[-1, 1].map(x => [-1, 1].map((z, zi) => (
          <FloodlightTower
            key={`${x}-${z}`}
            x={x * 21}
            z={z * 12.5}
            intensity={floodlightIntensity}
            poleMaterial={floodlightPoleMaterial}
            lampMaterial={floodlightLampMaterial}
          />
        )))}
      </group>

      <group name="merdeka-118" position={[28, 0, -8]}>
        <mesh castShadow receiveShadow name="tower-core">
          <cylinderGeometry args={[0.8, 0.45, 42, 8, 1, true]} />
          <primitive object={towerMaterial} />
        </mesh>
        <group position={[0, 21.5, 0]}>
          <mesh castShadow receiveShadow name="tower-crown">
            <cylinderGeometry args={[1.2, 1.8, 4, 8, 1, true]} />
            <primitive object={towerCrownMaterial} />
          </mesh>
          <mesh castShadow receiveShadow name="spire">
            <cylinderGeometry args={[0.35, 0.08, 6, 6]} />
            <primitive object={towerMaterial} />
          </mesh>
        </group>
      </group>

      <group name="gates">
        {[
          { pos: [0, 0, -23], rot: [0, 0, 0], label: 'Gerbang Utama' },
          { pos: [-23, 0, 0], rot: [0, Math.PI / 2, 0], label: 'Gate 2' },
          { pos: [23, 0, 0], rot: [0, -Math.PI / 2, 0], label: 'Gate 3' },
        ].map((g, i) => (
          <group key={i} position={g.pos} rotation={g.rot}>
            <mesh castShadow receiveShadow name="gate-arch">
              <torusGeometry args={[3.5, 0.35, 8, 16, Math.PI]} />
              <primitive object={gateMaterial} />
            </mesh>
            <mesh castShadow receiveShadow name="gate-canopy" position={[0, 3.3, -1]}>
              <boxGeometry args={[8, 0.2, 2.5]} />
              <primitive object={gateMaterial} />
            </mesh>
          </group>
        ))}
      </group>

      <group name="zones">
        <group name="food-lanes">
          {[
            { x: -10, z: -4, w: 8, d: 3, rot: 0 },
            { x: 2, z: -4, w: 8, d: 3, rot: 0 },
            { x: -10, z: 1, w: 8, d: 3, rot: 0 },
            { x: 2, z: 1, w: 8, d: 3, rot: 0 },
            { x: -6, z: 5.5, w: 12, d: 3, rot: 0 },
          ].map((s, i) => (
            <group key={i} position={[s.x, 0.15, s.z]} rotation={[0, s.rot, 0]}>
              <mesh castShadow receiveShadow name="stall-base">
                <boxGeometry args={[s.w, 0.3, s.d]} />
                <primitive object={stallMaterial} />
              </mesh>
              <mesh castShadow name="stall-awning" position={[0, 0.55, 0]}>
                <boxGeometry args={[s.w + 0.4, 0.15, s.d + 0.4]} />
                <primitive object={stallAccentMaterial} />
              </mesh>
              <mesh castShadow name="stall-sign" position={[0, 1.1, s.d / 2 + 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.5, 0.6]} />
                <meshBasicMaterial color={INK} transparent opacity={0.9} />
              </mesh>
            </group>
          ))}
        </group>

        <group name="stage" position={[0, 0.15, -7]}>
          <mesh castShadow receiveShadow name="stage-platform">
            <boxGeometry args={[10, 0.4, 5]} />
            <primitive object={stageMaterial} />
          </mesh>
          <mesh castShadow name="stage-roof" position={[0, 1.8, 0]}>
            <boxGeometry args={[11, 0.2, 6]} />
            <primitive object={stallAccentMaterial} />
          </mesh>
        </group>

        <group name="prayer-zone" position={[-8, 0.15, 6]}>
          <mesh castShadow receiveShadow name="prayer-mat">
            <boxGeometry args={[4, 0.2, 5]} />
            <primitive object={prayerMaterial} />
          </mesh>
          <mesh castShadow name="prayer-marker" position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 2.5, 6]} />
            <primitive object={pinMaterial} />
          </mesh>
        </group>

        <group name="entrance-pins">
          {[
            { x: 0, z: -23, label: 'Main Gate' },
            { x: -23, z: 0, label: 'Gate 2' },
            { x: 23, z: 0, label: 'Gate 3' },
          ].map((p, i) => (
            <group key={i} position={[p.x, 0, p.z]} name="pin">
              <mesh castShadow name="pin-pole">
                <cylinderGeometry args={[0.08, 0.08, 2.5, 6]} />
                <primitive object={pinMaterial} />
              </mesh>
              <mesh castShadow name="pin-head" position={[0, 1.35, 0]}>
                <sphereGeometry args={[0.35, 8, 8]} />
                <primitive object={pinMaterial} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}