import { ColorRepresentation, Object3D } from "three";

type CubeProps = {
  rot: [x:number,y:number,z:number],
  pos: [x:number,y:number,z:number],
  size: [x:number,y:number,z:number],
  color: ColorRepresentation,
}

type instancerParams = {
  spawnProps: CubeProps[][],
  dummy?: Object3D, 
  initialScale: number, 
  maxScale: number
}

type FloorProps = {
  position:[x:number,y:number,z:number],
  rotation:[x:number,y:number,z:number],
  size: [x:number,z:number],
}