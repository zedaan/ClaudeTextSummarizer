# Claude API Guide

Learn how to use the Claude Messages API for text summarization and other AI tasks.

## What is the Claude Messages API?

The Claude Messages API from Anthropic allows you to interact with Claude, an advanced AI assistant, through simple HTTP requests. Our application uses this API to generate intelligent text summaries.

## API Basics

### Authentication

The API uses API keys for authentication. You need to:

1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Navigate to API Keys section
3. Generate a new API key
4. Add it to your `.env` file:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### Model Information

**Claude 3.5 Sonnet**
- Model ID: `claude-3-5-sonnet-20241022`
- Context window: 200K tokens
- Best for: Analysis, content creation, summaries
- Cost: $3.00 / million input tokens, $15.00 / million output tokens

## How Our Summarizer Uses the API

### Request Format

```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Summarize the following text in ${maxWords} words or less:\n\n${text}`
    }]
  })
});
```

### Response Format

```json
{
  "id": "msg_01XYZ...",
  "type": "message",
  "role": "assistant",
  "content": [{
    "type": "text",
    "text": "Your summary appears here..."
  }],
  "model": "claude-3-5-sonnet-20241022",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 150,
    "output_tokens": 45
  }
}
```

## Rate Limits

Anthropic implements rate limits to ensure fair usage:

- **Tier 1** (Free): 50 requests/minute, 40,000 tokens/minute
- **Tier 2** (Build): 1,000 requests/minute, 80,000 tokens/minute
- **Tier 3** (Scale): 2,000 requests/minute, 160,000 tokens/minute
- **Tier 4** (Enterprise): Custom limits

Check your current tier in the [Anthropic Console](https://console.anthropic.com/settings/limits).

## Best Practices

### 1. Prompt Engineering

For better summaries, structure your prompts clearly:

```
Summarize the following text in {N} words or less.
Focus on the main ideas and key points.

Text: {your_text}
```

### 2. Error Handling

Always implement proper error handling:

```javascript
try {
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, maxWords })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to summarize');
  }

  const data = await response.json();
  return data.summary;
} catch (error) {
  console.error('Summarization failed:', error);
  // Handle error appropriately
}
```

### 3. Token Management

Understand token usage:

- Input text is counted in tokens (~4 characters = 1 token)
- Longer texts cost more
- Summary length directly affects output token count
- Monitor usage in the Anthropic Console

### 4. Caching Considerations

For repeated summaries of the same text:
- Store summaries locally to avoid redundant API calls
- Use our built-in history feature
- Implement client-side caching for frequently accessed content

## Advanced Usage

### Customizing the System Prompt

Modify the system prompt for specialized summaries:

```javascript
messages: [{
  role: 'user',
  content: `As a technical writer, create a ${maxWords}-word summary that:
  - Highlights technical details
  - Uses industry terminology
  - Focuses on actionable insights

  Text: ${text}`
}]
```

### Streaming Responses

For longer summaries, implement streaming:

```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    stream: true,
    messages: [/* ... */]
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Process streaming chunks
}
```

## Cost Optimization

### Calculate Costs

For a typical summary:
- Input: 500 words ≈ 625 tokens
- Output: 50 words ≈ 63 tokens

Cost = (625 × $3.00 / 1M) + (63 × $15.00 / 1M) = ~$0.003 per summary

### Tips to Reduce Costs

1. **Use Demo Mode** for testing and development
2. **Implement caching** for repeated queries
3. **Optimize prompt length** - be concise
4. **Set appropriate max_tokens** limits
5. **Batch similar requests** when possible

## API Errors & Troubleshooting

### Common Errors

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 401 | Invalid API key | Check your `.env` file |
| 429 | Rate limit exceeded | Wait and retry, or upgrade tier |
| 400 | Invalid request | Validate request format |
| 529 | Overloaded | Retry with exponential backoff |

### Error Response Example

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Your credit balance is too low to access the Anthropic API"
  }
}
```

## Resources

- [Official Anthropic Documentation](https://docs.anthropic.com/)
- [API Reference](https://docs.anthropic.com/claude/reference/)
- [Anthropic Console](https://console.anthropic.com/)
- [Claude Model Cards](https://www.anthropic.com/claude)
- [Pricing Information](https://www.anthropic.com/pricing)

## Security Best Practices

1. **Never expose your API key** in client-side code
2. **Use environment variables** (`.env` files)
3. **Implement rate limiting** on your backend
4. **Monitor API usage** regularly
5. **Rotate keys periodically**
6. **Use HTTPS** for all API requests

---

Ready to dive deeper? Check out the [API Reference](api-reference) for technical details about our endpoints.
