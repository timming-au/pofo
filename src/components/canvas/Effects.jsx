import { EffectComposer, Bloom, LUT } from '@react-three/postprocessing'
import React from 'react'
export default function Effects() {
  return (
    <EffectComposer disableNormalPass>
      <Bloom luminanceThreshold={0.6} mipmapBlur luminanceSmoothing={0} intensity={0.2} />
    </EffectComposer>
  )
}
