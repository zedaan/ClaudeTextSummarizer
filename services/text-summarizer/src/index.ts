import express, { Request, Response } from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.TEXT_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Generate a mock summary for demo mode
function generateMockSummary(text: string, maxWords: number): string {
	const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
	const wordCount = text.split(/\s+/).length;

	// Create a realistic-looking summary
	const summaryParts = [
		sentences[0]?.trim() || 'The text discusses various topics.',
		sentences.length > 2 ? `Key points include ${sentences[1]?.substring(0, 50)}...` : '',
		`This covers approximately ${wordCount} words of content.`
	].filter(Boolean);

	let summary = summaryParts.join(' ').substring(0, maxWords * 7); // Rough word length
	return summary + ' [DEMO MODE - Add Anthropic credits for real AI summaries]';
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
	res.json({ status: 'ok', service: 'text-summarizer' });
});

// Summarize endpoint
app.post('/summarize', async (req: Request, res: Response) => {
	try {
		const { text, maxWords } = req.body;

		// Validate input
		if (!text || typeof text !== 'string') {
			return res.status(400).json({ error: 'Invalid input: text is required' });
		}

		if (!maxWords || typeof maxWords !== 'number' || maxWords < 1 || maxWords > 100) {
			return res.status(400).json({
				error: 'Invalid input: maxWords must be between 1 and 100'
			});
		}

		// Check for demo mode
		if (process.env.DEMO_MODE === 'true') {
			console.log('⚠️  Running in DEMO MODE - using mock summaries');
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
			return res.json({
				summary: generateMockSummary(text, maxWords),
				demoMode: true
			});
		}

		// Initialize Anthropic client
		const anthropic = new Anthropic({
			apiKey: process.env.ANTHROPIC_API_KEY
		});

		// Call Anthropic API
		const message = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 1024,
			messages: [
				{
					role: 'user',
					content: `Please summarize the following text in approximately ${maxWords} words. Be concise and capture the key points:\n\n${text}`
				}
			]
		});

		// Extract the summary from the response
		const summary =
			message.content[0].type === 'text' ? message.content[0].text : 'Unable to generate summary';

		return res.json({ summary });
	} catch (error) {
		console.error('Summarization error:', error);

		// Handle specific API errors
		if (error instanceof Anthropic.APIError) {
			return res.status(error.status || 500).json({
				error: `API Error: ${error.message}`
			});
		}

		return res.status(500).json({
			error: 'Failed to summarize text. Please try again.'
		});
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Text Summarizer API running on http://localhost:${PORT}`);
	console.log(`📝 Demo Mode: ${process.env.DEMO_MODE === 'true' ? 'Enabled' : 'Disabled'}`);
});
