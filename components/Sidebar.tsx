'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Pin,
  X,
  GripVertical,
} from 'lucide-react'
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

// Helper function to generate ID from name
const generateId = (name: string, prefix?: string): string => {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return prefix ? `${prefix}-${base}` : base
}

// Helper to extract name and keywords from node data
const extractNodeInfo = (item: NodeDataValue): { name: string; keywords?: string[] } => {
  if (typeof item === 'string') {
    return { name: item }
  }
  return { name: item.name, keywords: item.keywords }
}

// Transform JSON data into NodeItem array (same as NodeSelector)
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
      // Skip if a node with the same name and category already exists
      const exists = items.some(item => item.name === name && item.category === 'Popular')
      if (!exists) {
        items.push({
          id: generateId(name, 'popular'),
          name,
          category: 'Popular',
          keywords
        })
      }
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

  // Flow category
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

  // Tools category - map from Knowledge Base
  if (data['Knowledge Base']) {
    if (Array.isArray(data['Knowledge Base'])) {
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

export default function Sidebar() {
  const [searchValue, setSearchValue] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>('Popular')

  // Transform and memoize node data
  const nodeData = useMemo(() => transformNodeData(), [])

  // Filter and group nodes using the same search utilities as NodeSelector
  const filteredNodes = useMemo(() => 
    filterNodes(nodeData, searchValue, selectedCategory),
    [nodeData, searchValue, selectedCategory]
  )

  const groupedNodes = useMemo(() => 
    groupNodes(filteredNodes, searchValue.trim() !== '', searchValue),
    [filteredNodes, searchValue]
  )

  const togglePin = () => {
    setIsPinned((prev) => !prev)
  }

  const sidebarExpanded = isPinned || searchValue.trim().length > 0

  return (
    <nav className={`group relative h-full transition-all duration-200 ease-in-out ${sidebarExpanded ? 'w-[275px]' : 'w-12 hover:w-[275px]'}`}>
      <div className={`no-scrollbar absolute bottom-0 left-0 top-0 z-50 flex flex-col justify-between overflow-y-auto border-r border-gray-200 bg-white transition-all duration-200 ease-in-out ${sidebarExpanded ? 'w-[275px]' : 'w-12 group-hover:w-[275px]'}`}>
        {/* Top Section */}
        <div className="flex w-full flex-col flex-1 min-h-0">
          {/* Search Bar */}
          <div className="sticky top-0 z-10 flex flex-col bg-white">
            <div className="flex pt-2 pb-1 items-center gap-2 flex-shrink-0">
              {/* Search icon - always visible */}
              <button className="flex items-center justify-center flex-shrink-0 pl-3 py-2">
                <Search className="text-gray-600 size-5" />
              </button>
              {/* Search input - only visible on hover or when pinned or when searching */}
              <div className="relative flex-1 min-w-0">
                <input
                  className={`w-full h-8 rounded-md border-0 bg-gray-100 pl-2 ${searchValue.trim() ? 'pr-8' : 'pr-2'} text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-opacity duration-200 ${sidebarExpanded || searchValue.trim() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  placeholder="Search nodes..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue.trim() && (
                  <button
                    onClick={() => setSearchValue('')}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${sidebarExpanded || searchValue.trim() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              {/* Pin icon - always visible */}
              <button 
                onClick={togglePin}
                className={`flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 transition-colors flex-shrink-0 ${isPinned ? 'text-gray-700' : 'text-gray-400'}`}
                title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
              >
                <Pin className={`size-4 ${isPinned ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Search Results Dropdown */}
            {searchValue.trim() && (
              <div className="flex-1 overflow-y-auto bg-white p-1 min-h-0">
                {Object.entries(groupedNodes).map(([section, nodes]) => {
                  let sectionHeader: string | null = null
                  if (section !== '') {
                    sectionHeader = section
                  }
                  
                  return (
                    <div key={section}>
                      {sectionHeader && (
                        <div className="px-2 py-2 text-xs font-normal text-gray-500 uppercase tracking-wide sticky top-0 bg-white">
                          {sectionHeader}
                        </div>
                      )}
                      {nodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => {
                            // TODO: Handle node selection - could open NodeSelector or trigger canvas action
                            setSearchValue('')
                          }}
                          className="group/node w-full flex items-center justify-between px-2 py-2 hover:bg-gray-100 transition-colors text-left text-sm text-gray-700 rounded-md"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="w-5 h-5 bg-gray-200 rounded-sm mr-3 flex-shrink-0" />
                            <span className="font-medium">{node.name}</span>
                          </div>
                          <GripVertical className={`text-gray-400 opacity-0 group-hover/node:opacity-100 transition-opacity flex-shrink-0 ${sidebarExpanded ? 'size-4 ml-2' : 'w-0 h-4 group-hover/node:w-4'}`} />
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
            )}
          </div>

          {/* Category Tabs - hidden when searching */}
          {!searchValue.trim() && (
            <>
              {/* Collapsed: Show icon (hidden when expanded) */}
              <div className={`flex items-center justify-center border-b border-gray-200 flex-shrink-0 mb-0 pb-3 py-1 mt-2 ${sidebarExpanded ? 'hidden' : 'group-hover:hidden'}`}>
                <div className="size-5 bg-gray-200 rounded flex-shrink-0" />
              </div>
              {/* Expanded: Show tabs (hidden when collapsed) */}
              <div className={`flex border-b border-gray-200 px-3 gap-1 flex-shrink-0 mb-0 pb-3 mt-2 ${sidebarExpanded ? '' : 'hidden group-hover:flex'}`}>
                {(['Popular', 'Tools', 'Apps', 'Flow'] as Category[]).map((category) => (
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
            </>
          )}

          {/* Popular Nodes - shown by default when not searching */}
          {!searchValue.trim() && (
            <div className="flex flex-col p-1">
              {Object.entries(groupedNodes).map(([section, nodes]) => {
                let sectionHeader: string | null = null
                if (section !== 'default') {
                  sectionHeader = section
                }
                
                return (
                  <div key={section}>
                    {sectionHeader && (
                      <div className={`px-2 py-2 text-xs font-normal text-gray-500 uppercase tracking-wide sticky top-0 bg-white ${sidebarExpanded ? '' : 'hidden group-hover:block'}`}>
                        {sectionHeader}
                      </div>
                    )}
                    {nodes.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => {
                          // TODO: Handle node selection
                        }}
                        className="group/node flex items-center justify-between w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-md"
                        title={node.name}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className={`flex items-center justify-center flex-shrink-0 ${sidebarExpanded ? 'mr-3' : 'group-hover:mr-3'}`}>
                            <div className="w-5 h-5 bg-gray-200 rounded-sm" />
                          </div>
                          <span className={`whitespace-nowrap font-medium transition-opacity ${sidebarExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{node.name}</span>
                        </div>
                        <GripVertical className={`text-gray-400 opacity-0 group-hover/node:opacity-100 transition-opacity flex-shrink-0 ${sidebarExpanded ? 'size-4 ml-2' : 'w-0 h-4 group-hover/node:w-4'}`} />
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
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-1 px-2 pb-4 border-t border-gray-200 pt-2">
          <button className={`group/item flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors ${sidebarExpanded ? 'justify-start' : 'justify-center group-hover:justify-start'}`}>
            <div className={`size-5 bg-gray-300 rounded flex-shrink-0 ${sidebarExpanded ? 'mr-3' : 'group-hover:mr-3'}`} />
            <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto'}`}>
              Help & More
            </span>
          </button>
          <button className={`group/item flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors ${sidebarExpanded ? 'justify-start' : 'justify-center group-hover:justify-start'}`}>
            <div className={`relative size-5 bg-gray-300 rounded flex-shrink-0 ${sidebarExpanded ? 'mr-3' : 'group-hover:mr-3'}`} />
            <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto'}`}>
              System Status
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

