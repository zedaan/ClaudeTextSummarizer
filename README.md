# 🚀 AI-Powered Content Processing Platform

> Transform your content workflow with cutting-edge AI technology. Instantly summarize text and describe images using Claude AI's advanced language models.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-orange)](https://kit.svelte.dev/)
[![Claude AI](https://img.shields.io/badge/Claude-3.5_Sonnet-purple)](https://www.anthropic.com/)

## ✨ Overview

A enterprise-grade microservices platform that harnesses the power of Anthropic's Claude AI to deliver lightning-fast text summarization and intelligent image description. Built with modern web technologies and a scalable architecture, this platform is designed for developers who demand performance, reliability, and elegant code.

### 🎯 Key Features

- **⚡ Intelligent Text Summarization** - Condense lengthy content into concise, accurate summaries
- **🖼️ Advanced Image Analysis** - Get detailed, context-aware descriptions of any image
- **🎨 Beautiful Modern UI** - Sleek, responsive interface built with TailwindCSS v4
- **🔧 Microservices Architecture** - Scalable, maintainable, production-ready design
- **🧪 Demo Mode** - Test the platform without API credits
- **📊 Usage Analytics** - Track API usage and estimated costs
- **👤 User Management** - Complete profile, preferences, and account settings
- **🌐 RESTful APIs** - Clean, well-documented endpoints for integration

---

## 🏗️ Architecture

Built on a modern **monorepo** structure with isolated, independently scalable microservices:

```
textSummarizer/
├── apps/
│   └── web/                    # Frontend Application
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/  # Reusable UI components
│       │   │   └── stores/      # State management
│       │   └── routes/          # SvelteKit pages & API routes
│       └── static/              # Public assets
│
├── services/
│   ├── text-summarizer/        # Text Processing Service
│   │   └── src/
│   │       └── index.ts         # Express server
│   │
│   └── image-describer/        # Image Analysis Service
│       └── src/
│           └── index.ts         # Express server
│
└── packages/
    └── types/                  # Shared TypeScript definitions
        └── src/
            └── index.ts
```

### 🛠️ Technology Stack

**Frontend**
- [SvelteKit 2.x](https://kit.svelte.dev/) - Lightning-fast framework with Svelte 5 runes
- [TailwindCSS v4](https://tailwindcss.com/) - Modern utility-first CSS
- TypeScript - Type-safe development

**Backend**
- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [TypeScript](https://www.typescriptlang.org/) - Static typing for reliability
- [tsx](https://github.com/esbuild-kit/tsx) - TypeScript execution engine

**AI & ML**
- [Anthropic Claude 3.5 Sonnet](https://www.anthropic.com/) - State-of-the-art language model
- Claude Vision API - Advanced image understanding

**DevOps & Tools**
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- Workspace monorepo - Centralized dependency management
- Hot module replacement - Instant development feedback

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** `18.x` or higher ([Download](https://nodejs.org/))
- **pnpm** `9.14+` ([Install](https://pnpm.io/installation))
- **Anthropic API Key** ([Get yours free](https://console.anthropic.com/))

### Installation

Get started in 3 simple steps:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
cp apps/web/.env.example apps/web/.env

# 4. Add your Anthropic API key to .env
# Open .env in a text editor and replace 'your_api_key_here' with your actual key:
# ANTHROPIC_API_KEY=your_api_key_here
#
# To test without an API key, set DEMO_MODE=true

# 5. Start all services
pnpm dev
```

That's it! Open your browser to:
- **Frontend**: http://localhost:3000
- **Text API**: http://localhost:3001
- **Image API**: http://localhost:3002

---

## 📖 Usage

### Text Summarization

Paste any text, select your desired summary length (1-100 words), and get instant AI-powered summaries.

```typescript
// API Example
POST http://localhost:3001/summarize
Content-Type: application/json

{
  "text": "Your long text here...",
  "maxWords": 50
}
```

### Image Description

Upload any image (JPG, PNG, GIF, WebP) and receive detailed AI-generated descriptions.

```typescript
// API Example
POST http://localhost:3002/describe
Content-Type: application/json

{
  "imageData": "base64_encoded_image_data",
  "imageType": "image/jpeg",
  "descriptionLength": 30
}
```

---

## 🎮 Demo Mode

Perfect for development and testing! Enable demo mode to use the platform without consuming API credits:

```env
# .env
DEMO_MODE=true
```

Demo mode provides realistic mock responses that simulate the actual AI behavior, allowing you to:
- ✅ Test the complete user flow
- ✅ Develop features without API costs
- ✅ Demo the platform to stakeholders
- ✅ Run automated tests

---

## 📊 API Documentation

### Text Summarizer Service (Port 3001)

#### Health Check
```bash
GET /health
Response: { "status": "ok", "service": "text-summarizer" }
```

#### Summarize Text
```bash
POST /summarize
Body: {
  "text": string,      # Text to summarize
  "maxWords": number   # Desired length (1-100)
}
Response: {
  "summary": string,   # AI-generated summary
  "demoMode": boolean  # Whether demo mode was used
}
```

### Image Describer Service (Port 3002)

#### Health Check
```bash
GET /health
Response: { "status": "ok", "service": "image-describer" }
```

#### Describe Image
```bash
POST /describe
Body: {
  "imageData": string,        # Base64 encoded image
  "imageType": string,        # MIME type (image/jpeg, etc.)
  "descriptionLength": number # Desired length (1-100 words)
}
Response: {
  "description": string,      # AI-generated description
  "demoMode": boolean         # Whether demo mode was used
}
```

---

## 🔧 Development

### Project Scripts

```bash
# Start all services in development mode
pnpm dev

# Start individual services
pnpm dev:web          # Frontend only (port 3000)
pnpm dev:text-api     # Text API only (port 3001)
pnpm dev:image-api    # Image API only (port 3002)

# Build for production
pnpm build            # Build all services
pnpm build:web        # Build frontend only
pnpm build:text-api   # Build text API only
pnpm build:image-api  # Build image API only
```

### Adding New Features

The monorepo architecture makes it easy to extend:

1. **New Microservice**: Create in `services/`
2. **Shared Components**: Add to `apps/web/src/lib/components/`
3. **Shared Types**: Define in `packages/types/`
4. **New Pages**: Create in `apps/web/src/routes/`

---

## 🌟 Features Showcase

### User Interface
- ✨ **Drag & Drop** - Intuitive image upload
- 🎨 **Modern Design** - Beautiful gradient effects and smooth animations
- 📱 **Responsive** - Perfect on any device
- ♿ **Accessible** - WCAG compliant components
- 🌙 **Theme Support** - Light/dark mode ready

### User Management
- 👤 **Profile Management** - Edit name, email, bio
- ⚙️ **Account Settings** - Notifications, language, timezone
- 🔐 **Password Security** - Strength indicator and validation
- 🎯 **Preferences** - Customizable defaults and theme
- 💰 **Usage Tracking** - Monitor API usage and costs

### Developer Experience
- 📦 **Monorepo** - Centralized dependency management
- 🔄 **Hot Reload** - Instant feedback during development
- 📝 **TypeScript** - Full type safety across the stack
- 🧪 **Demo Mode** - Test without API costs
- 📚 **Documentation** - Comprehensive guides included

---

## 🔑 Getting Your API Key

This application requires an Anthropic API key to use the Claude AI features:

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create Key** to generate a new API key
5. Copy the key (starts with `sk-ant-api03-...`)
6. Add it to your `.env` file

**Note**: New accounts receive free credits to get started. You can test the app without credits using `DEMO_MODE=true`.

---

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes* | - |
| `DEMO_MODE` | Enable demo mode (true/false) | No | `true` |
| `TEXT_API_PORT` | Text API port | No | `3001` |
| `IMAGE_API_PORT` | Image API port | No | `3002` |
| `WEB_PORT` | Frontend port | No | `3000` |

\* Not required if `DEMO_MODE=true`

---

## 📚 Additional Documentation

- 📘 [Codebase Guide](./CODEBASE_GUIDE.md) - Detailed architecture walkthrough
- 🎮 [Demo Mode Guide](./DEMO_MODE_GUIDE.md) - Using the platform without API credits
- ⚡ [Quick Start Guide](./QUICKSTART.md) - Get started in 5 minutes
- 🗺️ [Migration Plan](./projectplanMicro.md) - Microservices architecture details

---

## 🧪 Testing

### Manual Testing

```bash
# Test text summarizer
curl -X POST http://localhost:3001/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here", "maxWords": 50}'

# Test image describer
curl -X POST http://localhost:3002/describe \
  -H "Content-Type: application/json" \
  -d '{"imageData": "base64_data", "imageType": "image/jpeg", "descriptionLength": 30}'

# Health checks
curl http://localhost:3001/health
curl http://localhost:3002/health
```

---

## 🚢 Production Deployment

### Build for Production

```bash
# Build all services
pnpm build

# Build artifacts will be in:
# - apps/web/build/ (Frontend)
# - services/text-summarizer/dist/ (Text API)
# - services/image-describer/dist/ (Image API)
```

### Environment Setup

1. Set `DEMO_MODE=false`
2. Add your production API key
3. Configure appropriate ports
4. Set up process manager (PM2, systemd, etc.)
5. Configure reverse proxy (nginx, Caddy, etc.)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Write TypeScript, not JavaScript
- Follow existing code style
- Test your changes thoroughly
- Update documentation as needed
- Keep commits focused and atomic

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Anthropic](https://www.anthropic.com/)** - For the incredible Claude AI models
- **[Svelte Team](https://svelte.dev/)** - For the amazing Svelte framework
- **[Tailwind Labs](https://tailwindcss.com/)** - For TailwindCSS
- **[Scrimba](https://scrimba.com/)** - For the image upload component inspiration

---

## 📞 Support & Contact

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/your-repo-name/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/your-repo-name/discussions)

---

## 🗺️ Roadmap

- [ ] Add authentication & authorization
- [ ] Implement rate limiting
- [ ] Add Docker support
- [ ] Create CI/CD pipeline
- [ ] Add more AI models (GPT, Gemini)
- [ ] Implement caching layer
- [ ] Add batch processing
- [ ] Create mobile app
- [ ] Add multi-language support
- [ ] Implement webhooks

---

<div align="center">

**Built with ❤️ using Claude AI**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/yourusername/your-repo-name/issues) · [Request Feature](https://github.com/yourusername/your-repo-name/issues) · [Documentation](./CODEBASE_GUIDE.md)

</div>
