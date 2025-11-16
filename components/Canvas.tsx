'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import InputNode from './InputNode'
import PlaceholderNode from './PlaceholderNode'
import NodeSelector from './NodeSelector'

interface Node {
  id: string
  name: string
  position: { x: number; y: number }
  type: 'input' | 'placeholder'
}

interface Connection {
  from: { nodeId: string; side: 'right' }
  to: { nodeId: string; side: 'left' }
}

export default function Canvas() {
  const [zoom, setZoom] = useState(1)
  const [nodeSelectorOpen, setNodeSelectorOpen] = useState(false)
  const [nodeSelectorPosition, setNodeSelectorPosition] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'input-node', name: 'Input', position: { x: 0, y: 0 }, type: 'input' }
  ])
  const [connections, setConnections] = useState<Connection[]>([])
  const [pendingConnection, setPendingConnection] = useState<{ nodeId: string; side: 'left' | 'right' } | null>(null)
  const [draggingConnection, setDraggingConnection] = useState<{ nodeId: string; side: 'left' | 'right'; startPos: { x: number; y: number } } | null>(null)
  const [dragMousePos, setDragMousePos] = useState<{ x: number; y: number } | null>(null)
  const [handlePositions, setHandlePositions] = useState<Record<string, { left?: { x: number; y: number }; right?: { x: number; y: number } }>>({})
  const canvasRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const nodeContainerRef = useRef<HTMLDivElement>(null)

  // Update handle positions by querying DOM
  const updateHandlePositions = useCallback(() => {
    const newPositions: Record<string, { left?: { x: number; y: number }; right?: { x: number; y: number } }> = {}
    
    nodes.forEach(node => {
      if (node.type === 'input') {
        // Find input node's right handle
        const inputNode = nodeContainerRef.current?.querySelector(`[data-node-id="${node.id}"]`)
        const rightHandle = inputNode?.querySelector('button[data-handle="right"]') as HTMLElement
        if (rightHandle) {
          const rect = rightHandle.getBoundingClientRect()
          newPositions[node.id] = {
            right: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
          }
        }
      } else {
        // Find placeholder node's handles
        const placeholderNode = nodeContainerRef.current?.querySelector(`[data-node-id="${node.id}"]`)
        const leftHandle = placeholderNode?.querySelector('button[data-handle="left"]') as HTMLElement
        const rightHandle = placeholderNode?.querySelector('button[data-handle="right"]') as HTMLElement
        
        if (leftHandle) {
          const rect = leftHandle.getBoundingClientRect()
          if (!newPositions[node.id]) newPositions[node.id] = {}
          newPositions[node.id].left = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        }
        if (rightHandle) {
          const rect = rightHandle.getBoundingClientRect()
          if (!newPositions[node.id]) newPositions[node.id] = {}
          newPositions[node.id].right = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        }
      }
    })
    
    setHandlePositions(newPositions)
  }, [nodes])

  // Update handle positions when nodes change or on mount
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      updateHandlePositions()
    })
    // Also update on window resize
    const handleResize = () => {
      requestAnimationFrame(() => {
        updateHandlePositions()
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [nodes, updateHandlePositions])

  // Function to center a node in the viewport
  const centerNodeInViewport = useCallback((nodeId: string) => {
    const scrollContainer = scrollContainerRef.current
    const nodeContainer = nodeContainerRef.current
    if (!scrollContainer || !nodeContainer) return

    // Find the node element by data-node-id
    const nodeElement = nodeContainer.querySelector(`[data-node-id="${nodeId}"]`)
    if (!nodeElement) return

    // Get the bounding box of the node
    const nodeRect = nodeElement.getBoundingClientRect()
    const containerRect = scrollContainer.getBoundingClientRect()
    
    // Calculate the node's position relative to the scroll container's content
    const nodeX = nodeRect.left - containerRect.left + scrollContainer.scrollLeft
    const nodeY = nodeRect.top - containerRect.top + scrollContainer.scrollTop
    
    // Calculate center position
    const containerWidth = scrollContainer.clientWidth
    const containerHeight = scrollContainer.clientHeight
    const nodeWidth = nodeRect.width
    const nodeHeight = nodeRect.height
    
    // Center the node in the viewport (with a slight offset to account for zoom)
    const scrollX = nodeX + (nodeWidth / 2) - (containerWidth / 2)
    const scrollY = nodeY + (nodeHeight / 2) - (containerHeight / 2)
    
    // Smooth scroll to center the node
    scrollContainer.scrollTo({
      left: Math.max(0, scrollX),
      top: Math.max(0, scrollY),
      behavior: 'smooth'
    })
  }, [])

  // Center the input node on initial load
  useEffect(() => {
    // Use double requestAnimationFrame to ensure all transforms and layout are complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        centerNodeInViewport('input-node')
      })
    })
  }, [centerNodeInViewport])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel events within the canvas
      if (!e.target) return
      const target = e.target as HTMLElement
      if (!canvas.contains(target)) return
      
      // Don't handle wheel events if they're inside the NodeSelector
      if (target.closest('.fixed.bg-white.rounded-lg.shadow-xl')) return
      
      // Prevent default browser zoom and scrolling
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      
      const delta = e.deltaY * -0.01
      setZoom((prevZoom) => {
        const newZoom = Math.min(Math.max(0.5, prevZoom + delta), 3)
        return newZoom
      })
    }

    // Use capture phase to catch events before they bubble
    canvas.addEventListener('wheel', handleWheel, { passive: false, capture: true })

    return () => {
      canvas.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [])

  // Handle connection dragging
  useEffect(() => {
    if (!draggingConnection) return

    const handleMouseMove = (e: MouseEvent) => {
      setDragMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (draggingConnection) {
        // Open node selector at mouse position
        const selectorWidth = 320
        const selectorHeight = 480
        const padding = 8
        
        let x = e.clientX + padding
        let y = e.clientY - selectorHeight / 2
        
        // Adjust if off screen
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        if (x + selectorWidth > viewportWidth) {
          x = e.clientX - selectorWidth - padding
          if (x < 0) x = padding
        }
        
        if (y + selectorHeight > viewportHeight) {
          y = viewportHeight - selectorHeight - padding
        }
        
        if (y < padding) {
          y = padding
        }
        
        setPendingConnection({ nodeId: draggingConnection.nodeId, side: draggingConnection.side })
        setNodeSelectorPosition({ x, y })
        setNodeSelectorOpen(true)
      }
      
      setDraggingConnection(null)
      setDragMousePos(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingConnection])

  // Handle left-click panning
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const canvas = canvasRef.current
    if (!scrollContainer || !canvas) return

    let panning = false
    let startX = 0
    let startY = 0

    const handleMouseDown = (e: MouseEvent) => {
      // Only handle left mouse button
      if (e.button !== 0) return
      
      // Don't pan if we're dragging a connection
      if (draggingConnection) return
      
      // Only handle if within canvas
      if (!e.target) return
      const target = e.target as HTMLElement
      if (!canvas.contains(target)) return
      
      // Don't start panning if clicking on interactive elements or nodes
      if (target.closest('button, textarea, input, [data-node]')) return
      
      // Check if clicking on a node (nodes have specific classes or structure)
      // Don't pan if clicking directly on node content
      if (target.closest('.bg-white.rounded-xl')) return
      
      // Don't pan if clicking inside the NodeSelector
      if (target.closest('.fixed.bg-white.rounded-lg.shadow-xl')) return

      e.preventDefault()
      e.stopPropagation()
      panning = true
      setIsPanning(true)
      startX = e.clientX + scrollContainer.scrollLeft
      startY = e.clientY + scrollContainer.scrollTop
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!panning || draggingConnection) return
      
      e.preventDefault()
      e.stopPropagation()
      scrollContainer.scrollLeft = startX - e.clientX
      scrollContainer.scrollTop = startY - e.clientY
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (panning) {
        e.preventDefault()
        e.stopPropagation()
      }
      panning = false
      setIsPanning(false)
    }

    // Add listeners to document to catch all events
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingConnection])

  return (
    <div 
      ref={canvasRef}
      className="flex-grow overflow-hidden relative"
      style={{ 
        isolation: 'isolate',
        contain: 'layout style paint',
        transform: 'translateZ(0)', // Create new stacking context
      }}
    >
      <div 
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-auto"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          transform: 'translateZ(0)', // Isolate transforms
          cursor: isPanning ? 'grabbing' : 'grab',
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: 0,
            width: '200%',
            height: '200%',
            backgroundImage: `
              radial-gradient(circle, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: '0 0',
            willChange: 'background-size',
          }}
        />
        <div 
          className="absolute flex items-center justify-center"
          style={{
            minWidth: '200%',
            minHeight: '200%',
            width: '200%',
            height: '200%',
            transform: `scale(${zoom}) translateZ(0)`,
            transformOrigin: 'center center',
            willChange: 'transform',
            contain: 'layout style paint',
          }}
        >
          <div 
            ref={nodeContainerRef}
            className="relative" 
            style={{ transform: 'translate(20%, 0)' }}
          >
            {nodes.map((node) => {
              if (node.type === 'input') {
                return (
                  <InputNode
                    key={node.id}
                    id={node.id}
                    onHandleDragStart={(position) => {
                      setDraggingConnection({ nodeId: node.id, side: 'right', startPos: position })
                      setDragMousePos(position)
                    }}
                  />
                )
              } else {
                return (
                  <PlaceholderNode
                    key={node.id}
                    id={node.id}
                    name={node.name}
                    position={node.position}
                    onPositionChange={(id, newPosition) => {
                      setNodes(prev => prev.map(n => n.id === id ? { ...n, position: newPosition } : n))
                      // Update handle positions after position change
                      requestAnimationFrame(() => {
                        updateHandlePositions()
                      })
                    }}
                    onHandleDragStart={(id, side, position) => {
                      setDraggingConnection({ nodeId: id, side, startPos: position })
                      setDragMousePos(position)
                    }}
                  />
                )
              }
            })}
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <svg
        className="fixed inset-0 pointer-events-none z-30"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Existing connections */}
        {connections.map((conn, index) => {
          const fromPos = handlePositions[conn.from.nodeId]?.right
          const toPos = handlePositions[conn.to.nodeId]?.left
          
          if (!fromPos || !toPos) return null
          
          return (
            <line
              key={index}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
          )
        })}
        
        {/* Dragging connection arrow */}
        {draggingConnection && dragMousePos && (() => {
          const startPos = draggingConnection.startPos
          const endPos = dragMousePos
          
          // Calculate arrow direction
          const dx = endPos.x - startPos.x
          const dy = endPos.y - startPos.y
          const angle = Math.atan2(dy, dx)
          
          // Arrow head size
          const arrowSize = 10
          const arrowAngle = Math.PI / 6 // 30 degrees
          
          // Calculate arrow head points
          const arrowX1 = endPos.x - arrowSize * Math.cos(angle - arrowAngle)
          const arrowY1 = endPos.y - arrowSize * Math.sin(angle - arrowAngle)
          const arrowX2 = endPos.x - arrowSize * Math.cos(angle + arrowAngle)
          const arrowY2 = endPos.y - arrowSize * Math.sin(angle + arrowAngle)
          
          return (
            <g>
              {/* Main line */}
              <line
                x1={startPos.x}
                y1={startPos.y}
                x2={endPos.x}
                y2={endPos.y}
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeOpacity="0.4"
              />
              {/* Arrow head */}
              <polygon
                points={`${endPos.x},${endPos.y} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
                fill="#d1d5db"
                opacity="0.4"
              />
            </g>
          )
        })()}
        
      </svg>

      {/* Node Selector - managed at canvas level */}
      <NodeSelector
        isOpen={nodeSelectorOpen}
        onClose={() => {
          setNodeSelectorOpen(false)
          setPendingConnection(null)
        }}
        onSelectNode={(nodeId, nodeName) => {
          if (pendingConnection) {
            // Find the source node to position new node relative to it
            const sourceNode = nodes.find(n => n.id === pendingConnection.nodeId)
            const offsetX = pendingConnection.side === 'right' ? 350 : -350
            
            // Get the actual DOM position of the source node for accurate horizontal alignment
            let sourcePosition = sourceNode?.position || { x: 300, y: 0 }
            
            // If source node exists, try to get its actual visual position from the DOM
            // This is important because InputNode has its own position state that may differ from Canvas state
            if (sourceNode && nodeContainerRef.current && scrollContainerRef.current) {
              const sourceNodeElement = nodeContainerRef.current.querySelector(`[data-node-id="${sourceNode.id}"]`)
              if (sourceNodeElement) {
                // Get the computed transform to extract the actual translate values
                const computedStyle = window.getComputedStyle(sourceNodeElement)
                const transform = computedStyle.transform
                
                if (transform && transform !== 'none') {
                  // Parse the transform matrix to get translate values
                  const matrix = new DOMMatrix(transform)
                  // The node's position in the transformed coordinate space
                  sourcePosition = {
                    x: matrix.e, // translateX
                    y: matrix.f  // translateY
                  }
                }
              }
            }
            
            // Create new placeholder node - horizontally aligned (same Y coordinate, no vertical offset)
            const newNodeId = `node-${Date.now()}`
            const newNode: Node = {
              id: newNodeId,
              name: nodeName,
              position: { 
                x: sourcePosition.x + offsetX, 
                y: sourcePosition.y // Exact same Y - ensures horizontal alignment
              },
              type: 'placeholder'
            }
            
            setNodes(prev => [...prev, newNode])
            
            // Create connection
            if (pendingConnection.side === 'right') {
              setConnections(prev => [...prev, {
                from: { nodeId: pendingConnection.nodeId, side: 'right' },
                to: { nodeId: newNodeId, side: 'left' }
              }])
            } else {
              setConnections(prev => [...prev, {
                from: { nodeId: newNodeId, side: 'right' },
                to: { nodeId: pendingConnection.nodeId, side: 'left' }
              }])
            }
            
            setPendingConnection(null)
            
            // Update handle positions after adding new node
            requestAnimationFrame(() => {
              updateHandlePositions()
              // Center the newly added node in the viewport
              requestAnimationFrame(() => {
                centerNodeInViewport(newNodeId)
              })
            })
          }
          setNodeSelectorOpen(false)
        }}
        position={nodeSelectorPosition}
      />
    </div>
  )
}

