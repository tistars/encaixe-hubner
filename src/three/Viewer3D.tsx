import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html, OrbitControls } from '@react-three/drei'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { Part, VehicleModel } from '../types'
import { ShapeMesh } from './ShapeMesh'

export interface ViewerHandle {
  resetCamera: () => void
}

interface Props {
  vehicle: VehicleModel
  exploded: number // 0 = montado, 1 = explodido
  autoRotate: boolean
  selectedId: string | null
  onSelect: (partId: string | null) => void
  reducedMotion: boolean
}

const COLORS = {
  available: new THREE.Color('#ff7a3a'),
  availableHover: new THREE.Color('#ffa26b'),
  emissive: new THREE.Color('#ff4d0d'),
  ghost: new THREE.Color('#cfd6df'),
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function useMaterials(parts: Part[]) {
  return useMemo(() => {
    const ghost = new THREE.MeshStandardMaterial({
      color: COLORS.ghost,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      emissive: COLORS.ghost,
      emissiveIntensity: 0.22,
      roughness: 0.9,
      metalness: 0,
    })
    const map = new Map<string, THREE.MeshStandardMaterial>()
    for (const p of parts) {
      if (!p.hubner) map.set(p.id, ghost)
      else
        map.set(
          p.id,
          new THREE.MeshStandardMaterial({
            color: COLORS.available.clone(),
            emissive: COLORS.emissive.clone(),
            emissiveIntensity: 0.08,
            roughness: 0.38,
            metalness: 0.45,
          }),
        )
    }
    return map
  }, [parts])
}

function PartGroup({
  part,
  index,
  total,
  material,
  progress,
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  part: Part
  index: number
  total: number
  material: THREE.MeshStandardMaterial
  progress: React.MutableRefObject<number>
  hovered: boolean
  selected: boolean
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}) {
  const refs = useRef<(THREE.Group | null)[]>([])
  const stagger = 0.35 / Math.max(total, 1)

  useFrame((state, dt) => {
    const p = progress.current
    // cada peça começa um pouco depois da anterior: a explosão "desabrocha"
    const local = THREE.MathUtils.clamp((p - index * stagger) / (1 - total * stagger * 0.999), 0, 1)
    const e = easeInOut(local)
    part.meshes.forEach((m, i) => {
      const g = refs.current[i]
      if (!g) return
      g.position.set(m.pos[0] + m.explode[0] * e, m.pos[1] + m.explode[1] * e, m.pos[2] + m.explode[2] * e)
    })
    if (part.hubner) {
      const target = selected ? 0.95 + Math.sin(state.clock.elapsedTime * 3) * 0.2 : hovered ? 0.45 : 0.08
      material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, target, 8, dt)
      material.color.lerp(hovered || selected ? COLORS.availableHover : COLORS.available, 1 - Math.exp(-8 * dt))
    }
  })

  const interactive = part.hubner
  return (
    <group
      name={part.id}
      onPointerOver={
        interactive
          ? (e) => {
              e.stopPropagation()
              onHover(part.id)
            }
          : undefined
      }
      onPointerOut={interactive ? () => onHover(null) : undefined}
      onClick={
        interactive
          ? (e) => {
              e.stopPropagation()
              onSelect(part.id)
            }
          : undefined
      }
    >
      {part.meshes.map((m, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={m.pos} rotation={m.rot ?? [0, 0, 0]}>
          <ShapeMesh shape={m.shape} material={material} noRaycast={!interactive} />
          {hovered && i === 0 && (
            <Html center position={[0, 0.55, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
              <div className="tip3d">{part.name}</div>
            </Html>
          )}
        </group>
      ))}
    </group>
  )
}

/** Desliza o alvo da câmera para a peça escolhida (e de volta ao centro). */
function FocusRig({
  controls,
  vehicle,
  selectedId,
  exploded,
}: {
  controls: React.RefObject<OrbitControlsImpl | null>
  vehicle: VehicleModel
  selectedId: string | null
  exploded: number
}) {
  const goal = useRef(new THREE.Vector3(0, 1.4, 0))
  const active = useRef(false)

  useEffect(() => {
    const part = selectedId ? vehicle.parts.find((p) => p.id === selectedId) : null
    if (part) {
      const c = new THREE.Vector3()
      for (const m of part.meshes)
        c.add(new THREE.Vector3(m.pos[0] + m.explode[0] * exploded, m.pos[1] + m.explode[1] * exploded, m.pos[2] + m.explode[2] * exploded))
      c.divideScalar(part.meshes.length)
      // peças espelhadas (esquerda/direita) focam no meio
      goal.current.copy(c)
    } else goal.current.set(0, 1.4, 0)
    active.current = true
  }, [selectedId, vehicle, exploded])

  useFrame((_, dt) => {
    const c = controls.current
    if (!c || !active.current) return
    c.target.lerp(goal.current, 1 - Math.exp(-4 * dt))
    if (c.target.distanceTo(goal.current) < 0.01) active.current = false
    c.update()
  })
  return null
}

function Scene({ vehicle, exploded, autoRotate, selectedId, onSelect, reducedMotion, controlsRef }: Props & { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const materials = useMaterials(vehicle.parts)
  const progress = useRef(exploded)
  const [hovered, setHovered] = useState<string | null>(null)
  const { gl, camera, scene } = useThree()

  useEffect(() => {
    gl.domElement.style.cursor = hovered ? 'pointer' : 'grab'
  }, [hovered, gl])

  // gancho de inspeção para testes automatizados (posição de tela e material de cada peça)
  useEffect(() => {
    const w = window as unknown as { __encaixe?: unknown }
    w.__encaixe = {
      project(id: string) {
        const g = scene.getObjectByName(id)
        if (!g) return null
        const box = new THREE.Box3().setFromObject(g.children[0] ?? g)
        const v = box.getCenter(new THREE.Vector3()).project(camera)
        const r = gl.domElement.getBoundingClientRect()
        return { x: Math.round(r.left + ((v.x + 1) / 2) * r.width), y: Math.round(r.top + ((1 - v.y) / 2) * r.height) }
      },
      material(id: string) {
        const m = materials.get(id)
        return m ? { transparent: m.transparent, opacity: m.opacity, color: '#' + m.color.getHexString() } : null
      },
      progress: () => progress.current,
    }
    return () => {
      delete w.__encaixe
    }
  }, [scene, camera, gl, materials])

  useFrame((_, dt) => {
    progress.current = reducedMotion ? exploded : THREE.MathUtils.damp(progress.current, exploded, 3.2, dt)
  })

  // peças fantasmas primeiro: o desenho transparente não esconde as destacadas
  const ordered = useMemo(() => [...vehicle.parts].sort((a, b) => Number(b.hubner) - Number(a.hubner)), [vehicle])

  return (
    <>
      <hemisphereLight args={['#f4f7ff', '#2a2420', 0.9]} />
      <directionalLight position={[6, 10, 6]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-8, 4, -6]} intensity={0.7} color="#9fc3ff" />
      <pointLight position={[0, 6, 0]} intensity={8} distance={14} color="#ffd2b0" />

      <group>
        {ordered.map((p, i) => (
          <PartGroup
            key={p.id}
            part={p}
            index={i}
            total={ordered.length}
            material={materials.get(p.id)!}
            progress={progress}
            hovered={hovered === p.id}
            selected={selectedId === p.id}
            onHover={setHovered}
            onSelect={onSelect}
          />
        ))}
      </group>

      <ContactShadows position={[0, -0.01, 0]} opacity={0.55} scale={24} blur={2.4} far={6} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} raycast={() => null}>
        <circleGeometry args={[13, 64]} />
        <meshStandardMaterial color="#1a1d24" roughness={1} />
      </mesh>
      <gridHelper args={[26, 26, '#2c313b', '#232730']} position={[0, -0.005, 0]} raycast={() => null} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate && !reducedMotion}
        autoRotateSpeed={0.6}
        minDistance={3.5}
        maxDistance={24}
        maxPolarAngle={Math.PI * 0.49}
        target={[0, 1.4, 0]}
      />
      <FocusRig controls={controlsRef} vehicle={vehicle} selectedId={selectedId} exploded={exploded} />
    </>
  )
}

