'use client'

import { useRef } from 'react'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import Canvas, { type CanvasHandle } from './Canvas'

export default function WorkflowPage() {
  const canvasRef = useRef<CanvasHandle>(null)

  const handleAddNode = (nodeName: string, position?: { x: number; y: number }) => {
    if (canvasRef.current) {
      canvasRef.current.addNode(nodeName, position)
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-y-hidden">
      <TopBar />
      <section className="flex h-full w-full overflow-y-hidden bg-[#f6f6f6]">
        <Sidebar onAddNode={handleAddNode} />
        <Canvas ref={canvasRef} />
      </section>
    </div>
  )
}

