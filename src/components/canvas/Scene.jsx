import { Canvas } from '@react-three/fiber'
import { Preload, PerspectiveCamera } from '@react-three/drei'
import { Vector3 } from 'three'
import Camera from './Camera'
import Effects from './Effects'
import LightCube from './LightCube'

export default function Scene({ children, ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props}>
      <LightCube />
      <ambientLight intensity={0.01} />
      <hemisphereLight groundColor='black' intensity={0.01} />
      {children}
      <Preload all />
      <Camera />
      <Effects />
    </Canvas>
  )
}
