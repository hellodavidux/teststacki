'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import nodesData from '../nodes.json'
import { filterNodes, groupNodes, type NodeItem } from '../utils/nodeSearch'

type Category = 'Popular' | 'Tools' | 'Apps' | 'Flow'

interface NodeDataItem {
  name: string
  keywords?: string[]
}

type NodeDataValue = string | NodeDataItem

interface NodesData {
  Inputs?: NodeDataValue[]
  Triggers?: NodeDataValue[]
  Outputs?: NodeDataValue[]
  'Core Nodes'?: NodeDataValue[]
  Popular?: NodeDataValue[]
  Apps?: NodeDataValue[]
  Flow?: NodeDataValue[]
  StackAI?: {
    [key: string]: NodeDataValue[]
  }
  'Knowledge Base'?: NodeDataValue[] | {
    [key: string]: NodeDataValue[]
  }
  [key: string]: any
}

interface NodeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectNode: (nodeId: string, nodeName: string) => void
  position?: { x: number; y: number }
}

// Helper function to generate ID from name
const generateId = (name: string, prefix?: string): string => {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return prefix ? `${prefix}-${base}` : base
}

// Helper to extract name and keywords from node data (supports both string and object formats)
const extractNodeInfo = (item: NodeDataValue): { name: string; keywords?: string[] } => {
  if (typeof item === 'string') {
    return { name: item }
  }
  return { name: item.name, keywords: item.keywords }
}

  // Transform JSON data into NodeItem array
const transformNodeData = (): NodeItem[] => {
  const items: NodeItem[] = []
  const data = nodesData as NodesData

  // Inputs category
  if (Array.isArray(data.Inputs)) {
    data.Inputs.forEach((item: NodeDataValue) => {
      const { name, keywords } = extractNodeInfo(item)
      items.push({
        id: generateId(name, 'input'),
        name,
        category: 'Flow',
        jsonCategory: 'Inputs',
        keywords
      })
    })
  }

  // Triggers category
  if (Array.isArray(data.Triggers)) {
    data.Triggers.forEach((item: NodeDataValue) => {
      const { name, keywords } = extractNodeInfo(item)
      items.push({
        id: generateId(name, 'trigger'),
        name,
        category: 'Flow',
        jsonCategory: 'Triggers',
        keywords
      })
    })
  }

  // Outputs category
  if (Array.isArray(data.Outputs)) {
    data.Outputs.forEach((item: NodeDataValue) => {
      const { name, keywords } = extractNodeInfo(item)
      items.push({
        id: generateId(name, 'output'),
        name,
        category: 'Flow',
        jsonCategory: 'Outputs',
        keywords
      })
    })
  }

  // Core Nodes category
  if (Array.isArray(data['Core Nodes'])) {
    data['Core Nodes'].forEach((item: NodeDataValue) => {
      const { name, keywords } = extractNodeInfo(item)
      items.push({
        id: generateId(name, 'core'),
        name,
        category: 'Popular',
        jsonCategory: 'Core Nodes',
        keywords
      })
    })
  }

  // Popular category
  if (Array.isArray(data.Popular)) {
    data.Popular.forEach((item: NodeDataValue) => {
      const { name, keywords } = extractNodeInfo(item)
      items.push({
        id: generateId(name, 'popular'),
        name,
        category: 'Popular',
        keywords
      })
    })
  }

  // Apps category
  if (Array.isArray(data.Apps)) {
    data.Apps.forEach((item: NodeDataValue) => {
      const { name, keywords } = extractNodeInfo(item)
      items.push({
        id: generateId(name, 'app'),
        name,
        category: 'Apps',
        jsonCategory: 'Apps',
        keywords
      })
    })
  }

  // Flow category (formerly Logic)
  if (Array.isArray(data.Flow)) {
    data.Flow.forEach((item: NodeDataValue) => {
      const { name, keywords } = extractNodeInfo(item)
      items.push({
        id: generateId(name, 'flow'),
        name,
        category: 'Flow',
        jsonCategory: 'Flow',
        keywords
      })
    })
  }

  // Tools category - map from StackAI subcategories
  if (data.StackAI && typeof data.StackAI === 'object') {
    Object.entries(data.StackAI).forEach(([section, actions]) => {
      if (Array.isArray(actions)) {
        actions.forEach((item: NodeDataValue) => {
          const { name, keywords } = extractNodeInfo(item)
          // Exclude Send Email action from StackAI Email Tools
          if (section === 'Email Tools' && name === 'Send Email') {
            return
          }
          items.push({
            id: generateId(name, 'stackai'),
            name,
            category: 'Tools',
            jsonCategory: 'StackAI',
            section,
            keywords
          })
        })
      }
    })
  }

  // Tools category - map from Knowledge Base (can be array or object with subcategories)
  if (data['Knowledge Base']) {
    if (Array.isArray(data['Knowledge Base'])) {
      // Flat array structure
      data['Knowledge Base'].forEach((item: NodeDataValue) => {
        const { name, keywords } = extractNodeInfo(item)
        items.push({
          id: generateId(name, 'knowledge-base'),
          name,
          category: 'Tools',
          jsonCategory: 'Knowledge Base',
          section: 'Knowledge Base',
          keywords
        })
      })
    } else if (typeof data['Knowledge Base'] === 'object') {
      // Object with subcategories (backward compatibility)
      Object.entries(data['Knowledge Base']).forEach(([section, sources]) => {
        if (Array.isArray(sources)) {
          sources.forEach((item: NodeDataValue) => {
            const { name, keywords } = extractNodeInfo(item)
            items.push({
              id: generateId(name, 'knowledge-base'),
              name,
              category: 'Tools',
              jsonCategory: 'Knowledge Base',
              section,
              keywords
            })
          })
        }
      })
    }
  }

  return items
}

