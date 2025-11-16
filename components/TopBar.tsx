'use client'

import Link from 'next/link'
import { BarChart3, Settings } from 'lucide-react'

export default function TopBar() {
  return (
    <nav className="border-b border-black/[0.1] flex relative z-50 bg-white">
      <div className="flex items-center justify-center size-12">
        <button
          type="button"
          className="flex w-5 cursor-pointer items-center"
        >
          <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
        </button>
      </div>
      <div className="flex md:grid grid-cols-3 w-full sm:items-center sm:justify-between pr-2 py-1 sm:pl-0 sm:px-4 sm:p-2">
        <div className="flex w-full justify-between sm:w-auto sm:justify-start sm:gap-4">
          <div className="flex h-auto flex-col justify-center gap-3 py-1 text-ms sm:h-8 sm:flex-row sm:items-center sm:px-2">
            <div className="flex items-center gap-2 text-ms">
              <a
                className="hidden items-center justify-center gap-3 focus:outline-2 focus:outline-black lg:flex"
                href="/dashboard"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="stroke-black text-black brightness-0"
                >
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
                <div className="hidden line-clamp-1 xl:inline 2xl:max-w-[32ch] truncate">
                  All
                </div>
              </a>
              <div className="hidden text-lg font-thin text-[#8B8D98] lg:block">
                /
              </div>
              <span className="whitespace-nowrap hidden max-w-[250px] cursor-pointer truncate focus:outline-2 focus:outline-black sm:block">
                Personal Folder / test (17)
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 bg-[#E8E8EC] rounded-md px-1 min-h-8 w-fit justify-self-center">
          <div className="relative flex flex-1 items-center py-1 text-ms font-normal">
            <Link
              title="Workflow"
              className="flex flex-1 items-center h-full min-w-8 gap-1 px-2 bg-white rounded-[5px] transition text-foreground"
              href="/workflow"
            >
              <span className="hidden xl:inline flex-1 z-1 whitespace-nowrap">
                Workflow
              </span>
            </Link>
          </div>
          <div className="relative flex flex-1 items-center py-1 text-ms font-normal">
            <Link
              title="Export"
              className="flex flex-1 items-center h-full min-w-8 gap-1 px-2 hover:bg-black/5 rounded-[5px] transition text-muted-foreground"
              href="/export"
            >
              <span className="hidden xl:inline flex-1 z-1 whitespace-nowrap">
                Export
              </span>
            </Link>
          </div>
          <div className="relative flex flex-1 items-center py-1 text-ms font-normal">
            <Link
              title="Analytics"
              className="flex flex-1 items-center h-full min-w-8 gap-1 px-2 hover:bg-black/5 rounded-[5px] transition text-muted-foreground"
              href="/analytics"
            >
              <BarChart3 className="xl:hidden size-3.5 flex-1 z-1" />
              <span className="hidden xl:inline flex-1 z-1 whitespace-nowrap">
                Analytics
              </span>
            </Link>
          </div>
          <div className="relative flex flex-1 items-center py-1 text-ms font-normal">
            <Link
              title="Manager"
              className="flex flex-1 items-center h-full min-w-8 gap-1 px-2 hover:bg-black/5 rounded-[5px] transition text-muted-foreground"
              href="/manager"
            >
              <Settings className="xl:hidden size-3.5 flex-1 z-1" />
              <span className="hidden xl:inline flex-1 z-1 whitespace-nowrap">
                Manager
              </span>
            </Link>
          </div>
          <div className="relative flex flex-1 items-center py-1 text-ms font-normal">
            <Link
              title="Evaluator"
              className="flex flex-1 items-center h-full min-w-8 gap-1 px-2 hover:bg-black/5 rounded-[5px] transition text-muted-foreground"
              href="/evaluator"
            >
              <span className="hidden xl:inline flex-1 z-1 whitespace-nowrap">
                Evaluator
              </span>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-self-end">
          <div className="flex h-auto flex-col justify-end gap-2 sm:h-8 sm:flex-row sm:items-center">
            <button className="focus:outline-2 focus:outline-black">
              <span className="relative flex shrink-0 overflow-hidden border border-gray-300 rounded-full size-[28px] max-sm:hidden">
                <span className="flex h-full w-full items-center justify-center rounded-sm border-0 border-gray-300 bg-muted">
                  Y
                </span>
              </span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md transition">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md transition">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
            <button className="px-4 py-2 bg-transparent border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition text-sm font-medium">
              Run
            </button>
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm font-medium">
              Publish
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

