import { RoundedBox } from '@react-three/drei'
import type { Material } from 'three'
import type { Shape } from '../types'

/*
 * Geometria 100% procedural (nenhum modelo 3D baixado): cada peça é composta de
 * primitivas do three.js. Mantém o repositório livre de licenças de terceiros.
 */

type Props = { shape: Shape; material: Material; noRaycast?: boolean }

const AXIS_ROT: Record<'x' | 'y' | 'z', [number, number, number]> = {
  x: [0, 0, Math.PI / 2],
  y: [0, 0, 0],
  z: [Math.PI / 2, 0, 0],
}

const none = () => null

export function ShapeMesh({ shape, material, noRaycast }: Props) {
  const rc = noRaycast ? { raycast: none } : {}
  const m = { material, castShadow: !noRaycast, receiveShadow: false, ...rc }

  switch (shape.kind) {
    case 'box':
      return shape.radius ? (
        <RoundedBox args={shape.size} radius={shape.radius} smoothness={3} {...m} />
      ) : (
        <mesh {...m}>
          <boxGeometry args={shape.size} />
        </mesh>
      )

    case 'cyl':
      return (
        <mesh rotation={AXIS_ROT[shape.axis ?? 'y']} {...m}>
          <cylinderGeometry args={[shape.rTop ?? shape.r, shape.r, shape.h, shape.seg ?? 40]} />
        </mesh>
      )

    case 'ring':
      return (
        <mesh rotation={AXIS_ROT[shape.axis ?? 'y']} {...m}>
          <torusGeometry args={[shape.r, shape.tube, 16, 48]} />
        </mesh>
      )

    case 'wheel':
      return (
        <group>
          <mesh rotation={AXIS_ROT.z} {...m}>
            <cylinderGeometry args={[shape.r, shape.r, shape.w, 48]} />
          </mesh>
          <mesh rotation={AXIS_ROT.z} {...m}>
            <torusGeometry args={[shape.r * 0.78, shape.w * 0.18, 12, 48]} />
          </mesh>
        </group>
      )

    case 'flywheel': {
      const { r, t } = shape
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh {...m}>
            <cylinderGeometry args={[r * 0.92, r * 0.92, t, 64]} />
          </mesh>
          {/* cremalheira */}
          <mesh rotation={[Math.PI / 2, 0, 0]} {...m}>
            <torusGeometry args={[r * 0.95, t * 0.55, 8, 96]} />
          </mesh>
          {/* cubo */}
          <mesh position={[0, t * 0.7, 0]} {...m}>
            <cylinderGeometry args={[r * 0.28, r * 0.32, t * 1.4, 32]} />
          </mesh>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * r * 0.55, t * 0.52, Math.sin(a) * r * 0.55]} {...m}>
                <cylinderGeometry args={[r * 0.06, r * 0.06, t * 0.1, 16]} />
              </mesh>
            )
          })}
        </group>
      )
    }

    case 'head': {
      const [x, y, z] = shape.size
      return (
        <group>
          <RoundedBox args={[x, y, z]} radius={0.03} smoothness={3} {...m} />
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={i} position={[-x / 2 + (x / 6) * (i + 0.5), y * 0.62, 0]} {...m}>
              <cylinderGeometry args={[0.05, 0.06, y * 0.35, 20]} />
            </mesh>
          ))}
          {/* tampa de válvulas */}
          <RoundedBox args={[x * 0.94, y * 0.4, z * 0.7]} radius={0.04} position={[0, y * 0.75, 0]} {...m} />
        </group>
      )
    }

    case 'pan': {
      const [x, y, z] = shape.size
      return (
        <group>
          {/* flange */}
          <mesh position={[0, y / 2 - 0.02, 0]} {...m}>
            <boxGeometry args={[x * 1.04, 0.04, z * 1.06]} />
          </mesh>
          <RoundedBox args={[x, y * 0.55, z]} radius={0.04} position={[0, y * 0.18, 0]} {...m} />
          {/* poço do cárter */}
          <RoundedBox args={[x * 0.45, y, z * 0.9]} radius={0.05} position={[x * 0.22, -y * 0.1, 0]} {...m} />
        </group>
      )
    }

    case 'knuckle': {
      const { s, side } = shape
      return (
        <group>
          {/* corpo vertical com olhais do pino-mestre */}
          <RoundedBox args={[s * 0.5, s * 1.3, s * 0.45]} radius={0.03} {...m} />
          <mesh position={[0, s * 0.72, 0]} {...m}>
            <cylinderGeometry args={[s * 0.2, s * 0.2, s * 0.25, 24]} />
          </mesh>
          {/* ponta de eixo */}
          <mesh position={[0, 0, side * s * 0.45]} rotation={AXIS_ROT.z} {...m}>
            <cylinderGeometry args={[s * 0.12, s * 0.2, s * 0.6, 24]} />
          </mesh>
          {/* braço de direção */}
          <mesh position={[-s * 0.55, -s * 0.35, -side * s * 0.1]} rotation={[0, 0, 0.35]} {...m}>
            <boxGeometry args={[s * 0.9, s * 0.16, s * 0.18]} />
          </mesh>
        </group>
      )
    }

    case 'crossmember': {
      const { w } = shape
      return (
        <group>
          <RoundedBox args={[0.42, 0.22, w * 0.55]} radius={0.04} {...m} />
          {[1, -1].map((sd) => (
            <group key={sd}>
              <mesh position={[0, 0.2, sd * w * 0.36]} rotation={[sd * -0.55, 0, 0]} {...m}>
                <boxGeometry args={[0.3, 0.2, w * 0.3]} />
              </mesh>
              <mesh position={[0, 0.34, sd * w * 0.48]} {...m}>
                <boxGeometry args={[0.36, 0.16, 0.12]} />
              </mesh>
              <mesh position={[0, -0.02, sd * w * 0.36]} rotation={AXIS_ROT.x} {...m}>
                <cylinderGeometry args={[0.09, 0.09, 0.46, 24]} />
              </mesh>
            </group>
          ))}
        </group>
      )
    }

    case 'slack': {
      const { s } = shape
      return (
        <group>
          <mesh rotation={AXIS_ROT.z} {...m}>
            <cylinderGeometry args={[s * 0.32, s * 0.32, s * 0.4, 28]} />
          </mesh>
          <mesh position={[0, s * 0.6, 0]} {...m}>
            <boxGeometry args={[s * 0.22, s * 1.1, s * 0.22]} />
          </mesh>
          <mesh position={[0, s * 1.15, 0]} rotation={AXIS_ROT.z} {...m}>
            <cylinderGeometry args={[s * 0.1, s * 0.1, s * 0.3, 16]} />
          </mesh>
        </group>
      )
    }

    case 'pump': {
      const { s } = shape
      return (
        <group>
          <mesh rotation={AXIS_ROT.x} {...m}>
            <cylinderGeometry args={[s * 0.5, s * 0.55, s * 0.6, 32]} />
          </mesh>
          <mesh position={[s * 0.35, s * 0.35, 0]} rotation={[0, 0, Math.PI / 2]} {...m}>
            <torusGeometry args={[s * 0.38, s * 0.16, 16, 32, Math.PI / 2]} />
          </mesh>
          <mesh position={[-s * 0.34, 0, 0]} {...m}>
            <boxGeometry args={[s * 0.1, s * 1.3, s * 1.3]} />
          </mesh>
        </group>
      )
    }

    case 'housing': {
      const [x, y, z] = shape.size
      return (
        <group>
          <RoundedBox args={[x, y, z]} radius={0.05} smoothness={3} {...m} />
          {[-0.3, 0, 0.3].map((f) => (
            <mesh key={f} position={[x * f, -y * 0.05, z * 0.52]} rotation={AXIS_ROT.z} {...m}>
              <cylinderGeometry args={[y * 0.14, y * 0.14, 0.06, 24]} />
            </mesh>
          ))}
          <mesh position={[-x * 0.52, 0, 0]} rotation={AXIS_ROT.x} {...m}>
            <cylinderGeometry args={[y * 0.42, y * 0.42, 0.05, 40]} />
          </mesh>
        </group>
      )
    }

    case 'cab': {
      const [x, y, z] = shape.size
      return (
        <group>
          <RoundedBox args={[x, y, z]} radius={0.16} smoothness={4} {...m} />
          <RoundedBox args={[x * 0.7, y * 0.18, z * 0.8]} radius={0.08} position={[-x * 0.1, y * 0.58, 0]} {...m} />
        </group>
      )
    }
  }
}
