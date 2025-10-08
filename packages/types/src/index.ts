// Activity types for unified data model
export interface BaseActivity {
	id: string;
	type: 'text-summary' | 'image-description';
	timestamp: number;
	isSaved: boolean;
	demoMode?: boolean;
	tags?: string[];
}

export interface TextSummaryActivity extends BaseActivity {
	type: 'text-summary';
	originalText: string;
	summary: string;
	wordCount: number;
	summaryLength: number;
}

export interface ImageDescriptionActivity extends BaseActivity {
	type: 'image-description';
	imageUrl: string;
	imageThumbnail?: string;
	description: string;
	descriptionLength: number;
}

export type Activity = TextSummaryActivity | ImageDescriptionActivity;

// API Request/Response types
export interface SummarizeRequest {
	text: string;
	maxWords: number;
}

export interface SummarizeResponse {
	summary: string;
	demoMode?: boolean;
}

export interface DescribeRequest {
	imageData: string;
	imageType: string;
	descriptionLength: number;
}

export interface DescribeResponse {
	description: string;
	demoMode?: boolean;
}

// User data types
export interface UserProfile {
	name: string;
	email: string;
	bio: string;
	avatar: string;
	accountCreated: number;
}

export interface AccountSettings {
	emailNotifications: boolean;
	dailyDigest: boolean;
	language: string;
	timezone: string;
	privacyMode: boolean;
}

export interface UserPreferences {
	theme: 'light' | 'dark' | 'auto';
	defaultSummaryLength: number;
	autoSave: boolean;
	showDemoWarnings: boolean;
	sidebarDefaultOpen: boolean;
	dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

// Usage tracking types
export interface UsageRecord {
	date: string; // YYYY-MM-DD
	requests: number;
	inputTokens: number;
	outputTokens: number;
	estimatedCost: number;
}
