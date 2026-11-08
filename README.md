# Pianow

A modern piano learning platform built with Next.js 15, React 19, and TypeScript.

## Features

- 🎹 Piano lessons and tutorials
- 👨‍🏫 Teacher directory and applications
- 🛒 Music instrument shop
- 📚 Lesson tracking and progress
- 🎥 Video lesson integration
- 🛍️ Shopping cart and checkout
- 👤 User authentication and profiles

## Tech Stack

- **Framework:** Next.js 15
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 22.12+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pianow.git
cd pianow
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run the unit and API tests
- `npm run test:e2e` - Run the browser smoke test (needs `npm run build` and `npx playwright install chromium` first)

## Project Structure

```
pianow/
├── app/              # Next.js app router pages
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and contexts
├── public/          # Static assets
└── styles/          # Global styles
```

## License

Private project
