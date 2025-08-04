# DesignAI - LLM-Powered Figma Design Diagnosis

DesignAI is a web application that allows users to chat with an LLM to diagnose and iteratively improve their Figma designs.

## Features

- 🤖 **AI-Powered Analysis**: Chat with Claude Opus 4 to analyze your Figma designs
- 🎨 **Visual Annotations**: See highlighted issues directly on your Figma canvas
- 🔧 **Auto-Fix**: Accept AI suggestions to automatically fix design issues
- ♿ **Accessibility Checks**: Ensure your designs meet accessibility standards
- 📐 **Layout Analysis**: Check for consistency in spacing, alignment, and component usage
- 📦 **Version Control**: Snapshot and rollback design changes

## Tech Stack

### Frontend
- Next.js 14 with TypeScript
- Chakra UI for components
- Socket.io for real-time updates
- SWR for data fetching

### Backend
- Node.js + Express with TypeScript
- Figma API integration
- Claude Opus 4 integration
- Socket.io for WebSocket connections

### Infrastructure
- Frontend deployed on Vercel
- Backend deployed on Render
- GitHub Actions for CI/CD

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Figma account with API access
- Claude API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/designer_AI_intern.git
cd designer_AI_intern
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:

Create `.env` files in both `client` and `server` directories:

**client/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIGMA_CLIENT_ID=your-figma-client-id
```

**server/.env**
```
PORT=3001
FIGMA_CLIENT_ID=your-figma-client-id
FIGMA_CLIENT_SECRET=your-figma-client-secret
CLAUDE_API_KEY=your-claude-api-key
DATABASE_URL=your-database-url
```

4. Run the development servers:
```bash
npm run dev
```

This will start both the Next.js frontend (http://localhost:3000) and the Express backend (http://localhost:3001).

## Project Structure

```
designer_AI_intern/
├── client/          # Next.js frontend
├── server/          # Express backend
├── shared/          # Shared types and utilities
├── .github/         # GitHub Actions workflows
└── package.json     # Root workspace configuration
```

## Development Roadmap

- [x] Initial project setup
- [ ] Authentication with Figma OAuth
- [ ] Basic chat interface
- [ ] Figma file/frame fetching
- [ ] LLM integration for design analysis
- [ ] Canvas overlay annotations
- [ ] Auto-fix implementation
- [ ] Version control system
- [ ] Testing & monitoring

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Submit a PR with tests
4. Wait for code review

## License

MIT
