import { writable } from 'svelte/store';
import { browser } from '$app/environment';

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

// Default values
const defaultProfile: UserProfile = {
	name: 'AI User',
	email: 'user@example.com',
	bio: 'Using AI to make my life easier!',
	avatar: '/images/cool-dog.webp',
	accountCreated: Date.now()
};

const defaultSettings: AccountSettings = {
	emailNotifications: true,
	dailyDigest: false,
	language: 'en',
	timezone: 'UTC',
	privacyMode: false
};

const defaultPreferences: UserPreferences = {
	theme: 'auto',
	defaultSummaryLength: 10,
	autoSave: false,
	showDemoWarnings: true,
	sidebarDefaultOpen: true,
	dateFormat: 'MM/DD/YYYY'
};

// Create stores
const createUserProfileStore = () => {
	const { subscribe, set, update } = writable<UserProfile>(
		loadFromStorage('userProfile', defaultProfile)
	);

	return {
		subscribe,
		updateProfile: (profile: Partial<UserProfile>) => {
			update(current => {
				const updated = { ...current, ...profile };
				saveToStorage('userProfile', updated);
				return updated;
			});
		},
		reset: () => {
			set(defaultProfile);
			saveToStorage('userProfile', defaultProfile);
		}
	};
};

const createAccountSettingsStore = () => {
	const { subscribe, set, update } = writable<AccountSettings>(
		loadFromStorage('accountSettings', defaultSettings)
	);

	return {
		subscribe,
		updateSettings: (settings: Partial<AccountSettings>) => {
			update(current => {
				const updated = { ...current, ...settings };
				saveToStorage('accountSettings', updated);
				return updated;
			});
		},
		reset: () => {
			set(defaultSettings);
			saveToStorage('accountSettings', defaultSettings);
		},
		exportData: () => {
			let currentData: AccountSettings = defaultSettings;
			subscribe(data => currentData = data)();
			return JSON.stringify(currentData, null, 2);
		}
	};
};

const createUserPreferencesStore = () => {
	const { subscribe, set, update } = writable<UserPreferences>(
		loadFromStorage('userPreferences', defaultPreferences)
	);

	return {
		subscribe,
		updatePreferences: (preferences: Partial<UserPreferences>) => {
			update(current => {
				const updated = { ...current, ...preferences };
				saveToStorage('userPreferences', updated);
				return updated;
			});
		},
		reset: () => {
			set(defaultPreferences);
			saveToStorage('userPreferences', defaultPreferences);
		},
		exportData: () => {
			let currentData: UserPreferences = defaultPreferences;
			subscribe(data => currentData = data)();
			return JSON.stringify(currentData, null, 2);
		},
		importData: (jsonString: string) => {
			try {
				const imported = JSON.parse(jsonString) as UserPreferences;
				set(imported);
				saveToStorage('userPreferences', imported);
				return { success: true, message: 'Preferences imported successfully' };
			} catch (e) {
				return { success: false, message: 'Invalid JSON format' };
			}
		}
	};
};

export const userProfile = createUserProfileStore();
export const accountSettings = createAccountSettingsStore();
export const userPreferences = createUserPreferencesStore();
