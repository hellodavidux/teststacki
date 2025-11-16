'use client'

import { X } from 'lucide-react'
import nodesData from '../nodes.json'

interface ConfigurationPanelProps {
  nodeName: string
  nodeId: string
  onClose: () => void
}

interface NodeDataItem {
  name: string
  subactions?: Array<{ name: string }>
}

type NodeDataValue = string | NodeDataItem

interface NodesData {
  Inputs?: NodeDataValue[]
  Apps?: NodeDataValue[]
  'Knowledge Base'?: NodeDataValue[]
  [key: string]: any
}

interface SubactionItem {
  name: string
  type?: 'action' | 'trigger' | 'knowledge-base'
  description?: string
  section?: string
}

export default function ConfigurationPanel({ nodeName, nodeId, onClose }: ConfigurationPanelProps) {
  // Find the node data to get subactions
  const data = nodesData as NodesData
  let subactions: SubactionItem[] = []

  // Search for the node in Apps category to get email tools (Search Emails, Send Email)
  if (data.Apps && Array.isArray(data.Apps)) {
    const nodeData = data.Apps.find((item: NodeDataValue) => {
      if (typeof item === 'string') {
        return item === nodeName
      }
      return item.name === nodeName
    }) as NodeDataItem | undefined

    if (nodeData && nodeData.subactions) {
      subactions = nodeData.subactions.map(sub => ({ 
        ...sub, 
        type: 'action' as const,
        section: (sub as any).section,
        description: (sub as any).description
      }))
    }
  }

  // Get Gmail/Outlook from Trigger subactions (in Inputs category)
  if (data.Inputs && Array.isArray(data.Inputs)) {
    const triggerNode = data.Inputs.find((item: NodeDataValue) => {
      if (typeof item === 'string') {
        return item === 'Trigger'
      }
      return item.name === 'Trigger'
    }) as NodeDataItem | undefined

    if (triggerNode && triggerNode.subactions) {
      const emailTrigger = triggerNode.subactions.find(sub => sub.name === nodeName)
      if (emailTrigger) {
        subactions.push({ ...emailTrigger, type: 'trigger' as const })
      }
    }
  }

  // Get Gmail/Outlook from Knowledge Base category
  if (data['Knowledge Base'] && Array.isArray(data['Knowledge Base'])) {
    const emailKB = data['Knowledge Base'].find((item: NodeDataValue) => {
      if (typeof item === 'string') {
        return item === nodeName || item.startsWith(nodeName)
      }
      return item.name === nodeName || item.name.startsWith(nodeName)
    })

    if (emailKB) {
      const name = typeof emailKB === 'string' ? emailKB : emailKB.name
      subactions.push({ name, type: 'knowledge-base' as const })
    }
  }

  // Only populate subactions for specific nodes: Gmail, Outlook, Google Drive, Google Sheets, SharePoint, Excel
  const nodesWithSubactions = ['Gmail', 'Outlook', 'Google Drive', 'Google Sheets', 'SharePoint', 'Excel']
  const shouldShowSubactions = nodesWithSubactions.includes(nodeName)
  
  // If this node shouldn't have subactions, clear them (but still show the panel)
  if (!shouldShowSubactions) {
    subactions = []
  }

  return (
    <>
      {/* Backdrop - click to close */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="fixed bg-white shadow-xl w-[320px] flex flex-col z-50 rounded-lg"
        style={{
          right: '16px',
          top: '80px',
          bottom: '16px',
          maxHeight: 'calc(100vh - 96px)'
        }}
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center flex-shrink-0 bg-gray-50">
              <div className="w-4 h-4 bg-gray-300 rounded" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">{nodeName}</h2>
              <p className="text-xs text-gray-500">Please select an action or trigger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Subactions List */}
        <div 
          className="flex-1 overflow-y-auto min-h-0 p-4" 
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
          {/* Group actions by section if they have sections, otherwise show in default Tools section */}
          {(() => {
            const actionSubactions = subactions.filter(sub => sub.type === 'action')
            const actionsWithSections = actionSubactions.filter(sub => sub.section)
            const actionsWithoutSections = actionSubactions.filter(sub => !sub.section)
            const sections = Array.from(new Set(actionsWithSections.map(sub => sub.section).filter(Boolean)))
            
            return (
              <>
                {/* Actions with sections */}
                {sections.map(section => (
                  <div key={section} className="mb-4">
                    <div className="text-xs font-normal text-gray-500 uppercase tracking-wide mb-2">
                      {section}
                    </div>
                    {actionsWithSections
                      .filter(sub => sub.section === section)
                      .map((subaction, index) => (
                        <button
                          key={`${section}-${index}`}
                          onClick={() => {
                            // TODO: Handle subaction selection
                            console.log('Selected subaction:', subaction.name)
                          }}
                          className="w-full flex items-start gap-3 px-3 py-3 hover:bg-gray-50 transition-colors text-left group rounded-md mb-1"
                        >
                          {/* Icon placeholder with wrench overlay */}
                          <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-600 rounded-sm flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-900 font-medium">{subaction.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {subaction.name === 'Search Emails' 
                                ? `Search emails using the ${nodeName} API`
                                : subaction.name === 'Send Email'
                                ? `Send an email using the ${nodeName} API`
                                : subaction.description || `Configure ${subaction.name} for ${nodeName}`}
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                ))}
                
                {/* Actions without sections (default Tools section) */}
                {actionsWithoutSections.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-normal text-gray-500 uppercase tracking-wide mb-2">
                      {nodeName === 'Gmail' || nodeName === 'Outlook' ? 'Email Tools' : 'Tools'}
                    </div>
                    {actionsWithoutSections.map((subaction, index) => (
                      <button
                        key={`action-${index}`}
                        onClick={() => {
                          // TODO: Handle subaction selection
                          console.log('Selected subaction:', subaction.name)
                        }}
                        className="w-full flex items-start gap-3 px-3 py-3 hover:bg-gray-50 transition-colors text-left group rounded-md mb-1"
                      >
                        {/* Icon placeholder with wrench overlay */}
                        <div className="relative flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-600 rounded-sm flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 font-medium">{subaction.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {subaction.name === 'Search Emails' 
                              ? `Search emails using the ${nodeName} API`
                              : subaction.name === 'Send Email'
                              ? `Send an email using the ${nodeName} API`
                              : subaction.description || `Configure ${subaction.name} for ${nodeName}`}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )
          })()}

          {/* Triggers Section */}
          {subactions.filter(sub => sub.type === 'trigger').length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-normal text-gray-500 uppercase tracking-wide mb-2">
                Triggers
              </div>
              {subactions
                .filter(sub => sub.type === 'trigger')
                .map((subaction, index) => (
                  <button
                    key={`trigger-${index}`}
                    onClick={() => {
                      // TODO: Handle subaction selection
                      console.log('Selected trigger:', subaction.name)
                    }}
                    className="w-full flex items-start gap-3 px-3 py-3 hover:bg-gray-50 transition-colors text-left group rounded-md mb-1"
                  >
                    {/* Icon placeholder with wrench overlay */}
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-600 rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 font-medium">{subaction.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Trigger {nodeName} events
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}

          {/* Knowledge Base Section */}
          {subactions.filter(sub => sub.type === 'knowledge-base').length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-normal text-gray-500 uppercase tracking-wide mb-2">
                Knowledge Base
              </div>
              {subactions
                .filter(sub => sub.type === 'knowledge-base')
                .map((subaction, index) => (
                  <button
                    key={`kb-${index}`}
                    onClick={() => {
                      // TODO: Handle subaction selection
                      console.log('Selected knowledge base:', subaction.name)
                    }}
                    className="w-full flex items-start gap-3 px-3 py-3 hover:bg-gray-50 transition-colors text-left group rounded-md mb-1"
                  >
                    {/* Icon placeholder with wrench overlay */}
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-600 rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 font-medium">{subaction.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Search {nodeName} emails and files
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}

          {/* Empty state for nodes without subactions */}
          {subactions.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No actions available
            </div>
          )}
        </div>
      </div>
    </>
  )
}

