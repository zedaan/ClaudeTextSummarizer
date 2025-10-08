<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { summaryStore } from '$lib/stores/summaryStore';

	let sidebarOpen = $state(true);
	let showClearConfirm = $state(false);

	// Settings (these would typically be in a settings store)
	let defaultSummaryLength = $state(10);
	let autoSave = $state(false);
	let showDemoWarnings = $state(true);

	function saveSettings() {
		alert('Settings saved! (In a real app, these would be persisted)');
	}

	function clearHistory() {
		summaryStore.clearHistory();
		showClearConfirm = false;
		alert('History cleared successfully!');
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
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
					</svg>
					<h1 class="text-4xl font-bold text-dark-900">Settings</h1>
				</div>
				<p class="text-dark-600">Customize your AI Summarizer experience</p>
			</div>

			<div class="space-y-6">
				<!-- API Configuration -->
				<div class="card">
					<h2 class="text-xl font-bold text-dark-900 mb-4 flex items-center gap-2">
						<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
						</svg>
						API Configuration
					</h2>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Anthropic API Key
							</label>
							<div class="flex gap-2">
								<input
									type="password"
									value="sk-ant-api03-••••••••"
									readonly
									class="flex-1 px-4 py-3 border border-dark-300 rounded-lg bg-dark-50"
								/>
								<a
									href="https://console.anthropic.com/"
									target="_blank"
									rel="noopener noreferrer"
									class="btn btn-secondary"
								>
									<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
									</svg>
									Manage
								</a>
							</div>
							<p class="text-xs text-dark-500 mt-2">
								Configure your API key in the .env file. Visit the Anthropic Console to manage your credits.
							</p>
						</div>

						<div class="p-4 bg-warning-50 border border-warning-200 rounded-lg">
							<div class="flex items-start gap-3">
								<svg class="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
								</svg>
								<div>
									<p class="text-sm font-semibold text-warning-800">Demo Mode Active</p>
									<p class="text-xs text-warning-700 mt-1">
										Add Anthropic credits and set DEMO_MODE=false in your .env file to use real AI summaries.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Summary Preferences -->
				<div class="card">
					<h2 class="text-xl font-bold text-dark-900 mb-4 flex items-center gap-2">
						<svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
						</svg>
						Summary Preferences
					</h2>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Default Summary Length (words)
							</label>
							<div class="flex items-center gap-4">
								<input
									type="range"
									bind:value={defaultSummaryLength}
									min="1"
									max="100"
									class="flex-1"
								/>
								<span class="text-sm font-bold text-primary-700 w-12 text-right">{defaultSummaryLength}</span>
							</div>
						</div>

						<div class="flex items-center justify-between p-4 bg-dark-50 rounded-lg">
							<div>
								<p class="text-sm font-semibold text-dark-900">Auto-save summaries</p>
								<p class="text-xs text-dark-500">Automatically bookmark all generated summaries</p>
							</div>
							<label class="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									bind:checked={autoSave}
									class="sr-only peer"
								/>
								<div class="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
							</label>
						</div>

						<div class="flex items-center justify-between p-4 bg-dark-50 rounded-lg">
							<div>
								<p class="text-sm font-semibold text-dark-900">Show demo mode warnings</p>
								<p class="text-xs text-dark-500">Display warning banners when using demo mode</p>
							</div>
							<label class="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									bind:checked={showDemoWarnings}
									class="sr-only peer"
								/>
								<div class="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
							</label>
						</div>
					</div>

					<div class="mt-6">
						<button onclick={saveSettings} class="btn btn-primary w-full">
							<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
							</svg>
							Save Preferences
						</button>
					</div>
				</div>

				<!-- Data Management -->
				<div class="card">
					<h2 class="text-xl font-bold text-dark-900 mb-4 flex items-center gap-2">
						<svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
						</svg>
						Data Management
					</h2>
					<div class="space-y-4">
						<div class="p-4 bg-danger-50 border border-danger-200 rounded-lg">
							<p class="text-sm font-semibold text-danger-900 mb-3">Clear All History</p>
							<p class="text-xs text-danger-700 mb-4">
								This will permanently delete all your summary history. Saved summaries will also be removed. This action cannot be undone.
							</p>
							{#if !showClearConfirm}
								<button
									onclick={() => showClearConfirm = true}
									class="btn btn-danger"
								>
									<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
									</svg>
									Clear All History
								</button>
							{:else}
								<div class="flex gap-2">
									<button
										onclick={clearHistory}
										class="btn btn-danger flex-1"
									>
										Confirm Delete
									</button>
									<button
										onclick={() => showClearConfirm = false}
										class="btn btn-secondary flex-1"
									>
										Cancel
									</button>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- About -->
				<div class="card">
					<h2 class="text-xl font-bold text-dark-900 mb-4">About</h2>
					<div class="space-y-3 text-sm text-dark-600">
						<div class="flex justify-between">
							<span>Version</span>
							<span class="font-semibold text-dark-900">1.0.0</span>
						</div>
						<div class="flex justify-between">
							<span>AI Model</span>
							<span class="font-semibold text-dark-900">Claude 3.5 Sonnet</span>
						</div>
						<div class="flex justify-between">
							<span>Framework</span>
							<span class="font-semibold text-dark-900">SvelteKit</span>
						</div>
					</div>
					<div class="mt-6 pt-6 border-t border-dark-200">
						<a
							href="/help"
							class="btn btn-secondary w-full"
						>
							<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							View Documentation
						</a>
					</div>
				</div>
			</div>
		</div>

		<Footer isDemoMode={false} />
	</main>
</div>
