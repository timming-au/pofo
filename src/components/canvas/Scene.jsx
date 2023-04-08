import { Canvas } from '@react-three/fiber'
import { Preload, PerspectiveCamera, PerformanceMonitor } from '@react-three/drei'
import { Vector3 } from 'three'
import Camera from './Camera'
import Effects from './Effects'
import LightCube from './LightCube'
import { useState, useEffect } from 'react'

export default function Scene({ children, ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  const [dpr, setDpr] = useState(1)
  return (
    <Canvas {...props}>
      <PerformanceMonitor onIncline={() => setDpr(window.devicePixelRatio)} onDecline={() => setDpr(1)}>
        <LightCube />
        <ambientLight intensity={0.01} />
        <hemisphereLight groundColor='black' intensity={0.01} />
        {children}
        <Preload all />
        <Camera />
        <Effects />
      </PerformanceMonitor>
    </Canvas>
  )
}
