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
	<title>Summarizer</title>
	<meta name="description" content="Summarize your text effortlessly with the Summarizer." />
</svelte:head>

<div class="flex flex-col items-center min-h-screen bg-app-bg">
	<!-- Demo Mode Banner -->
	{#if isDemoMode}
		<div class="w-full bg-yellow-400 text-black px-4 py-2 text-center font-bold text-sm">
			⚠️ DEMO MODE - Mock summaries only. Add Anthropic credits to use real AI.
			<a href="https://console.anthropic.com/settings/billing" target="_blank" rel="noopener noreferrer" class="underline ml-2">Add Credits →</a>
		</div>
	{/if}

	<header class="relative w-full">
		<img class="w-full block" src="/images/cool-dog.webp" alt="Cool dog with sunglasses on" />
		<h1 class="absolute top-[0.5vh] left-[5.5vw] font-bold font-orbitron">
			<span class="block text-[clamp(0.6rem,5vw,5rem)] leading-[1.6]">The</span>
			<span class="text-[clamp(1.8rem,8vw,8rem)] leading-[1.2]">Summarizer</span>
		</h1>
	</header>

	<main class="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 w-full h-full p-3.5 gap-3.5">
		<!-- Input Section -->
		<section class="flex flex-col w-full">
			<textarea
				id="text-input-area"
				bind:value={textInput}
				oninput={handleInput}
				placeholder="Paste text here"
				aria-label="Paste text here to summarize"
				class="w-full flex-grow min-h-[8.75em] resize-none border-none rounded-md bg-app-input p-3 mb-3.5 font-sans text-app-text placeholder:text-app-text focus:outline-2 focus:outline-app-focus"
			></textarea>

			<div class="flex flex-col sm:flex-row justify-between gap-3.5 w-full">
				<!-- Summary Length Control -->
				<div class="flex flex-col justify-between flex-grow sm:flex-grow-[0.8] font-bold {hasInput ? '' : 'text-app-disabled'}">
					<div class="flex items-center gap-2 w-full">
						<span class="text-app-text">1</span>
						<input
							type="range"
							id="summary-length-input"
							bind:value={summaryLength}
							min="1"
							max="100"
							disabled={!hasInput}
							class="flex-grow appearance-none h-3 rounded-[15px] bg-app-button disabled:cursor-not-allowed enabled:hover:bg-app-hover focus:outline-2 focus:outline-app-focus [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-app-focus [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:disabled:bg-app-disabled [&::-webkit-slider-thumb]:disabled:cursor-not-allowed [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-app-focus [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:disabled:bg-app-disabled [&::-moz-range-thumb]:disabled:cursor-not-allowed"
						/>
						<span class="text-app-text">100</span>
					</div>
					<span id="summary-length-text" class="text-xs">Summary Length: {summaryLength} Words</span>
				</div>

				<!-- Summarize Button -->
				<button
					id="summarize-button"
					onclick={summarize}
					disabled={!hasInput}
					class="font-orbitron font-bold bg-app-button border-none rounded-md px-4 h-10 flex items-center justify-center sm:flex-[0_0_40%] disabled:text-app-disabled disabled:cursor-not-allowed enabled:hover:bg-app-hover enabled:hover:cursor-pointer focus:outline-2 focus:outline-app-focus"
				>
					Summarize
				</button>
			</div>
		</section>

		<!-- Output Section -->
		<section id="summary-output-section" class="relative w-full">
			<!-- Summary Content -->
			<div
				id="summary-content"
				class="absolute top-0 left-0 w-full h-full flex flex-col z-10"
				class:hidden={isLoading || hasError}
			>
				<textarea
					id="summary-output-area"
					bind:value={summaryOutput}
					placeholder="See summary here"
					aria-label="Summary of text"
					disabled
					class="w-full flex-grow min-h-[8.75em] resize-none border-none rounded-md bg-app-input p-3 mb-3.5 font-sans text-app-text placeholder:text-app-text disabled:text-app-disabled disabled:placeholder:text-app-disabled"
				></textarea>

				<div class="flex flex-col gap-3.5 w-full">
					<button
						id="copy-button"
						onclick={copy}
						disabled={!hasSummary}
						class="w-full font-orbitron font-bold bg-app-button border-none rounded-md px-3 h-10 flex items-center justify-center disabled:text-app-disabled disabled:cursor-not-allowed enabled:hover:bg-app-hover enabled:hover:cursor-pointer focus:outline-2 focus:outline-app-focus {copyFeedback === 'success' ? '!bg-app-copied' : ''} {copyFeedback === 'failure' ? '!bg-app-failed' : ''}"
					>
						{copyFeedback === 'success' ? '😄 Copied' : copyFeedback === 'failure' ? '😔 Failed' : 'Copy'}
					</button>

					<button
						id="clear-button"
						onclick={clear}
						disabled={!hasInput}
						class="w-full font-orbitron font-bold bg-app-button border-none rounded-md px-3 h-10 flex items-center justify-center disabled:text-app-disabled disabled:cursor-not-allowed enabled:hover:bg-app-hover enabled:hover:cursor-pointer focus:outline-2 focus:outline-app-focus"
					>
						Clear
					</button>
				</div>
			</div>

			<!-- Loading Section -->
			{#if isLoading}
				<div
					id="loading-section"
					class="absolute top-0 left-0 w-full h-full flex flex-col z-20 justify-center items-center bg-app-bg"
					aria-live="polite"
				>
					<img src="/images/loading-spinner.svg" alt="Loading spinner" class="max-w-[100px] max-h-[100px] w-auto h-auto" />
					<div id="loading-message" class="mt-4 font-bold">Summarizing...</div>
				</div>
			{/if}

			<!-- Error Section -->
			{#if hasError}
				<div
					id="error-section"
					class="absolute top-0 left-0 w-full h-full flex flex-col z-20 justify-center items-center bg-app-bg"
					aria-live="assertive"
				>
					<div id="error-message" class="w-full break-words mb-4 font-bold text-center px-4">
						{errorMessage}
					</div>
					<button
						id="dismiss-error-button"
						onclick={dismissError}
						class="w-full max-w-md font-orbitron font-bold bg-app-button border-none rounded-md px-3 h-10 flex items-center justify-center hover:bg-app-hover hover:cursor-pointer focus:outline-2 focus:outline-app-focus"
					>
						Dismiss Error
					</button>
				</div>
			{/if}
		</section>
	</main>
</div>
