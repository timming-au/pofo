import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useCursor, MeshReflectorMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Euler, Color, Object3D, DynamicDrawUsage } from 'three'
import { maths, randHSL } from '@/helper'
import React from 'react'

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
      let randPosMultiplier = 5
      let cube = {
        rot: [0, (Math.random() * Math.PI) / 20 + this.rot[1], 0],
        pos: [
          (Math.random() * this.cubeSize) / randPosMultiplier + this.pos[0],
          y * this.cubeSize + this.pos[1] + this.cubeSize / 2,
          (Math.random() * this.cubeSize) / randPosMultiplier + this.pos[2],
        ],
        size: [this.cubeSize, this.cubeSize, this.cubeSize],
        color: randHSL.noColor(),
      }
      return cube
    }
    create() {
      for (let i = 0; i < this.cubesPerPillar; i++) {
        let cube = this.cubeGen(i)
        this.pillar.push(cube)
      }
    }
    get() {
      return this.pillar
    }
  }
  class PillarFactory {
    pillars = []
    spawns = []
    constructor(pos, rot, minCubesPerPillar, maxCubesPerPillar, pillarCount, cubeSize) {
      this.pos = [pos[0], pos[1], pos[2]]
      this.rotation = [rot[0], rot[1], rot[2]]
      this.minCubesPerPillar = minCubesPerPillar
      this.maxCubesPerPillar = maxCubesPerPillar
      this.pillarCount = pillarCount
      this.cubeSize = cubeSize
      this.produce()
    }
    createSpawns() {
      // random x distance between pillars
      let r = this.cubeSize / 4
      // x distance between pillars based on cube size
      let c = this.cubeSize + r
      // x length based on pillar count, size & random distance
      let n = (this.pillarCount * c) / 2
      let mid = this.pillarCount / 2
      let midFloor = Math.floor(mid)
      let zExponent = 0.6
      for (let i = 0; i < this.pillarCount; i++) {
        let p = midFloor - i
        let z = Math.abs(p - (Math.random() - 0.5))
        let normalisedZ = Math.abs(p / midFloor)
        let exponentZ = maths.ease.inQuad(Math.abs(normalisedZ)) / 2
        this.spawns.push({
          position: [
            Math.random() * r + c * i - n + this.pos[0] + p * c * 0.6 * exponentZ,
            0 + this.pos[1],
            this.pos[2] + Math.pow(z, exponentZ),
          ],
          rotation: [this.rotation[0], (p * Math.PI) / midFloor / 3 + this.rotation[1], this.rotation[2]],
        })
      }
    }
    createPillars() {
      for (let i = 0; i < this.spawns.length; i++) {
        this.pillars.push(
          new Pillar(this.spawns[i], maths.between(this.minCubesPerPillar, this.maxCubesPerPillar), this.cubeSize),
        )
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
      this.pf = new PillarFactory([...floorPos], [0, 0, 0], 6, 10, 25, 0.3)
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
  function Instances({ spawnProps, dummy = new Object3D(), initialScale, maxScale }) {
    const ref = useRef(null)
    let needToScale = true
    let scaleSpeed = 0.01

    useEffect(() => {
      for (let i = 0; i < spawnProps.length; i++) {
        // Set initial positions of the dummy
        dummy.position.set(...spawnProps[i].pos)
        dummy.rotation.set(...spawnProps[i].rot)
        dummy.scale.set(...spawnProps[i].size.map((s) => s * initialScale))
        dummy.updateMatrix()

        // Set matrix of instance
        ref.current.setMatrixAt(i, dummy.matrix)
        ref.current.setColorAt(i, new Color(spawnProps[i].color))
      }

      // Update the instance
      ref.current.instanceMatrix.needsUpdate = true
      ref.current.instanceMatrix.setUsage(DynamicDrawUsage)
    })
    useFrame((state, delta) => {
      if (needToScale) {
        for (let i = 0; i < spawnProps.length; i++) {
          // get current index's matrix
          ref.current.getMatrixAt(i, dummy.matrix)

          // get target scale
          let targetSize = new Vector3(...spawnProps[i].size.map((s) => s * maxScale))
          let currentSize = dummy.scale

          if (targetSize <= currentSize) {
            // stop scaling
            needToScale = false
          } else {
            // incase all cubes not at max scale
            needToScale = true
          }

          // set scale
          dummy.scale.set(
            ...currentSize
              .add(targetSize.subVectors(targetSize, currentSize).multiplyScalar(scaleSpeed * delta))
              .toArray(),
          )

          // re-set other matrix props
          dummy.position.set(...spawnProps[i].pos)
          dummy.rotation.set(...spawnProps[i].rot)
          dummy.updateMatrix()

          // set matrix!
          ref.current.setMatrixAt(i, dummy.matrix)
        }
        // tells the renderer that the instance matrix has changed and needs to be updated
        ref.current.instanceMatrix.needsUpdate = true
      }
    })
    return (
      <instancedMesh ref={ref} args={[null, null, cubes.length]}>
        <boxGeometry args={[1, 1, 1]}></boxGeometry>
        <meshLambertMaterial></meshLambertMaterial>
      </instancedMesh>
    )
  }

  const { scene } = useThree()
  let theScene = new TheScene(scene)
  let cubes = theScene.getCubes()
  let floor = theScene.getFloor()

  return (
    <>
      <Instances spawnProps={cubes} initialScale={1.5} maxScale={3} />
      {floor}
    </>
  )
}
