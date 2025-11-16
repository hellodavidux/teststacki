# Quick Start Guide

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Overview

This is a Next.js 14 application with TypeScript and Tailwind CSS that recreates a workflow builder interface.

### Key Components

- **TopBar** (`components/TopBar.tsx`) - Navigation and action buttons
- **Sidebar** (`components/Sidebar.tsx`) - Search and node list
- **Canvas** (`components/Canvas.tsx`) - Main workspace with grid background
- **InputNode** (`components/InputNode.tsx`) - Example node component
- **BottomBar** (`components/BottomBar.tsx`) - Status and utility controls

### Customization Tips

1. **Add new nodes:** Create components in `components/` and add them to `Canvas.tsx`
2. **Modify colors:** Edit `tailwind.config.ts` and `app/globals.css`
3. **Add functionality:** All components are client-side (`'use client'`) so you can add interactivity

### Next Steps

- Implement drag-and-drop for nodes
- Add node connection/edge functionality
- Create more node types
- Add state management (consider Zustand or Redux)
- Implement save/load functionality

