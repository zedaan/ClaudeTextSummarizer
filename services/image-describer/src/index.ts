import express, { Request, Response } from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.IMAGE_API_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images

// Generate a mock description for demo mode
function generateMockDescription(descriptionLength: number): string {
	const descriptions = [
		'The image shows a colorful scene with various elements.',
		'There are interesting details throughout the composition.',
		'The lighting and colors create a pleasant atmosphere.'
	];

	let description = descriptions.join(' ');
	description = description.substring(0, descriptionLength * 7); // Rough word length
	return description + ' [DEMO MODE - Add Anthropic credits for real AI descriptions]';
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
	res.json({ status: 'ok', service: 'image-describer' });
});

// Describe endpoint
app.post('/describe', async (req: Request, res: Response) => {
	try {
		const { imageData, imageType, descriptionLength } = req.body;

		// Validate input
		if (!imageData || typeof imageData !== 'string') {
			return res.status(400).json({ error: 'Invalid input: imageData is required' });
		}

		if (!imageType || typeof imageType !== 'string') {
			return res.status(400).json({ error: 'Invalid input: imageType is required' });
		}

		if (!descriptionLength || typeof descriptionLength !== 'number' || descriptionLength < 1 || descriptionLength > 100) {
			return res.status(400).json({
				error: 'Invalid input: descriptionLength must be between 1 and 100'
			});
		}

		// Check for demo mode
		if (process.env.DEMO_MODE === 'true') {
			console.log('⚠️  Running in DEMO MODE - using mock descriptions');
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
			return res.json({
				description: generateMockDescription(descriptionLength),
				demoMode: true
			});
		}

		// Initialize Anthropic client
		const anthropic = new Anthropic({
			apiKey: process.env.ANTHROPIC_API_KEY
		});

		// Extract media type from imageType (e.g., "image/jpeg" -> "image/jpeg")
		const mediaType = imageType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

		// Call Anthropic Vision API
		const message = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 1024,
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'image',
							source: {
								type: 'base64',
								media_type: mediaType,
								data: imageData
							}
						},
						{
							type: 'text',
							text: `Please describe this image in approximately ${descriptionLength} words. Be concise and focus on the key visual elements.`
						}
					]
				}
			]
		});

		// Extract the description from the response
		const description =
			message.content[0].type === 'text' ? message.content[0].text : 'Unable to generate description';

		return res.json({ description });
	} catch (error) {
		console.error('Description error:', error);

		// Handle specific API errors
		if (error instanceof Anthropic.APIError) {
			return res.status(error.status || 500).json({
				error: `API Error: ${error.message}`
			});
		}

		return res.status(500).json({
			error: 'Failed to describe image. Please try again.'
		});
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Image Describer API running on http://localhost:${PORT}`);
	console.log(`📝 Demo Mode: ${process.env.DEMO_MODE === 'true' ? 'Enabled' : 'Disabled'}`);
});
