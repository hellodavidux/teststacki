'use client'

import TopBar from './TopBar'
import Sidebar from './Sidebar'
import Canvas from './Canvas'

export default function WorkflowPage() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-y-hidden">
      <TopBar />
      <section className="flex h-full w-full overflow-y-hidden bg-[#f6f6f6]">
        <Sidebar />
        <Canvas />
      </section>
    </div>
  )
}

