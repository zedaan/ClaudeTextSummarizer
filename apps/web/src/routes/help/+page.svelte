<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let sidebarOpen = $state(true);
	let activeDoc = $state('getting-started');
	let markdownContent = $state('');
	let htmlContent = $state('');
	let searchQuery = $state('');
	let isLoading = $state(false);

	const docs = [
		{ id: 'getting-started', title: 'Getting Started', icon: '🚀' },
		{ id: 'claude-api-guide', title: 'Claude API Guide', icon: '🤖' },
		{ id: 'api-reference', title: 'API Reference', icon: '📚' },
		{ id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' },
		{ id: 'faq', title: 'FAQ', icon: '❓' }
	];

	// Configure marked options
	marked.setOptions({
		breaks: true,
		gfm: true,
	});

	async function loadDoc(docId: string) {
		isLoading = true;
		activeDoc = docId;
		try {
			const response = await fetch(`/docs/${docId}.md`);
			if (!response.ok) throw new Error('Failed to load documentation');

			markdownContent = await response.text();
			htmlContent = await marked(markdownContent);
		} catch (error) {
			htmlContent = '<p class="text-danger-600">Failed to load documentation. Please try again.</p>';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		loadDoc(activeDoc);
	});

	// Search functionality
	function highlightSearch(content: string, query: string): string {
		if (!query.trim()) return content;

		const regex = new RegExp(`(${query})`, 'gi');
		return content.replace(regex, '<mark class="bg-warning-200 text-dark-900">$1</mark>');
	}

	let displayContent = $derived(
		searchQuery.trim() ? highlightSearch(htmlContent, searchQuery) : htmlContent
	);

	function scrollToTop() {
		const contentEl = document.getElementById('doc-content');
		if (contentEl) {
			contentEl.scrollTop = 0;
		}
	}

	async function handleDocChange(docId: string) {
		await loadDoc(docId);
		scrollToTop();
	}
</script>

<div class="flex min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
	<Sidebar bind:isOpen={sidebarOpen} />

	<main class="flex-1 transition-all duration-300 {sidebarOpen ? 'ml-72' : 'ml-20'}">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Header -->
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-2">
					<svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
					</svg>
					<h1 class="text-4xl font-bold text-dark-900">Help & Documentation</h1>
				</div>
				<p class="text-dark-600">Learn how to use AI Summarizer and the Claude API</p>
			</div>

			<!-- Search Bar -->
			<div class="mb-6">
				<div class="relative">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search documentation..."
						class="w-full pl-10 pr-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<!-- Sidebar Navigation -->
				<div class="lg:col-span-1">
					<div class="card sticky top-4">
						<h3 class="text-lg font-bold text-dark-900 mb-4">Contents</h3>
						<nav class="space-y-1">
							{#each docs as doc}
								<button
									onclick={() => handleDocChange(doc.id)}
									class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 {activeDoc === doc.id ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-dark-600 hover:bg-dark-50'}"
								>
									<span class="mr-2">{doc.icon}</span>
									{doc.title}
								</button>
							{/each}
						</nav>

						<div class="mt-6 pt-6 border-t border-dark-200">
							<h4 class="text-sm font-semibold text-dark-700 mb-3">Quick Links</h4>
							<div class="space-y-2 text-sm">
								<a
									href="https://console.anthropic.com/"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
								>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
									</svg>
									Anthropic Console
								</a>
								<a
									href="https://docs.anthropic.com/"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
								>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
									</svg>
									Anthropic Docs
								</a>
								<a
									href="https://github.com/zedaan/ClaudeTextSummarizer"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
								>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
									</svg>
									GitHub Repository
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- Main Content -->
				<div class="lg:col-span-3">
					<div class="card">
						{#if isLoading}
							<div class="flex items-center justify-center py-16">
								<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
							</div>
						{:else}
							<div
								id="doc-content"
								class="prose prose-dark max-w-none markdown-content"
							>
								{@html displayContent}
							</div>
						{/if}
					</div>

					<!-- Back to Top Button -->
					{#if !isLoading}
						<button
							onclick={scrollToTop}
							class="fixed bottom-8 right-8 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors z-10"
							title="Back to top"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
							</svg>
						</button>
					{/if}
				</div>
			</div>
		</div>

		<Footer isDemoMode={false} />
	</main>
</div>

<style>
	:global(.markdown-content) {
		color: #1f2937;
		line-height: 1.75;
	}

	:global(.markdown-content h1) {
		font-size: 2.25rem;
		font-weight: 800;
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: #111827;
		border-bottom: 2px solid #e5e7eb;
		padding-bottom: 0.5rem;
	}

	:global(.markdown-content h2) {
		font-size: 1.875rem;
		font-weight: 700;
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	:global(.markdown-content h3) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		color: #374151;
	}

	:global(.markdown-content h4) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
		color: #4b5563;
	}

	:global(.markdown-content p) {
		margin-bottom: 1rem;
	}

	:global(.markdown-content a) {
		color: #3b82f6;
		text-decoration: none;
		font-weight: 500;
	}

	:global(.markdown-content a:hover) {
		color: #2563eb;
		text-decoration: underline;
	}

	:global(.markdown-content ul),
	:global(.markdown-content ol) {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	:global(.markdown-content li) {
		margin-bottom: 0.5rem;
	}

	:global(.markdown-content code) {
		background-color: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: #dc2626;
	}

	:global(.markdown-content pre) {
		background-color: #1f2937;
		color: #f9fafb;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}

	:global(.markdown-content pre code) {
		background-color: transparent;
		padding: 0;
		color: #f9fafb;
	}

	:global(.markdown-content blockquote) {
		border-left: 4px solid #3b82f6;
		padding-left: 1rem;
		margin-left: 0;
		margin-bottom: 1rem;
		color: #6b7280;
		font-style: italic;
	}

	:global(.markdown-content table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1rem;
	}

	:global(.markdown-content th),
	:global(.markdown-content td) {
		border: 1px solid #e5e7eb;
		padding: 0.75rem;
		text-align: left;
	}

	:global(.markdown-content th) {
		background-color: #f3f4f6;
		font-weight: 600;
	}

	:global(.markdown-content tr:nth-child(even)) {
		background-color: #f9fafb;
	}

	:global(.markdown-content hr) {
		border: none;
		border-top: 1px solid #e5e7eb;
		margin: 2rem 0;
	}

	:global(.markdown-content img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin: 1rem 0;
	}

	:global(.markdown-content mark) {
		background-color: #fef3c7;
		padding: 0.125rem 0.25rem;
		border-radius: 0.125rem;
	}

	:global(.markdown-content strong) {
		font-weight: 700;
		color: #111827;
	}

	:global(.markdown-content em) {
		font-style: italic;
	}
</style>
