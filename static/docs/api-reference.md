# API Reference

Technical documentation for the AI Summarizer API endpoints.

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Authentication

All API requests are made server-side with the Anthropic API key stored in environment variables. No client-side authentication is required.

## Endpoints

### POST `/api/summarize`

Generate a summary of the provided text using Claude AI.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | The text to summarize (max 100,000 characters) |
| `maxWords` | number | Yes | Maximum length of summary in words (1-100) |

**Example Request:**

```javascript
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "Your long text here...",
    maxWords: 50
  })
});
```

```json
{
  "text": "Artificial intelligence (AI) is transforming how we interact with technology. From virtual assistants to autonomous vehicles, AI systems are becoming increasingly sophisticated...",
  "maxWords": 25
}
```

#### Response

**Success Response (200 OK):**

```json
{
  "summary": "AI is revolutionizing technology through virtual assistants and autonomous vehicles. These systems are becoming more sophisticated, impacting various industries and daily life.",
  "demoMode": false
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `summary` | string | The generated summary |
| `demoMode` | boolean | Indicates if demo mode was used (true) or real API (false) |

**Error Responses:**

```json
{
  "error": "Text is required and must not be empty"
}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 500 | Internal Server Error - API failure |
| 529 | Service Overloaded - Anthropic API unavailable |

#### Error Examples

**Missing Text:**
```json
{
  "error": "Text is required and must not be empty"
}
```

**Invalid maxWords:**
```json
{
  "error": "maxWords must be a number between 1 and 100"
}
```

**API Error:**
```json
{
  "error": "Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."
}
```

## Demo Mode

When `DEMO_MODE=true` in environment variables, the API returns mock summaries instead of calling the Claude API.

**Demo Mode Response:**
```json
{
  "summary": "The text discusses various topics. Key points include... [DEMO MODE - Add Anthropic credits for real AI summaries]",
  "demoMode": true
}
```

### Demo Mode Behavior

- Simulates 1-second processing time
- Generates mock summaries based on input text
- Includes `[DEMO MODE]` suffix in summary
- Useful for testing without consuming API credits

## Rate Limiting

The application does not implement client-side rate limiting. Rate limits are enforced by the Anthropic API:

- **Tier 1**: 50 requests/minute
- **Tier 2**: 1,000 requests/minute
- **Tier 3**: 2,000 requests/minute
- **Tier 4**: Custom limits

When rate limited, you'll receive a 429 error with retry information.

## Data Flow

```
1. Client sends POST request to /api/summarize
   ↓
2. Server validates request parameters
   ↓
3. Server checks DEMO_MODE setting
   ├─ If true: Generate mock summary
   └─ If false: Call Anthropic API
   ↓
4. Process API response
   ↓
5. Return summary to client
```

## Environment Variables

Configure the following in your `.env` file:

```bash
# Required for real AI summaries
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Optional: Enable demo mode
DEMO_MODE=false

# Optional: Node environment
NODE_ENV=production
```

## TypeScript Interfaces

### Request Interface

```typescript
interface SummarizeRequest {
  text: string;
  maxWords: number;
}
```

### Response Interface

```typescript
interface SummarizeResponse {
  summary: string;
  demoMode?: boolean;
}
```

### Error Interface

```typescript
interface ErrorResponse {
  error: string;
}
```

## Code Examples

### JavaScript/TypeScript

```typescript
async function summarizeText(text: string, maxWords: number) {
  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, maxWords }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to summarize');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
const result = await summarizeText('Your text here...', 50);
console.log(result.summary);
```

### cURL

```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your long text here...",
    "maxWords": 50
  }'
```

### Python

```python
import requests

def summarize_text(text, max_words):
    response = requests.post(
        'http://localhost:3000/api/summarize',
        json={'text': text, 'maxWords': max_words}
    )
    response.raise_for_status()
    return response.json()

# Usage
result = summarize_text('Your text here...', 50)
print(result['summary'])
```

## Server-Side Implementation

### Endpoint Handler

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
  const { text, maxWords } = await request.json();

  // Validation
  if (!text || text.trim() === '') {
    return json({ error: 'Text is required' }, { status: 400 });
  }

  // Demo mode check
  if (env.DEMO_MODE === 'true') {
    return json({
      summary: generateMockSummary(text, maxWords),
      demoMode: true
    });
  }

  // Real API call
  const anthropic = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY
  });

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Summarize in ${maxWords} words: ${text}`
    }]
  });

  return json({ summary: message.content[0].text });
};
```

## Performance Considerations

- **Response Time**: Typically 1-3 seconds for Claude API
- **Text Length**: Longer inputs take more time to process
- **Caching**: Not implemented at API level; cache client-side
- **Concurrency**: No limit on client-side; Anthropic enforces rate limits

## Security Notes

- API key is stored server-side only
- No client-side API key exposure
- Request validation prevents injection attacks
- CORS configured for production domain

---

For implementation examples, see [Claude API Guide](claude-api-guide).
