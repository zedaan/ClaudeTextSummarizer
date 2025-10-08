import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Summary {
	id: string;
	originalText: string;
	summary: string;
	wordCount: number;
	summaryLength: number;
	timestamp: number;
	isSaved: boolean;
	tags?: string[];
	demoMode?: boolean;
}

// Load from localStorage if in browser
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
	if (browser) {
		const stored = localStorage.getItem(key);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch (e) {
				console.error('Error parsing stored data:', e);
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

// Initialize stores
const createSummaryStore = () => {
	const { subscribe, set, update } = writable<Summary[]>(loadFromStorage('summaryHistory', []));

	return {
		subscribe,
		addSummary: (summary: Omit<Summary, 'id' | 'timestamp'>) => {
			const newSummary: Summary = {
				...summary,
				id: crypto.randomUUID(),
				timestamp: Date.now()
			};

			update(summaries => {
				const updated = [newSummary, ...summaries];
				saveToStorage('summaryHistory', updated);
				return updated;
			});

			return newSummary;
		},

		toggleSave: (id: string) => {
			update(summaries => {
				const updated = summaries.map(s =>
					s.id === id ? { ...s, isSaved: !s.isSaved } : s
				);
				saveToStorage('summaryHistory', updated);
				return updated;
			});
		},

		deleteSummary: (id: string) => {
			update(summaries => {
				const updated = summaries.filter(s => s.id !== id);
				saveToStorage('summaryHistory', updated);
				return updated;
			});
		},

		clearHistory: () => {
			set([]);
			saveToStorage('summaryHistory', []);
		},

		addTag: (id: string, tag: string) => {
			update(summaries => {
				const updated = summaries.map(s => {
					if (s.id === id) {
						const tags = s.tags || [];
						if (!tags.includes(tag)) {
							return { ...s, tags: [...tags, tag] };
						}
					}
					return s;
				});
				saveToStorage('summaryHistory', updated);
				return updated;
			});
		},

		removeTag: (id: string, tag: string) => {
			update(summaries => {
				const updated = summaries.map(s => {
					if (s.id === id && s.tags) {
						return { ...s, tags: s.tags.filter(t => t !== tag) };
					}
					return s;
				});
				saveToStorage('summaryHistory', updated);
				return updated;
			});
		}
	};
};

export const summaryStore = createSummaryStore();

// Derived store for saved summaries only
export const savedSummaries = {
	subscribe: (callback: (summaries: Summary[]) => void) => {
		return summaryStore.subscribe(summaries => {
			callback(summaries.filter(s => s.isSaved));
		});
	}
};

// Derived store for stats
export const summaryStats = {
	subscribe: (callback: (stats: { total: number; saved: number; totalWords: number }) => void) => {
		return summaryStore.subscribe(summaries => {
			callback({
				total: summaries.length,
				saved: summaries.filter(s => s.isSaved).length,
				totalWords: summaries.reduce((acc, s) => acc + s.wordCount, 0)
			});
		});
	}
};