export default function NodeSelector({ isOpen, onClose, onSelectNode, position }: NodeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>('Popular')

  // Clear search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setSelectedCategory('Popular')
    }
  }, [isOpen])

  // Transform and memoize node data
  const nodeData = useMemo(() => transformNodeData(), [])

  // Filter and group nodes using the extracted search utilities
  const filteredNodes = useMemo(() => 
    filterNodes(nodeData, searchQuery, selectedCategory),
    [nodeData, searchQuery, selectedCategory]
  )

  const groupedNodes = useMemo(() => 
    groupNodes(filteredNodes, searchQuery.trim() !== '', searchQuery),
    [filteredNodes, searchQuery]
  )

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const categories: Category[] = ['Popular', 'Tools', 'Apps', 'Flow']

  return (
    <>
      {/* Backdrop - click to close */}
      <div 
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="fixed bg-white rounded-lg shadow-xl w-[320px] h-[480px] flex flex-col z-50"
        style={position ? { left: `${position.x}px`, top: `${position.y}px` } : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => {
          // Stop propagation to prevent canvas zoom
          e.stopPropagation()
        }}
        onMouseDown={(e) => {
          // Stop propagation to prevent canvas panning
          e.stopPropagation()
        }}
      >
        {/* Search Bar */}
        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 ${searchQuery.trim() ? 'pr-10' : 'pr-4'} py-2 bg-gray-100 rounded-md border-0 focus:outline-none text-sm`}
              autoFocus
            />
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs - hidden when searching */}
        {!searchQuery.trim() && (
        <div className="flex border-b border-gray-200 px-4 gap-1 flex-shrink-0 mb-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs font-normal transition-colors rounded-t-md ${
                selectedCategory === category
                  ? 'text-gray-900 bg-gray-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        )}

        {/* Node List - Scrollable */}
        <div 
          className="flex-1 overflow-y-auto min-h-0" 
          style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: '#d1d5db transparent',
            WebkitOverflowScrolling: 'touch'
          }}
          onWheel={(e) => {
            // Stop propagation to prevent canvas zoom/pan
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            // Stop propagation to prevent canvas panning
            e.stopPropagation()
          }}
        >
          {Object.entries(groupedNodes).map(([section, nodes]) => {
            // Parse section header - show JSON categories when searching
            let sectionHeader: string | null = null
            if (searchQuery.trim() !== '') {
              // When searching, show the JSON parent category (section name from grouping)
              // This will be "StackAI" subsections, "Knowledge Base", "Apps", "Flow", etc.
              sectionHeader = section
            } else if (section !== 'default') {
              // When not searching, show section only
              sectionHeader = section
            }
            
            return (
            <div key={section}>
              {sectionHeader && (
                <div className="px-4 py-2 text-xs font-normal text-gray-500 uppercase tracking-wide">
                  {sectionHeader}
                </div>
              )}
              {nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node.id, node.name)
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                >
                  {/* Icon placeholder */}
                  {node.icon || (
                    <div className="w-5 h-5 bg-gray-200 rounded-sm" />
                  )}
                  <span className="text-sm text-gray-900 font-medium">{node.name}</span>
                </button>
              ))}
            </div>
            )
          })}
          {filteredNodes.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No nodes found
            </div>
          )}
        </div>
      </div>
    </>
  )
}

