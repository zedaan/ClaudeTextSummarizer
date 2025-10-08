# AI Text Summarizer & Image Describer

> Instantly summarize text and describe images using Claude AI

A modern web application built with SvelteKit that uses Anthropic's Claude 3.5 Sonnet to generate intelligent summaries and image descriptions.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **Text Summarization** - Condense long text into concise summaries (1-100 words)
- **Image Description** - Upload images and get AI-generated descriptions
- **Demo Mode** - Test the app without an API key
- **Usage Tracking** - Monitor your API usage and costs
- **Modern UI** - Clean, responsive interface built with TailwindCSS
- **Microservices Architecture** - Scalable backend with separate services

## Tech Stack

- **Frontend**: SvelteKit, TypeScript, TailwindCSS v4
- **Backend**: Express.js microservices
- **AI**: Anthropic Claude 3.5 Sonnet
- **Package Manager**: pnpm (monorepo)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

```bash
# Copy example files
cp .env.example .env
cp apps/web/.env.example apps/web/.env
```

Edit `.env` and add your Anthropic API key:

```bash
ANTHROPIC_API_KEY=your_api_key_here
DEMO_MODE=false
```

**Don't have an API key?**
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new key
5. Paste it into your `.env` file

### 4. Start the Application

```bash
pnpm dev
```

Visit:
- Frontend: http://localhost:3000
- Text API: http://localhost:3001
- Image API: http://localhost:3002

## Project Structure

```
textSummarizer/
├── apps/
│   └── web/              # Frontend application
│       ├── src/
│       │   ├── lib/      # Components & stores
│       │   └── routes/   # Pages & API routes
│       └── static/       # Images & assets
│
├── services/
│   ├── text-summarizer/  # Text summarization service
│   └── image-describer/  # Image description service
│
└── packages/
    └── types/            # Shared TypeScript types
```

## Demo Mode

Test the app without consuming API credits:

```bash
# In .env file
DEMO_MODE=true
```

Demo mode provides realistic mock responses, perfect for:
- Testing the UI
- Development
- Demos and presentations

## API Endpoints

### Text Summarizer (Port 3001)

```bash
POST /summarize
{
  "text": "Your text here...",
  "maxWords": 50
}
```

### Image Describer (Port 3002)

```bash
POST /describe
{
  "imageData": "base64_encoded_image",
  "imageType": "image/jpeg",
  "descriptionLength": 30
}
```

## Development

```bash
# Start all services
pnpm dev

# Start individual services
pnpm dev:web          # Frontend only
pnpm dev:text-api     # Text API only
pnpm dev:image-api    # Image API only

# Build for production
pnpm build
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes* | - |
| `DEMO_MODE` | Enable demo mode | No | `true` |
| `TEXT_API_PORT` | Text service port | No | `3001` |
| `IMAGE_API_PORT` | Image service port | No | `3002` |
| `WEB_PORT` | Frontend port | No | `3000` |

\* Not required if `DEMO_MODE=true`

## Troubleshooting

**API key not working?**
- Check the key starts with `sk-ant-api03-`
- Verify it's in the root `.env` file
- Restart the dev server

**Port already in use?**
```bash
# Find and kill the process
lsof -i :3000  # or :3001, :3002
kill -9 <PID>
```

**Installation issues?**
```bash
# Clean reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- [Anthropic](https://www.anthropic.com/) - For Claude AI
- [Svelte](https://svelte.dev/) - For the amazing framework
- [TailwindCSS](https://tailwindcss.com/) - For the styling

---

**Need help?** Open an issue on [GitHub](https://github.com/yourusername/your-repo-name/issues)
