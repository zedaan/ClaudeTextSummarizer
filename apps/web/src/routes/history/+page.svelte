<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { summaryStore, type Summary } from '$lib/stores/summaryStore';

	let sidebarOpen = $state(true);
	let summaries = $state<Summary[]>([]);
	let searchQuery = $state('');
	let selectedSummary = $state<Summary | null>(null);

	// Subscribe to store
	$effect(() => {
		const unsubscribe = summaryStore.subscribe(s => {
			summaries = s;
		});
		return unsubscribe;
	});

	// Filtered summaries based on search
	let filteredSummaries = $derived(
		searchQuery.trim() === ''
			? summaries
			: summaries.filter(s =>
					s.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
					s.summary.toLowerCase().includes(searchQuery.toLowerCase())
			  )
	);

	function formatDate(timestamp: number): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(timestamp));
	}

	function deleteSummary(id: string) {
		if (confirm('Are you sure you want to delete this summary?')) {
			summaryStore.deleteSummary(id);
			if (selectedSummary?.id === id) {
				selectedSummary = null;
			}
		}
	}

	function toggleSave(id: string) {
		summaryStore.toggleSave(id);
	}

	function clearAllHistory() {
		if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
			summaryStore.clearHistory();
			selectedSummary = null;
		}
	}

	async function exportToJSON() {
		const dataStr = JSON.stringify(summaries, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `summary-history-${Date.now()}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="flex min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
	<Sidebar bind:isOpen={sidebarOpen} />

	<main class="flex-1 transition-all duration-300 {sidebarOpen ? 'ml-72' : 'ml-20'}">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-dark-900 mb-2">Summary History</h1>
				<p class="text-dark-600">View and manage all your generated summaries</p>
			</div>

			<!-- Search and Actions -->
			<div class="mb-6 flex flex-col sm:flex-row gap-4">
				<div class="flex-1 relative">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search summaries..."
						class="w-full pl-10 pr-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					/>
				</div>
				<div class="flex gap-2">
					<button
						onclick={exportToJSON}
						disabled={summaries.length === 0}
						class="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
						</svg>
						Export
					</button>
					<button
						onclick={clearAllHistory}
						disabled={summaries.length === 0}
						class="btn btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
						</svg>
						Clear All
					</button>
				</div>
			</div>

			<!-- Content -->
			{#if filteredSummaries.length === 0}
				<div class="text-center py-16">
					<div class="inline-flex items-center justify-center w-16 h-16 bg-dark-100 rounded-full mb-4">
						<svg class="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-dark-700 mb-2">
						{searchQuery ? 'No matching summaries' : 'No summary history yet'}
					</h3>
					<p class="text-dark-500 mb-6">
						{searchQuery ? 'Try a different search term' : 'Start creating summaries to see them here'}
					</p>
					{#if !searchQuery}
						<a href="/" class="btn btn-primary">
							<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
							</svg>
							Create Summary
						</a>
					{/if}
				</div>
			{:else}
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<!-- Summary List -->
					<div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
						{#each filteredSummaries as summary (summary.id)}
							<div
								class="card cursor-pointer hover:shadow-lg transition-shadow {selectedSummary?.id === summary.id ? 'ring-2 ring-primary-500' : ''}"
								onclick={() => selectedSummary = summary}
								role="button"
								tabindex="0"
								onkeydown={(e) => e.key === 'Enter' && (selectedSummary = summary)}
							>
								<div class="flex items-start justify-between mb-3">
									<div class="flex-1">
										<div class="flex items-center gap-2 mb-1">
											<span class="text-xs font-semibold text-dark-500">{formatDate(summary.timestamp)}</span>
											{#if summary.demoMode}
												<span class="px-2 py-0.5 bg-warning-100 text-warning-700 rounded text-xs font-semibold">Demo</span>
											{/if}
										</div>
										<p class="text-sm text-dark-700 line-clamp-2">{summary.originalText}</p>
									</div>
									<button
										onclick={(e) => { e.stopPropagation(); toggleSave(summary.id); }}
										class="ml-2 p-2 hover:bg-dark-100 rounded-lg transition-colors"
										title={summary.isSaved ? 'Remove from saved' : 'Save summary'}
									>
										{#if summary.isSaved}
											<svg class="w-5 h-5 text-warning-600" fill="currentColor" viewBox="0 0 24 24">
												<path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
											</svg>
										{:else}
											<svg class="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
											</svg>
										{/if}
									</button>
								</div>
								<div class="flex items-center gap-4 text-xs text-dark-500">
									<span>{summary.wordCount} words</span>
									<span>→</span>
									<span>{summary.summaryLength} word summary</span>
								</div>
							</div>
						{/each}
					</div>

					<!-- Summary Detail -->
					<div class="sticky top-4">
						{#if selectedSummary}
							<div class="card h-fit">
								<div class="flex items-center justify-between mb-4">
									<h3 class="text-lg font-bold text-dark-900">Summary Details</h3>
									<button
										onclick={() => deleteSummary(selectedSummary!.id)}
										class="p-2 hover:bg-danger-50 hover:text-danger-600 rounded-lg transition-colors"
										title="Delete summary"
									>
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
										</svg>
									</button>
								</div>

								<div class="space-y-4">
									<div>
										<label class="block text-sm font-semibold text-dark-700 mb-2">Original Text</label>
										<div class="p-3 bg-dark-50 rounded-lg max-h-48 overflow-y-auto">
											<p class="text-sm text-dark-800 whitespace-pre-wrap">{selectedSummary.originalText}</p>
										</div>
									</div>

									<div>
										<label class="block text-sm font-semibold text-dark-700 mb-2">Summary</label>
										<div class="p-3 bg-primary-50 rounded-lg max-h-48 overflow-y-auto">
											<p class="text-sm text-dark-800 whitespace-pre-wrap">{selectedSummary.summary}</p>
										</div>
									</div>

									<div class="grid grid-cols-2 gap-4 pt-4 border-t border-dark-200">
										<div>
											<span class="text-xs text-dark-500">Created</span>
											<p class="text-sm font-semibold text-dark-900">{formatDate(selectedSummary.timestamp)}</p>
										</div>
										<div>
											<span class="text-xs text-dark-500">Word Count</span>
											<p class="text-sm font-semibold text-dark-900">{selectedSummary.wordCount} → {selectedSummary.summaryLength}</p>
										</div>
									</div>
								</div>
							</div>
						{:else}
							<div class="card text-center py-12">
								<svg class="w-16 h-16 text-dark-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
								</svg>
								<p class="text-dark-500">Select a summary to view details</p>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<Footer isDemoMode={false} />
	</main>
</div>
