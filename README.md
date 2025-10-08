# AI Text & Image Processing Platform

A production-ready microservices application for AI-powered text summarization and image description using Claude AI.

## 🏗️ Architecture

This is a **monorepo** containing multiple microservices:

```
.
├── apps/
│   └── web/              # SvelteKit frontend (Port 3000)
├── services/
│   ├── text-summarizer/  # Text summarization API (Port 3001)
│   └── image-describer/  # Image description API (Port 3002)
└── packages/
    └── types/            # Shared TypeScript types
```

### Technology Stack

- **Frontend**: SvelteKit 2.x + Svelte 5 + TailwindCSS v4
- **Backend Services**: Node.js + Express + TypeScript
- **AI Model**: Anthropic Claude 3.5 Sonnet (Text & Vision)
- **Package Manager**: pnpm (workspaces)
- **Development**: tsx (TypeScript execution)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9.14+
- Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd textSummarizer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   DEMO_MODE=false
   ```

4. **Start all services**
   ```bash
   # Start all services in parallel
   pnpm dev

   # Or start individual services
   pnpm dev:web           # Frontend only
   pnpm dev:text-api      # Text summarizer only
   pnpm dev:image-api     # Image describer only
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Text API: http://localhost:3001
   - Image API: http://localhost:3002

## 📋 Available Scripts

### Root Level
- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all services for production
- `pnpm install:all` - Install dependencies for all workspaces

### Individual Services
- `pnpm dev:web` - Start frontend only
- `pnpm dev:text-api` - Start text summarizer API only
- `pnpm dev:image-api` - Start image describer API only
- `pnpm build:web` - Build frontend for production
- `pnpm build:text-api` - Build text API for production
- `pnpm build:image-api` - Build image API for production

## 🔌 API Endpoints

### Text Summarizer Service (Port 3001)

#### `GET /health`
Health check endpoint
```json
{
  "status": "ok",
  "service": "text-summarizer"
}
```

#### `POST /summarize`
Summarize text content
```json
// Request
{
  "text": "Your text here...",
  "maxWords": 50
}

// Response
{
  "summary": "Summarized text...",
  "demoMode": false
}
```

### Image Describer Service (Port 3002)

#### `GET /health`
Health check endpoint
```json
{
  "status": "ok",
  "service": "image-describer"
}
```

#### `POST /describe`
Describe image content
```json
// Request
{
  "imageData": "base64_encoded_image",
  "imageType": "image/jpeg",
  "descriptionLength": 30
}

// Response
{
  "description": "Image description...",
  "demoMode": false
}
```

## 🌟 Features

### Text Summarizer
- AI-powered text summarization
- Adjustable summary length (1-100 words)
- Real-time word/character count
- Copy to clipboard
- Demo mode for testing without API credits

### Image Describer
- AI-powered image description
- Drag & drop image upload
- Support for JPG, PNG, GIF, WebP
- Adjustable description length (1-100 words)
- Copy to clipboard
- Demo mode for testing

### User Management
- Profile management
- Account settings
- Password management
- User preferences
- Usage tracking & billing estimates

## 🔒 Demo Mode

Set `DEMO_MODE=true` in `.env` to test the application without using Anthropic API credits. The services will return mock responses.

## 📊 Project Structure

```
textSummarizer/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/    # Reusable components
│       │   │   └── stores/        # Svelte stores
│       │   └── routes/            # SvelteKit routes
│       ├── static/                # Static assets
│       └── package.json
├── services/
│   ├── text-summarizer/
│   │   ├── src/
│   │   │   └── index.ts          # Express server
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── image-describer/
│       ├── src/
│       │   └── index.ts          # Express server
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── types/
│       └── src/
│           └── index.ts          # Shared TypeScript types
├── .env                          # Environment variables
├── pnpm-workspace.yaml          # pnpm workspace config
└── package.json                 # Root package.json
```

## 🛠️ Development

### Adding a New Service

1. Create a new directory in `services/`
2. Add `package.json` with name `@text-summarizer/service-name`
3. The workspace will automatically pick it up
4. Add dev script to root `package.json`

### Working with Shared Types

Import from `@text-summarizer/types`:
```typescript
import type { Activity, SummarizeRequest } from '@text-summarizer/types';
```

## 📝 Documentation

- [CODEBASE_GUIDE.md](./CODEBASE_GUIDE.md) - Detailed codebase documentation
- [DEMO_MODE_GUIDE.md](./DEMO_MODE_GUIDE.md) - Demo mode setup guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [projectplanMicro.md](./projectplanMicro.md) - Microservices migration plan

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Required |
| `DEMO_MODE` | Enable demo mode (true/false) | `false` |
| `TEXT_API_PORT` | Text summarizer API port | `3001` |
| `IMAGE_API_PORT` | Image describer API port | `3002` |
| `WEB_PORT` | Frontend port | `3000` |

## 🧪 Testing

```bash
# Test text summarizer API
curl -X POST http://localhost:3001/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here", "maxWords": 50}'

# Test image describer API
curl -X POST http://localhost:3002/describe \
  -H "Content-Type: application/json" \
  -d '{"imageData": "base64_data", "imageType": "image/jpeg", "descriptionLength": 30}'

# Health checks
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## 📦 Production Build

```bash
# Build all services
pnpm build

# Build individual services
pnpm build:web
pnpm build:text-api
pnpm build:image-api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Anthropic Claude](https://www.anthropic.com/)
- UI components inspired by modern design systems
- Image upload functionality adapted from Scrimba's Claude Vision Template

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check existing documentation
- Review API documentation

---

**Built with ❤️ using Claude AI**
