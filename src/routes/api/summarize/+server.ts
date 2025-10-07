import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';

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
