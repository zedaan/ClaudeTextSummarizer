<script lang="ts">
	import { onMount } from 'svelte';

	// State
	let textInput = $state('');
	let summaryLength = $state(10);
	let summaryOutput = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let copyFeedback = $state<'success' | 'failure' | ''>('');
	let isDemoMode = $state(false);
	let charCount = $derived(textInput.length);
	let wordCount = $derived(textInput.trim().split(/\s+/).filter(w => w.length > 0).length);

	// Derived state
	let hasInput = $derived(textInput.trim() !== '');
	let hasSummary = $derived(summaryOutput.trim() !== '');
	let hasError = $derived(errorMessage !== '');

	onMount(() => {
		const textarea = document.getElementById('text-input-area');
		textarea?.focus();
	});

	async function summarize() {
		if (!hasInput) return;

		isLoading = true;
		errorMessage = '';
		summaryOutput = '';

		try {
			const response = await fetch('/api/summarize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: textInput,
					maxWords: summaryLength
				})
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to summarize text');
			}

			const data = await response.json();
			summaryOutput = data.summary;
			isDemoMode = data.demoMode || false;
		} catch (err) {
			errorMessage = `There was an error processing the text: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			isLoading = false;
		}
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(summaryOutput);
			copyFeedback = 'success';
			setTimeout(() => {
				copyFeedback = '';
			}, 3000);
		} catch (err) {
			copyFeedback = 'failure';
			setTimeout(() => {
				copyFeedback = '';
			}, 3000);
		}
	}

	function clear() {
		textInput = '';
		summaryOutput = '';
		errorMessage = '';
		isDemoMode = false;
		const textarea = document.getElementById('text-input-area');
		textarea?.focus();
	}

	function dismissError() {
		errorMessage = '';
		clear();
	}

	function handleInput() {
		const textarea = document.getElementById('text-input-area') as HTMLTextAreaElement;
		if (textarea) {
			setTimeout(() => {
				textarea.scrollTop = 0;
			}, 0);
		}
	}
</script>

<svelte:head>
	<title>AI Text Summarizer - Dashboard</title>
	<meta name="description" content="Professional AI-powered text summarization with Claude AI" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-dark-50 via-primary-50 to-secondary-50">
	<!-- Demo Mode Banner -->
	{#if isDemoMode}
		<div class="bg-warning-500 text-white px-6 py-3 text-center font-medium shadow-lg animate-slide-in">
			⚠️ DEMO MODE - Mock summaries only. 
			<a href="https://console.anthropic.com/settings/billing" target="_blank" rel="noopener noreferrer" class="underline font-bold hover:text-warning-100 transition-colors ml-2">
				Add Credits →
			</a>
		</div>
	{/if}

	<!-- Header -->
	<header class="bg-white shadow-sm border-b border-dark-100">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
						<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
						</svg>
					</div>
					<div>
						<h1 class="text-2xl font-bold text-dark-900 font-display">AI Summarizer</h1>
						<p class="text-sm text-dark-500">Powered by Claude AI</p>
					</div>
				</div>
				<div class="flex items-center space-x-4">
					{#if isDemoMode}
						<span class="px-4 py-2 bg-warning-100 text-warning-800 rounded-lg font-semibold text-sm">
							Demo Mode
						</span>
					{:else}
						<span class="px-4 py-2 bg-success-100 text-success-800 rounded-lg font-semibold text-sm">
							Live
						</span>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Input Card -->
			<div class="card animate-slide-in">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-bold text-dark-900">Input Text</h2>
					<div class="text-sm text-dark-500">
						<span class="font-medium">{wordCount}</span> words • 
						<span class="font-medium">{charCount}</span> chars
					</div>
				</div>
				
				<textarea
					id="text-input-area"
					bind:value={textInput}
					oninput={handleInput}
					placeholder="Paste your text here to summarize..."
					class="w-full h-64 p-4 border border-dark-200 rounded-lg focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all resize-none font-sans text-dark-900 placeholder:text-dark-400"
				></textarea>

				<!-- Settings -->
				<div class="mt-6 space-y-4">
					<div>
						<div class="flex items-center justify-between mb-2">
							<label class="text-sm font-semibold text-dark-700">Summary Length</label>
							<span class="text-sm font-bold text-primary-600">{summaryLength} words</span>
						</div>
						<input
							type="range"
							bind:value={summaryLength}
							min="1"
							max="100"
							disabled={!hasInput}
							class="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 accent-primary-600"
						/>
						<div class="flex justify-between text-xs text-dark-500 mt-1">
							<span>1</span>
							<span>50</span>
							<span>100</span>
						</div>
					</div>

					<button
						onclick={summarize}
						disabled={!hasInput || isLoading}
						class="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
					>
						{#if isLoading}
							<svg class="animate-spin h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Summarizing...
						{:else}
							<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
							</svg>
							Summarize Text
						{/if}
					</button>
				</div>
			</div>

			<!-- Output Card -->
			<div class="card animate-slide-in relative">
				{#if hasError}
					<!-- Error State -->
					<div class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white rounded-xl">
						<div class="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mb-4">
							<svg class="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-dark-900 mb-2">Error</h3>
						<p class="text-center text-dark-600 mb-6 max-w-md">{errorMessage}</p>
						<button onclick={dismissError} class="btn btn-danger">
							Dismiss & Try Again
						</button>
					</div>
				{:else if isLoading}
					<!-- Loading State -->
					<div class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white rounded-xl">
						<div class="w-16 h-16 mb-4">
							<svg class="animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-dark-900 mb-2">Processing...</h3>
						<p class="text-center text-dark-600">Analyzing and summarizing your text</p>
					</div>
				{:else}
					<!-- Output State -->
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-xl font-bold text-dark-900">Summary</h2>
						{#if hasSummary}
							<span class="px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-semibold">
								Ready
							</span>
						{/if}
					</div>

					<textarea
						id="summary-output-area"
						bind:value={summaryOutput}
						placeholder="Your summary will appear here..."
						readonly
						class="w-full h-64 p-4 border border-dark-200 rounded-lg bg-dark-50 font-sans text-dark-900 placeholder:text-dark-400 resize-none"
					></textarea>

					<!-- Actions -->
					<div class="mt-6 flex gap-3">
						<button
							onclick={copy}
							disabled={!hasSummary}
							class="btn btn-success flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{#if copyFeedback === 'success'}
								<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
								</svg>
								Copied!
							{:else if copyFeedback === 'failure'}
								<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
								</svg>
								Failed
							{:else}
								<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
								</svg>
								Copy to Clipboard
							{/if}
						</button>

						<button
							onclick={clear}
							disabled={!hasInput && !hasSummary}
							class="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
							</svg>
							Clear
						</button>
					</div>
				{/if}
			</div>
		</div>

		<!-- Info Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
			<div class="card animate-fade-in">
				<div class="flex items-center space-x-3">
					<div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
						</svg>
					</div>
					<div>
						<p class="text-sm text-dark-500">AI Model</p>
						<p class="text-lg font-bold text-dark-900">Claude 3.5</p>
					</div>
				</div>
			</div>

			<div class="card animate-fade-in">
				<div class="flex items-center space-x-3">
					<div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<div>
						<p class="text-sm text-dark-500">Processing</p>
						<p class="text-lg font-bold text-dark-900">~2-3 sec</p>
					</div>
				</div>
			</div>

			<div class="card animate-fade-in">
				<div class="flex items-center space-x-3">
					<div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
						</svg>
					</div>
					<div>
						<p class="text-sm text-dark-500">Security</p>
						<p class="text-lg font-bold text-dark-900">Encrypted</p>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
