import { RenderTexture, PerspectiveCamera, Text } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import React from 'react'
export default function LightCube() {
  return (
    <>
      <group position={[0, -3, 3]}>
        <ScreenText invert={undefined} />
        <pointLight intensity={0.3} />
        <rectAreaLight args={['white', 10, 1, 1]} rotation={[-Math.PI / 2, 0, 0]} />
      </group>
    </>
  )
}
function Screen({ frame, panel, children, ...props }) {
  return (
    <group {...props}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false}>
          <RenderTexture width={128} height={128} attach='map' anisotropy={16} sourceFile={undefined}>
            {children}
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
    </group>
  )
}

/* Renders a monitor with some text */
function ScreenText({ invert, x = 0, y = 0, ...props }) {
  const textRef = useRef(null)
  const rand = Math.random() * 10000
  useFrame((state) => (textRef.current.position.x = x + Math.sin(rand + state.clock.elapsedTime / 4) * 8))
  return (
    //@ts-ignore
    <Screen {...props}>
      <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 15]} />
      <color attach='background' args={[invert ? 'black' : '#35c19f']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Text
        // font='/Inter-Medium.woff'
        position={[x, y, 0]}
        ref={textRef}
        fontSize={4}
        letterSpacing={-0.1}
        color={!invert ? 'black' : '#35c19f'}>
        Poimandres.
      </Text>
    </Screen>
  )
}
