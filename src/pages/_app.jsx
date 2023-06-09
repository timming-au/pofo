import { useRef } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/config'
import Layout from '@/components/dom/Layout'
import Scroll from '@/templates/Scroll'
import '@/styles/index.css'
import React from 'react'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: true })

export default function App({ Component, pageProps }) {
  const ref = useRef(null)
  return (
    <>
      <Header {...pageProps} />
      {/* 
      // @ts-ignore */}
      <Layout ref={ref}>
        <span className='relative z-[99999999999]'>
          <Component {...pageProps} />
        </span>
        {/* The canvas can either be in front of the dom or behind. If it is in front it can overlay contents.
         * Setting the event source to a shared parent allows both the dom and the canvas to receive events.
         * Since the event source is now shared, the canvas would block events, we prevent that with pointerEvents: none. */}
        {Component?.canvas && (
          <Scene
            style={{ position: 'absolute', top: '0' }}
            className='pointer-events-none'
            eventSource={ref}
            eventPrefix='client'>
            {Component.canvas(pageProps)}
          </Scene>
        )}
      </Layout>
    </>
  )
}
