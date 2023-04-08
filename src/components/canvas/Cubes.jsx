import { useState } from 'react'
import { useRouter } from 'next/router'
import { useCursor, MeshReflectorMaterial } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Vector3, Euler } from 'three'
import { randHSL } from '@/helper'

export default function Blob({ route, ...props }) {
  class Pillar {
    static key = 0
    pillar = []
    cubesPerPillar = 5
    constructor(spawns, cubesPerPillar, cubeSize) {
      this.pos = spawns.position
      this.rot = spawns.rotation
      this.cubesPerPillar = cubesPerPillar
      this.cubeSize = cubeSize
      this.create()
    }
    cubeGen(y) {
      let cube = {
        rot: [0, Math.random() * Math.PI / 20 + this.rot[1], 0],
        pos: [
          (Math.random() * this.cubeSize) / 3 + this.pos[0],
          y * this.cubeSize + this.pos[1] + this.cubeSize / 2,
          (Math.random() * this.cubeSize) / 3 + this.pos[2],
        ],
        size: [this.cubeSize, this.cubeSize, this.cubeSize],
        color: randHSL.noColor(),
      }
      return cube
    }
    create() {
      for (let i = 0; i < this.cubesPerPillar; i++) {
        let cube = this.cubeGen(i)
        let mesh = (
          <mesh key={Pillar.key} rotation={new Euler(...cube.rot)} position={new Vector3(...cube.pos)}>
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
    spawns = []
    constructor(pos, rot, cubesPerPillar, pillarCount, cubeSize) {
      this.pos = [pos[0], pos[1], pos[2]]
      this.rotation = [rot[0], rot[1], rot[2]]
      this.cubesPerPillar = cubesPerPillar
      this.pillarCount = pillarCount
      this.cubeSize = cubeSize
      this.produce()
    }
    createSpawns() {
      let r = this.cubeSize / 3
      let c = this.cubeSize + r
      let n = (this.pillarCount * c) / 2
      for (let i = 0; i < this.pillarCount; i++) {
        this.spawns.push({
          position:[
            Math.random() * r + c * i - n + this.pos[0],
            0 + this.pos[1],
            this.pos[2] + Math.pow(Math.abs(this.pillarCount / 2 - i - Math.random()), 0.5),
          ], 
          rotation:[
            this.rotation[0],
            this.pillarCount / 2 - i,
            this.rotation[2],
          ]
        }
      )}
    }
    createPillars() {
      for (let i = 0; i < this.spawns.length; i++) {
        this.pillars.push(new Pillar(this.spawns[i], this.cubesPerPillar, this.cubeSize))
      }
    }
    produce() {
      this.createSpawns()
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
      this.pf = new PillarFactory([...floorPos], 5, 7, 0.5)
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
