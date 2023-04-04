import { useState } from 'react'
import { useRouter } from 'next/router'
import { useCursor, MeshReflectorMaterial } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { randHSL } from '@/helper'

export default function Blob({ route, ...props }) {
  class Pillar {
    static key = 0
    pos = [0, 0, 0]
    pillar = []
    cubesPerPillar = 5
    cubeSize = 1
    constructor(position, cubesPerPillar, cubeSize) {
      this.pos = position
      this.cubesPerPillar = cubesPerPillar
      this.cubeSize = cubeSize ? cubeSize : 1
      this.create()
    }
    cubeGen(y) {
      let cube = {
        rotation: [0, Math.random() * Math.PI, 0],
        pos: [
          Math.random() * 0.3 + this.pos[0],
          y + this.pos[1] + this.cubeSize / 2,
          Math.random() * 0.3 + this.pos[2],
        ],
        size: [1, 1, 1],
        color: randHSL.pastel(),
      }
      return cube
    }
    create() {
      for (let i = 0; i < this.cubesPerPillar; i++) {
        let cube = this.cubeGen(i)
        let mesh = (
          <mesh key={Pillar.key} rotation={[...cube.rotation]} position={new Vector3(...cube.pos)}>
            <boxGeometry args={[...cube.size]}></boxGeometry>
            <meshLambertMaterial color={cube.color}></meshLambertMaterial>
          </mesh>
        )
        Pillar.key += 1
        this.pillar.push(mesh)
      }
    }
    get() {
      return this.pillar
    }
  }
  class PillarFactory {
    pillars = []
    pillarCount = 5
    cubesPerPillar = 5
    spawnPositions = []
    pos = [0, 0, 0]
    cubeSize = 1
    constructor(pos, cubesPerPillar, pillarCount, cubeSize) {
      this.pos = [pos[0], pos[1], pos[2]]
      this.cubesPerPillar = cubesPerPillar
      this.pillarCount = pillarCount
      this.cubeSize = cubeSize ? cubeSize : 1
      this.produce()
    }
    createSpawnPositions() {
      let r = 0.3
      let c = this.cubeSize + r
      let n = (this.pillarCount * c) / 2
      for (let i = 0; i < this.pillarCount; i++) {
        this.spawnPositions.push([
          Math.random() * r + c * i - n + this.pos[0],
          0 + this.pos[1],
          Math.random() * 2 - 1 + this.pos[2],
        ])
      }
    }
    createPillars() {
      for (let i = 0; i < this.spawnPositions.length; i++) {
        this.pillars.push(new Pillar(this.spawnPositions[i], this.cubesPerPillar))
      }
    }
    produce() {
      this.createSpawnPositions()
      this.createPillars()
    }
    get() {
      return this.pillars
    }
  }
  class Floor {
    pos
    size
    mesh
    constructor(position, size) {
      this.pos = position
      this.size = size
      this.mesh = this.create()
    }
    create() {
      let floor = (
        <mesh position={[...this.pos]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[...this.size]}></planeGeometry>
          <MeshReflectorMaterial
            blur={[300, 100]} // Blur ground reflections (width, height), 0 skips blur
            mixBlur={1} // How much blur mixes with surface roughness (default = 1)
            mixStrength={50} // Strength of the reflections
            roughness={0.9}
            resolution={2048} // Off-buffer resolution, lower=faster, higher=better quality, slower
            mirror={1} // Mirror environment, 0 = texture colors, 1 = pick up env colors
            depthScale={2} // Scale the depth factor (0 = no depth, default = 0)
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color='#050505'
            metalness={0.4}
            debug={0} /* Depending on the assigned value, one of the following channels is shown:
      0 = no debug
      1 = depth channel
      2 = base channel
      3 = distortion channel
      4 = lod channel (based on the roughness)
    */
            reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
          />
        </mesh>
      )
      return floor
    }
    get() {
      return this.mesh
    }
  }
  class TheScene {
    scene
    pf
    floor
    constructor(scene) {
      this.scene = scene
      let floorPos = [0, -4, 0]
      let floorSize = [30, 30]
      this.floor = new Floor(floorPos, floorSize)
      this.pf = new PillarFactory([...floorPos], 5, 5)
    }
    getCubes() {
      return this.pf
        .get()
        .map((pillar) => pillar.get())
        .flat()
    }
    getFloor() {
      return this.floor.get()
    }
    run() {
      this.scene.background = new Color('rgb(0,0,0)')
    }
  }
  const { scene } = useThree()
  let theScene = new TheScene(scene)
  let cubes = theScene.getCubes()
  let floor = theScene.getFloor()
  return (
    <>
      {cubes}
      {floor}
    </>
  )
}
