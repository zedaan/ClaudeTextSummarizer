# Quick Start Guide

## 🚀 Run the Application Locally

### Option 1: Development Mode (Recommended for testing)

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Run the development server
npm run dev

# 3. Open http://localhost:5173 in your browser
```

### Option 2: Production Build

```bash
# 1. Build the application
npm run build

# 2. Preview the production build
npm run preview

# 3. Open http://localhost:4173 in your browser
```

### Option 3: Docker (Production-ready)

```bash
# 1. Build and run with Docker Compose
docker-compose up -d

# 2. Open http://localhost:3000 in your browser

# To stop:
docker-compose down
```

## ⚙️ Configuration

Your `.env` file should contain:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

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

## 🐳 Docker Commands

```bash
# Build the image manually
docker build -t claude-summarizer .

# Run the container manually
docker run -d -p 3000:3000 -e ANTHROPIC_API_KEY=your-key-here claude-summarizer

# View logs
docker logs -f <container-id>

# Stop the container
docker stop <container-id>
```

## 🔍 Troubleshooting

**API Key Not Working?**
- Check that your `.env` file exists in the root directory
- Verify the key starts with `sk-ant-api03-`
- Restart the dev server after adding the key

**Port Already in Use?**
- Development: Kill the process on port 5173
- Production: Kill the process on port 3000
- Docker: Change the port in `docker-compose.yml`

**Build Errors?**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Next Steps

- Push to GitHub: `git push origin main`
- Deploy to production (see README.md)
- Monitor API usage in Anthropic Console
- Check `projectplan.md` for remaining tasks

---

**Need help?** Check the main [README.md](./README.md) for detailed documentation.
