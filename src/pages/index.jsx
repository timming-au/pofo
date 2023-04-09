import dynamic from 'next/dynamic'
import React from 'react'

const Zoop = dynamic(() => import('@/components/canvas/Cubes'), { ssr: false })

export default function Page(props) {
  return <>Hello</>
}

Page.canvas = (props) => <Zoop route='/blob' position-y={-0.75} />

// export async function getStaticProps() {
//   return { props: { title: 'Zoop' } }
// }
