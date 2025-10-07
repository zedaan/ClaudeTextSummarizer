import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';

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

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { text, maxWords } = await request.json();

		// Validate input
		if (!text || typeof text !== 'string') {
			return json({ error: 'Invalid input: text is required' }, { status: 400 });
		}

		if (!maxWords || typeof maxWords !== 'number' || maxWords < 1 || maxWords > 100) {
			return json(
				{ error: 'Invalid input: maxWords must be between 1 and 100' },
				{ status: 400 }
			);
		}

		// Check for demo mode
		if (env.DEMO_MODE === 'true') {
			console.log('⚠️  Running in DEMO MODE - using mock summaries');
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
			return json({
				summary: generateMockSummary(text, maxWords),
				demoMode: true
			});
		}

		// Initialize Anthropic client with runtime env variable
		const anthropic = new Anthropic({
			apiKey: env.ANTHROPIC_API_KEY
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

		return json({ summary });
	} catch (error) {
		console.error('Summarization error:', error);

		// Handle specific API errors
		if (error instanceof Anthropic.APIError) {
			return json(
				{
					error: `API Error: ${error.message}`
				},
				{ status: error.status || 500 }
			);
		}

		return json(
			{
				error: 'Failed to summarize text. Please try again.'
			},
			{ status: 500 }
		);
	}
};
