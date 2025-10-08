<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FormCard from '$lib/components/FormCard.svelte';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import { userPreferences } from '$lib/stores/userStore';

	let sidebarOpen = $state(true);
	let preferences = $state({
		theme: 'auto' as 'light' | 'dark' | 'auto',
		defaultSummaryLength: 10,
		autoSave: false,
		showDemoWarnings: true,
		sidebarDefaultOpen: true,
		dateFormat: 'MM/DD/YYYY' as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
	});
	let isSaving = $state(false);
	let saveMessage = $state('');
	let showImportDialog = $state(false);
	let importText = $state('');
	let importError = $state('');

	// Subscribe to preferences
	$effect(() => {
		const unsubscribe = userPreferences.subscribe(p => {
			preferences = { ...p };
		});
		return unsubscribe;
	});

	function savePreferences() {
		isSaving = true;
		saveMessage = '';

		setTimeout(() => {
			userPreferences.updatePreferences(preferences);
			isSaving = false;
			saveMessage = 'Preferences saved successfully!';

			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		}, 500);
	}

	function resetPreferences() {
		if (confirm('Are you sure you want to reset all preferences to default values?')) {
			userPreferences.reset();
			saveMessage = 'Preferences reset to defaults!';
			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		}
	}

	function exportPreferences() {
		const data = userPreferences.exportData();
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `preferences-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);

		saveMessage = 'Preferences exported successfully!';
		setTimeout(() => {
			saveMessage = '';
		}, 3000);
	}

	function importPreferences() {
		importError = '';
		const result = userPreferences.importData(importText);

		if (result.success) {
			showImportDialog = false;
			importText = '';
			saveMessage = result.message;
			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		} else {
			importError = result.message;
		}
	}
</script>

<div class="flex min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
	<Sidebar bind:isOpen={sidebarOpen} />

	<main class="flex-1 transition-all duration-300 {sidebarOpen ? 'ml-72' : 'ml-20'}">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Header -->
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-2">
					<svg class="w-10 h-10 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
					</svg>
					<h1 class="text-4xl font-bold text-dark-900">Preferences</h1>
				</div>
				<p class="text-dark-600">Customize your AI Summarizer experience</p>
			</div>

			<!-- Success Message -->
			{#if saveMessage}
				<div class="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
					<svg class="w-5 h-5 text-success-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
					<p class="text-sm font-semibold text-success-800">{saveMessage}</p>
				</div>
			{/if}

			<div class="space-y-6">
				<!-- Appearance -->
				<FormCard title="Appearance">
					{#snippet children()}
						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Theme
							</label>
							<div class="grid grid-cols-3 gap-3">
								<button
									onclick={() => preferences.theme = 'light'}
									class="p-4 border-2 rounded-lg transition-all {preferences.theme === 'light' ? 'border-primary-600 bg-primary-50' : 'border-dark-300 hover:border-dark-400'}"
								>
									<svg class="w-6 h-6 mx-auto mb-2 {preferences.theme === 'light' ? 'text-primary-600' : 'text-dark-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
									</svg>
									<p class="text-sm font-medium {preferences.theme === 'light' ? 'text-primary-700' : 'text-dark-700'}">Light</p>
								</button>

								<button
									onclick={() => preferences.theme = 'dark'}
									class="p-4 border-2 rounded-lg transition-all {preferences.theme === 'dark' ? 'border-primary-600 bg-primary-50' : 'border-dark-300 hover:border-dark-400'}"
								>
									<svg class="w-6 h-6 mx-auto mb-2 {preferences.theme === 'dark' ? 'text-primary-600' : 'text-dark-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
									</svg>
									<p class="text-sm font-medium {preferences.theme === 'dark' ? 'text-primary-700' : 'text-dark-700'}">Dark</p>
								</button>

								<button
									onclick={() => preferences.theme = 'auto'}
									class="p-4 border-2 rounded-lg transition-all {preferences.theme === 'auto' ? 'border-primary-600 bg-primary-50' : 'border-dark-300 hover:border-dark-400'}"
								>
									<svg class="w-6 h-6 mx-auto mb-2 {preferences.theme === 'auto' ? 'text-primary-600' : 'text-dark-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
									</svg>
									<p class="text-sm font-medium {preferences.theme === 'auto' ? 'text-primary-700' : 'text-dark-700'}">Auto</p>
								</button>
							</div>
							<p class="text-xs text-dark-500 mt-2">Choose your preferred color scheme</p>
						</div>
					{/snippet}
				</FormCard>

				<!-- Summary Settings -->
				<FormCard title="Summary Settings">
					{#snippet children()}
						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Default Summary Length (words)
							</label>
							<div class="flex items-center gap-4">
								<input
									type="range"
									bind:value={preferences.defaultSummaryLength}
									min="1"
									max="100"
									class="flex-1"
								/>
								<span class="text-sm font-bold text-primary-700 w-12 text-right">{preferences.defaultSummaryLength}</span>
							</div>
							<p class="text-xs text-dark-500 mt-2">Set the default word count for new summaries</p>
						</div>

						<ToggleSwitch
							bind:checked={preferences.autoSave}
							label="Auto-save summaries"
							description="Automatically bookmark all generated summaries"
							onToggle={(checked) => {}}
						/>

						<ToggleSwitch
							bind:checked={preferences.showDemoWarnings}
							label="Show demo mode warnings"
							description="Display warning banners when using demo mode"
							onToggle={(checked) => {}}
						/>
					{/snippet}
				</FormCard>

				<!-- Interface Settings -->
				<FormCard title="Interface Settings">
					{#snippet children()}
						<ToggleSwitch
							bind:checked={preferences.sidebarDefaultOpen}
							label="Sidebar default state"
							description="Keep sidebar expanded by default on page load"
							onToggle={(checked) => {}}
						/>

						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Date Format
							</label>
							<select
								bind:value={preferences.dateFormat}
								class="w-full px-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							>
								<option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
								<option value="DD/MM/YYYY">DD/MM/YYYY (EU Format)</option>
								<option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
							</select>
							<p class="text-xs text-dark-500 mt-2">Choose your preferred date display format</p>
						</div>
					{/snippet}
				</FormCard>

				<!-- Data Management -->
				<FormCard title="Data Management">
					{#snippet children()}
						<div class="space-y-3">
							<button
								onclick={exportPreferences}
								class="btn btn-secondary w-full justify-center"
							>
								<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
								</svg>
								Export Preferences as JSON
							</button>

							<button
								onclick={() => showImportDialog = true}
								class="btn btn-secondary w-full justify-center"
							>
								<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
								</svg>
								Import Preferences from JSON
							</button>

							<button
								onclick={resetPreferences}
								class="btn btn-danger w-full justify-center"
							>
								<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
								</svg>
								Reset to Defaults
							</button>
						</div>
					{/snippet}
				</FormCard>

				<!-- Save Button -->
				<div class="sticky bottom-4">
					<button
						onclick={savePreferences}
						disabled={isSaving}
						class="btn btn-primary w-full {isSaving ? 'opacity-75 cursor-not-allowed' : ''} shadow-lg"
					>
						{#if isSaving}
							<svg class="w-5 h-5 mr-2 inline-block animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
							</svg>
							Saving...
						{:else}
							<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
							</svg>
							Save Preferences
						{/if}
					</button>
				</div>
			</div>
		</div>

		<Footer isDemoMode={false} />
	</main>
</div>

<!-- Import Dialog -->
{#if showImportDialog}
	<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick={() => showImportDialog = false}>
		<div class="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
			<h3 class="text-xl font-bold text-dark-900 mb-4">Import Preferences</h3>
			<p class="text-sm text-dark-600 mb-4">Paste your exported preferences JSON below:</p>

			<textarea
				bind:value={importText}
				placeholder={'{"theme":"auto","defaultSummaryLength":10,...}'}
				rows="8"
				class="w-full px-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-xs"
			></textarea>

			{#if importError}
				<div class="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
					<p class="text-sm text-danger-800">{importError}</p>
				</div>
			{/if}

			<div class="flex gap-3 mt-6">
				<button
					onclick={importPreferences}
					class="btn btn-primary flex-1"
				>
					Import
				</button>
				<button
					onclick={() => { showImportDialog = false; importText = ''; importError = ''; }}
					class="btn btn-secondary flex-1"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