/** Em tela estreita (celular em pé) a câmera recua para o veículo inteiro caber. */
function fitCamera(base: [number, number, number], el?: HTMLElement | null): [number, number, number] {
  const w = el?.clientWidth || window.innerWidth
  const h = el?.clientHeight || window.innerHeight * 0.6
  const k = THREE.MathUtils.clamp(0.92 / (w / h), 1, 1.6)
  return [base[0] * k, base[1] * Math.sqrt(k), base[2] * k]
}

export const Viewer3D = forwardRef<ViewerHandle, Props>(function Viewer3D(props, ref) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const [camPos] = useState(() => fitCamera(props.vehicle.camera, document.querySelector<HTMLElement>('[data-testid=stage]')))

  useImperativeHandle(ref, () => ({
    resetCamera() {
      const c = controlsRef.current
      if (!c) return
      c.object.position.set(...fitCamera(props.vehicle.camera, wrap.current))
      c.target.set(0, 1.4, 0)
      c.update()
    },
  }))

  return (
    <div ref={wrap} style={{ position: 'absolute', inset: 0 }}>
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ position: camPos, fov: 38, near: 0.1, far: 120 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onPointerMissed={() => props.onSelect(null)}
      aria-label={`Vista 3D explodida: ${props.vehicle.brand} ${props.vehicle.model}`}
    >
      <color attach="background" args={['#12141a']} />
      <fog attach="fog" args={['#12141a', 22, 42]} />
      <Scene {...props} controlsRef={controlsRef} />
    </Canvas>
    </div>
  )
})

export default Viewer3D
