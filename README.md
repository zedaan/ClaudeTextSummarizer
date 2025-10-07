# Claude Text Summarizer

A modern, production-grade text summarization application powered by Anthropic's Claude AI. Built with SvelteKit, TypeScript, and TailwindCSS.

![The Summarizer](./static/images/cool-dog.webp)

## Features

- 🤖 **AI-Powered Summarization** - Uses Claude 3.5 Sonnet for high-quality text summaries
- 📏 **Adjustable Length** - Control summary length from 1-100 words with an interactive slider
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- ♿ **Accessible** - Built with ARIA labels and keyboard navigation support
- 🎨 **Beautiful UI** - Custom design with smooth animations and state transitions
- 📋 **Copy to Clipboard** - One-click copying of generated summaries
- 🐳 **Docker Ready** - Production-ready Docker setup for easy deployment
- 🔐 **Secure** - Server-side API calls keep your API key safe

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [shadcn-svelte](https://shadcn-svelte.com/)
- **AI API**: [Anthropic Messages API](https://docs.anthropic.com/en/api/messages)
- **Containerization**: Docker & Docker Compose
- **Deployment**: Node.js adapter (Cloudflare Pages compatible)

## Prerequisites

- Node.js 20 or higher
- npm or pnpm
- Docker (optional, for containerized deployment)
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:zedaan/ClaudeTextSummarizer.git
cd ClaudeTextSummarizer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and add your Anthropic API key:

```bash
cp .env.example .env
```

Edit `.env` and replace `your_api_key_here` with your actual Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the application.

## Building for Production

### Standard Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Docker Deployment

#### Using Docker Compose (Recommended)

1. Make sure your `.env` file contains your API key
2. Build and run the container:

```bash
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000)

#### Manual Docker Build

```bash
# Build the image
docker build -t claude-summarizer .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your_api_key_here \
  --name claude-summarizer \
  claude-summarizer
```

## Project Structure

```
├── src/
│   ├── lib/              # Shared utilities and components
│   ├── routes/           # SvelteKit routes
│   │   ├── +page.svelte        # Main application page
│   │   ├── +layout.svelte      # Root layout
│   │   └── api/
│   │       └── summarize/
│   │           └── +server.ts  # API endpoint for summarization
│   ├── app.css           # Global styles with Tailwind directives
│   └── app.html          # HTML template
├── static/               # Static assets (images, etc.)
├── Dockerfile            # Production Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── tailwind.config.js    # TailwindCSS configuration
├── svelte.config.js      # SvelteKit configuration
└── package.json          # Project dependencies

```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 3000 in production) | No |

## API Usage

The application uses Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`) model. Each summarization request:

- Costs approximately $0.003 per request (based on average text length)
- Has a max token limit of 1024 for responses
- Processes text of any reasonable length (API limits apply)

Monitor your usage at [Anthropic Console](https://console.anthropic.com/).

## Deployment Options

### Cloudflare Pages (Coming Soon)

This application is designed to work with Cloudflare Pages. Deployment instructions coming soon.

### Other Platforms

The Docker setup works with any container platform:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Any VPS with Docker support

## Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run check
```

## Troubleshooting

### API Key Not Working

- Ensure your `.env` file is in the root directory
- Verify the API key is correct (starts with `sk-ant-api03-`)
- Check API key permissions in Anthropic Console

### Docker Build Fails

- Ensure Docker has enough memory allocated (at least 2GB)
- Try cleaning Docker cache: `docker system prune -a`

### Port Already in Use

If port 3000 is already in use, modify the port in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change 3001 to your preferred port
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [SvelteKit](https://kit.svelte.dev/)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- UI components from [shadcn-svelte](https://shadcn-svelte.com/)
- Original legacy design inspiration

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/zedaan/ClaudeTextSummarizer/issues)
- Check the [projectplan.md](./projectplan.md) for development status

---

**Made with ❤️ using Claude AI**
