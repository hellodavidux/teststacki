'use client'

import { MoreVertical, Plus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface PlaceholderNodeProps {
  id: string
  name: string
  position: { x: number; y: number }
  onPositionChange?: (id: string, position: { x: number; y: number }) => void
  onHandleDragStart?: (id: string, side: 'left' | 'right', position: { x: number; y: number }) => void
  onSelect?: (id: string) => void
}

export default function PlaceholderNode({ 
  id, 
  name, 
  position, 
  onPositionChange,
  onHandleDragStart,
  onSelect
}: PlaceholderNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLeftHandleHovered, setIsLeftHandleHovered] = useState(false)
  const [isRightHandleHovered, setIsRightHandleHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const leftHandleRef = useRef<HTMLButtonElement>(null)
  const rightHandleRef = useRef<HTMLButtonElement>(null)

  const handleNodeMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    const startX = e.clientX - position.x
    const startY = e.clientY - position.y
    setIsDragging(true)
    setDragStart({ x: startX, y: startY })
    setMouseDownPos({ x: e.clientX, y: e.clientY })
  }

  const handleHandleMouseDown = (side: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (onHandleDragStart) {
      const handleRef = side === 'left' ? leftHandleRef : rightHandleRef
      if (handleRef.current) {
        const rect = handleRef.current.getBoundingClientRect()
        const handleCenterX = rect.left + rect.width / 2
        const handleCenterY = rect.top + rect.height / 2
        onHandleDragStart(id, side, { x: handleCenterX, y: handleCenterY })
      }
    }
  }

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }
      if (onPositionChange) {
        onPositionChange(id, newPosition)
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      // Check if this was a click (not a drag) - if mouse moved less than 5px, treat as click
      if (mouseDownPos && onSelect) {
        const deltaX = Math.abs(e.clientX - mouseDownPos.x)
        const deltaY = Math.abs(e.clientY - mouseDownPos.y)
        if (deltaX < 5 && deltaY < 5) {
          // It was a click, not a drag - select the node
          onSelect(id)
        }
      }
      setIsDragging(false)
      setMouseDownPos(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, id, onPositionChange, mouseDownPos, onSelect])


  return (
    <div 
      ref={nodeRef}
      data-node-id={id}
      className="relative group cursor-move"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleNodeMouseDown}
    >
      {/* Left Handle */}
      <button
        ref={leftHandleRef}
        data-handle="left"
        className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 rounded-lg shadow-sm flex items-center justify-center transition-all duration-200 z-10 cursor-pointer ${
          isLeftHandleHovered 
            ? 'w-8 h-8 bg-black text-white scale-110 shadow-lg' 
            : isHovered
            ? 'w-7 h-7 bg-white text-gray-700 border border-gray-200'
            : 'w-5 h-5 bg-transparent text-gray-400 border border-gray-300'
        }`}
        onMouseEnter={() => setIsLeftHandleHovered(true)}
        onMouseLeave={() => setIsLeftHandleHovered(false)}
        onMouseDown={(e) => handleHandleMouseDown('left', e)}
      >
        <Plus className={isHovered || isLeftHandleHovered ? "size-4" : "size-3"} />
      </button>

      {/* Node Content */}
      <div className={`bg-white rounded-xl p-5 w-80 relative transition-all duration-200 ${
        isHovered ? 'shadow-lg' : 'shadow-md'
      }`}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center flex-shrink-0 bg-gray-50">
            <div className="w-4 h-4 bg-gray-300 rounded" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{name}</h3>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <MoreVertical className="size-4" />
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="mt-4">
          <div className="w-full min-h-[60px] p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-sm text-gray-400">Placeholder</span>
          </div>
        </div>
      </div>

      {/* Right Handle */}
      <button
        ref={rightHandleRef}
        data-handle="right"
        className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 rounded-lg shadow-sm flex items-center justify-center transition-all duration-200 z-10 cursor-pointer ${
          isRightHandleHovered 
            ? 'w-8 h-8 bg-black text-white scale-110 shadow-lg' 
            : isHovered
            ? 'w-7 h-7 bg-white text-gray-700 border border-gray-200'
            : 'w-5 h-5 bg-transparent text-gray-400 border border-gray-300'
        }`}
        onMouseEnter={() => setIsRightHandleHovered(true)}
        onMouseLeave={() => setIsRightHandleHovered(false)}
        onMouseDown={(e) => handleHandleMouseDown('right', e)}
      >
        <Plus className={isHovered || isRightHandleHovered ? "size-4" : "size-3"} />
      </button>
    </div>
  )
}

