'use client'

import {
  Wand2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Clock,
  Maximize2,
  Grid3x3,
  FilePlus,
  Camera,
} from 'lucide-react'

export default function BottomBar() {
  return (
    <div className="border-t border-gray-200 bg-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Auto-saved draft 1 second ago</span>
          </div>
          <a
            href="https://www.stack-ai.com/dashboard/me"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            https://www.stack-ai.com/dashboard/me
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md transition text-sm">
          <Wand2 className="size-4" />
          <span>Ask</span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition">
          <Undo2 className="size-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition">
          <Redo2 className="size-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button className="p-2 hover:bg-gray-100 rounded-md transition">
          <ZoomIn className="size-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition">
          <ZoomOut className="size-4" />
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md transition text-sm">
          <Clock className="size-4" />
          <span>Versions</span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition">
          <Maximize2 className="size-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition">
          <Grid3x3 className="size-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition">
          <FilePlus className="size-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition">
          <Camera className="size-4" />
        </button>
      </div>
    </div>
  )
}

