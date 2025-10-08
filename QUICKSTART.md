# Quick Start Guide

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# Install all project dependencies using pnpm
pnpm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment files
cp .env.example .env
cp apps/web/.env.example apps/web/.env
```

### 3. Add Your API Key

Open the `.env` file in the root directory and add your Anthropic API key:

```bash
# .env file
ANTHROPIC_API_KEY=your_api_key_here  # Replace with your actual key
DEMO_MODE=false  # Set to true to test without API key
TEXT_API_PORT=3001
IMAGE_API_PORT=3002
WEB_PORT=3000
```

**Don't have an API key?**
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up for a free account
3. Navigate to API Keys and create a new key
4. Copy and paste it into your `.env` file

### 4. Start the Application

```bash
# Start all microservices (web, text-api, image-api)
pnpm dev
```

### 5. Open in Browser

- **Frontend**: http://localhost:3000
- **Text API**: http://localhost:3001
- **Image API**: http://localhost:3002

## 🧪 Testing the Summarizer

1. Paste any text into the input area
2. Adjust the summary length slider (1-100 words)
3. Click "Summarize"
4. Copy the generated summary
5. Click "Clear" to start over

## 📝 Sample Text to Try

Paste this sample text to test:

```
The Industrial Revolution, which took place from the 18th to 19th centuries, was a period during which predominantly agrarian, rural societies in Europe and America became industrial and urban. Before the Industrial Revolution, which began in Britain in the late 1700s, manufacturing was often done in people's homes, using hand tools or basic machines. Industrialization marked a shift to powered, special-purpose machinery, factories and mass production. The iron and textile industries, along with the development of the steam engine, played central roles in the Industrial Revolution, which also saw improved systems of transportation, communication and banking.
```

## 🔍 Troubleshooting

**API Key Not Working?**
- Verify your `.env` file exists in the root directory
- Check that the key starts with `sk-ant-api03-`
- Restart all services: Stop `pnpm dev` and run it again
- Try DEMO_MODE=true to test without an API key

**Port Already in Use?**
```bash
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :3001  # Text API
lsof -i :3002  # Image API

# Kill the process and restart
kill -9 <PID>
pnpm dev
```

**Installation Issues?**
```bash
# Clean install
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf services/*/node_modules
rm pnpm-lock.yaml
pnpm install
```

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [CODEBASE_GUIDE.md](./CODEBASE_GUIDE.md) to understand the architecture
- Monitor your API usage in [Anthropic Console](https://console.anthropic.com/)
- Explore the demo mode features

---

**Need help?** Check the main [README.md](./README.md) for detailed documentation.
