# Getting Started with AI Summarizer

Welcome to AI Summarizer, your intelligent text summarization tool powered by Claude 3.5 Sonnet!

## Quick Start

1. **Enter your text** in the input area on the dashboard
2. **Adjust the summary length** using the slider (1-100 words)
3. **Click "Summarize"** to generate your AI-powered summary
4. **Save or copy** your summary for later use

## Key Features

### 🤖 AI-Powered Summaries
Our summarizer uses Claude 3.5 Sonnet, one of the most advanced AI models from Anthropic, to generate accurate and contextual summaries of your text.

### 📊 Customizable Length
Control the output length with precision - from ultra-brief 1-word summaries to comprehensive 100-word overviews.

### 💾 History & Saved Summaries
- **History**: All your summaries are automatically saved to history
- **Bookmarks**: Mark important summaries for quick access
- **Search**: Find summaries quickly with full-text search
- **Export**: Download your summaries as JSON or text files

### 🎨 Modern Dashboard Interface
Beautiful, responsive design that works seamlessly on desktop, tablet, and mobile devices.

## Understanding Demo Mode

If you see a "Demo Mode" banner, it means the application is using mock summaries instead of the real Claude API. This happens when:

- No Anthropic API key is configured
- Your Anthropic account has insufficient credits
- The `DEMO_MODE` environment variable is set to `true`

**To enable real AI summaries:**

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Get your API key and add credits
3. Update your `.env` file with your API key
4. Set `DEMO_MODE=false` in your `.env` file
5. Restart the application

## Navigation

- **Dashboard** (`/`): Create new summaries
- **History** (`/history`): View all generated summaries
- **Saved** (`/saved`): Access your bookmarked summaries
- **Settings** (`/settings`): Customize your preferences
- **Help & Docs** (`/help`): Read the documentation

## Tips for Best Results

1. **Provide context**: More detailed text usually produces better summaries
2. **Adjust length**: Experiment with different summary lengths for optimal results
3. **Save important summaries**: Use the bookmark feature to keep track of key summaries
4. **Review history**: Learn from past summaries to improve your inputs

## Next Steps

- [Claude API Guide](claude-api-guide) - Learn how the Claude Messages API works
- [API Reference](api-reference) - Technical details about our endpoints
- [Troubleshooting](troubleshooting) - Common issues and solutions
- [FAQ](faq) - Frequently asked questions

---

Need help? Visit the [Troubleshooting](troubleshooting) page or check our [FAQ](faq).
