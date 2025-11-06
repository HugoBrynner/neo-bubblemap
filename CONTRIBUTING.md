# Contributing to Neo Bubblemap

Thank you for your interest in contributing to Neo Bubblemap! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/neo-bubblemap.git`
3. Install dependencies: `npm install`
4. Copy environment files: `cp .env.example .env && cp backend/.env.example backend/.env`
5. Start development servers: `npm run dev`

## Project Structure

- `backend/` - Node.js/TypeScript API server
  - `src/controllers/` - API endpoint handlers
  - `src/services/` - Business logic and blockchain integration
  - `src/types/` - TypeScript type definitions
  - `src/utils/` - Configuration and utility functions

- `frontend/` - React/TypeScript web application
  - `src/components/` - React components
  - `src/services/` - API client
  - `src/types/` - TypeScript type definitions

## Development Workflow

### Making Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Build the project: `npm run build`
4. Lint your code: `npm run lint`
5. Test your changes thoroughly
6. Commit with clear messages: `git commit -m "Add feature: description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### Testing

- Test your changes manually
- Ensure the application builds without errors
- Verify API endpoints work correctly
- Test UI interactions in the browser

## Areas for Contribution

### High Priority
- Add unit tests for backend services
- Add integration tests for API endpoints
- Implement WebSocket support for real-time updates
- Add support for more NEP-17 tokens
- Improve clustering algorithms

### Medium Priority
- Add transaction flow visualization
- Implement historical data analysis
- Add address watchlist feature
- Improve error handling and user feedback
- Add loading states and skeleton screens

### Low Priority
- Add dark mode
- Implement export functionality (CSV, JSON)
- Add more filtering options
- Improve mobile responsiveness
- Add accessibility features

## Security

- Never commit API keys or secrets
- Validate all user inputs
- Follow secure coding practices
- Report security issues privately to the maintainers

## Questions?

Feel free to open an issue for questions or discussions about the project.
