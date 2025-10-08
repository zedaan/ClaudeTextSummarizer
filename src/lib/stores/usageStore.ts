import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface UsageRecord {
	date: string; // YYYY-MM-DD
	requests: number;
	inputTokens: number;
	outputTokens: number;
	estimatedCost: number;
}

export interface UsageStats {
	totalRequests: number;
	totalInputTokens: number;
	totalOutputTokens: number;
	totalCost: number;
	currentTier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
	rateLimit: number;
}

// Claude 3.5 Sonnet pricing (per million tokens)
const PRICING = {
	input: 3.0, // $3.00 per 1M input tokens
	output: 15.0 // $15.00 per 1M output tokens
};

// Load from localStorage if in browser
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
	if (browser) {
		const stored = localStorage.getItem(key);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch (e) {
				console.error(`Error parsing ${key}:`, e);
			}
		}
	}
	return defaultValue;
};

// Save to localStorage
const saveToStorage = <T>(key: string, value: T): void => {
	if (browser) {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

// Calculate cost
const calculateCost = (inputTokens: number, outputTokens: number): number => {
	const inputCost = (inputTokens / 1000000) * PRICING.input;
	const outputCost = (outputTokens / 1000000) * PRICING.output;
	return inputCost + outputCost;
};

// Estimate tokens from text (rough approximation: 4 chars ≈ 1 token)
export const estimateTokens = (text: string): number => {
	return Math.ceil(text.length / 4);
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
	const now = new Date();
	return now.toISOString().split('T')[0];
};

// Create usage history store
const createUsageHistoryStore = () => {
	const { subscribe, set, update } = writable<UsageRecord[]>(
		loadFromStorage('usageHistory', [])
	);

	return {
		subscribe,

		trackUsage: (inputTokens: number, outputTokens: number) => {
			const today = getTodayDate();
			const cost = calculateCost(inputTokens, outputTokens);

			update(history => {
				const todayRecord = history.find(r => r.date === today);

				if (todayRecord) {
					// Update existing record
					const updated = history.map(r =>
						r.date === today
							? {
									...r,
									requests: r.requests + 1,
									inputTokens: r.inputTokens + inputTokens,
									outputTokens: r.outputTokens + outputTokens,
									estimatedCost: r.estimatedCost + cost
							  }
							: r
					);
					saveToStorage('usageHistory', updated);
					return updated;
				} else {
					// Create new record
					const newRecord: UsageRecord = {
						date: today,
						requests: 1,
						inputTokens,
						outputTokens,
						estimatedCost: cost
					};
					const updated = [newRecord, ...history].slice(0, 90); // Keep last 90 days
					saveToStorage('usageHistory', updated);
					return updated;
				}
			});
		},

		getLastNDays: (n: number): UsageRecord[] => {
			let history: UsageRecord[] = [];
			subscribe(h => history = h)();

			const today = new Date();
			const records: UsageRecord[] = [];

			for (let i = 0; i < n; i++) {
				const date = new Date(today);
				date.setDate(date.getDate() - i);
				const dateStr = date.toISOString().split('T')[0];

				const record = history.find(r => r.date === dateStr) || {
					date: dateStr,
					requests: 0,
					inputTokens: 0,
					outputTokens: 0,
					estimatedCost: 0
				};

				records.unshift(record);
			}

			return records;
		},

		clearHistory: () => {
			set([]);
			saveToStorage('usageHistory', []);
		},

		exportData: () => {
			let currentData: UsageRecord[] = [];
			subscribe(data => currentData = data)();
			return JSON.stringify(currentData, null, 2);
		}
	};
};

export const usageHistory = createUsageHistoryStore();

// Derived store for usage statistics
export const usageStats = derived(usageHistory, ($history) => {
	const stats: UsageStats = {
		totalRequests: 0,
		totalInputTokens: 0,
		totalOutputTokens: 0,
		totalCost: 0,
		currentTier: 'Tier 1',
		rateLimit: 50
	};

	$history.forEach(record => {
		stats.totalRequests += record.requests;
		stats.totalInputTokens += record.inputTokens;
		stats.totalOutputTokens += record.outputTokens;
		stats.totalCost += record.estimatedCost;
	});

	// Determine tier based on usage (simplified logic)
	if (stats.totalRequests > 10000) {
		stats.currentTier = 'Tier 4';
		stats.rateLimit = 5000;
	} else if (stats.totalRequests > 1000) {
		stats.currentTier = 'Tier 3';
		stats.rateLimit = 2000;
	} else if (stats.totalRequests > 100) {
		stats.currentTier = 'Tier 2';
		stats.rateLimit = 1000;
	}

	return stats;
});

// Derived store for last 7 days
export const last7DaysUsage = derived(usageHistory, ($history) => {
	const today = new Date();
	const records: UsageRecord[] = [];

	for (let i = 6; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split('T')[0];

		const record = $history.find(r => r.date === dateStr) || {
			date: dateStr,
			requests: 0,
			inputTokens: 0,
			outputTokens: 0,
			estimatedCost: 0
		};

		records.push(record);
	}

	return records;
});
