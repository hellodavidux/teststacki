# Search Nodes - Workflow Builder

A modern workflow builder interface inspired by Stack AI, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Top Navigation Bar**: Logo, breadcrumbs, tab navigation (Workflow, Export, Analytics, Manager, Evaluator), and action buttons
- **Left Sidebar**: Search functionality for nodes with a collapsible sidebar
- **Canvas Area**: Grid-based canvas with draggable nodes (currently includes an Input node)
- **Bottom Bar**: Status indicators, zoom controls, and utility buttons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
search_nodes/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page
├── components/
│   ├── TopBar.tsx           # Top navigation bar
│   ├── Sidebar.tsx          # Left sidebar with search
│   ├── Canvas.tsx           # Main canvas area with grid
│   ├── InputNode.tsx        # Input node component
│   ├── BottomBar.tsx        # Bottom status bar
│   └── WorkflowPage.tsx     # Main page component
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Customization

### Adding New Nodes

1. Create a new component in `components/` (e.g., `OutputNode.tsx`)
2. Import and add it to the `Canvas.tsx` component
3. Style it similarly to `InputNode.tsx`

### Styling

The project uses Tailwind CSS. Modify `tailwind.config.ts` to customize colors, spacing, and other design tokens.

### Colors

Current color scheme:
- Background: `#f6f6f6`
- Primary text: Black
- Muted text: `#8b8d98`
- Borders: `#e5e5e5`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Future Enhancements

- Drag and drop functionality for nodes
- Node connections/edges
- More node types
- Save/load workflows
- Undo/redo functionality
- Zoom controls implementation

