<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FormCard from '$lib/components/FormCard.svelte';
	import { usageStats, last7DaysUsage } from '$lib/stores/usageStore';

	let sidebarOpen = $state(true);
	let stats = $state({
		totalRequests: 0,
		totalInputTokens: 0,
		totalOutputTokens: 0,
		totalCost: 0,
		currentTier: 'Tier 1' as 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4',
		rateLimit: 50
	});
	let weeklyUsage = $state<Array<{ date: string; requests: number; inputTokens: number; outputTokens: number; estimatedCost: number }>>([]);

	// Subscribe to usage stats
	$effect(() => {
		const unsubStats = usageStats.subscribe(s => {
			stats = { ...s };
		});
		const unsubWeekly = last7DaysUsage.subscribe(w => {
			weeklyUsage = [...w];
		});
		return () => {
			unsubStats();
			unsubWeekly();
		};
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 4
		}).format(amount);
	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat('en-US').format(num);
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function getTierColor(tier: string): string {
		switch (tier) {
			case 'Tier 1': return 'primary';
			case 'Tier 2': return 'secondary';
			case 'Tier 3': return 'warning';
			case 'Tier 4': return 'success';
			default: return 'dark';
		}
	}

	let maxRequests = $derived(Math.max(...weeklyUsage.map(d => d.requests), 1));
</script>

<div class="flex min-h-screen bg-gradient-to-br from-warning-50 via-white to-success-50">
	<Sidebar bind:isOpen={sidebarOpen} />

	<main class="flex-1 transition-all duration-300 {sidebarOpen ? 'ml-72' : 'ml-20'}">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Header -->
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-2">
					<svg class="w-10 h-10 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
					</svg>
					<h1 class="text-4xl font-bold text-dark-900">Usage & Billing</h1>
				</div>
				<p class="text-dark-600">Monitor your API usage and estimated costs</p>
			</div>

			<div class="space-y-6">
				<!-- Current Plan -->
				<FormCard title="Current Plan">
					{#snippet children()}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="p-6 bg-gradient-to-br from-{getTierColor(stats.currentTier)}-50 to-{getTierColor(stats.currentTier)}-100 rounded-lg border-2 border-{getTierColor(stats.currentTier)}-200">
								<div class="flex items-center justify-between mb-4">
									<span class="text-sm font-semibold text-dark-700">Your Tier</span>
									<svg class="w-6 h-6 text-{getTierColor(stats.currentTier)}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
									</svg>
								</div>
								<p class="text-3xl font-bold text-{getTierColor(stats.currentTier)}-700 mb-1">{stats.currentTier}</p>
								<p class="text-xs text-dark-600">Rate Limit: {formatNumber(stats.rateLimit)} req/min</p>
							</div>

							<div class="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
								<div class="flex items-center justify-between mb-4">
									<span class="text-sm font-semibold text-dark-700">Model</span>
									<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
									</svg>
								</div>
								<p class="text-xl font-bold text-primary-700 mb-1">Claude 3.5 Sonnet</p>
								<p class="text-xs text-dark-600">Production-ready AI model</p>
							</div>
						</div>

						<div class="p-4 bg-warning-50 border border-warning-200 rounded-lg">
							<div class="flex items-start gap-3">
								<svg class="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
								</svg>
								<div class="flex-1">
									<p class="text-sm font-semibold text-warning-800">Pricing Information</p>
									<p class="text-xs text-warning-700 mt-1">
										Input: $3.00 per 1M tokens • Output: $15.00 per 1M tokens
									</p>
									<a
										href="https://console.anthropic.com/settings/billing"
										target="_blank"
										rel="noopener noreferrer"
										class="text-xs text-warning-800 font-semibold hover:underline mt-2 inline-flex items-center gap-1"
									>
										Manage Billing
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
										</svg>
									</a>
								</div>
							</div>
						</div>
					{/snippet}
				</FormCard>

				<!-- Usage Statistics -->
				<FormCard title="Usage Statistics (All Time)">
					{#snippet children()}
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div class="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-semibold text-dark-700">Total Requests</span>
									<svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
									</svg>
								</div>
								<p class="text-3xl font-bold text-primary-700">{formatNumber(stats.totalRequests)}</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-semibold text-dark-700">Input Tokens</span>
									<svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
									</svg>
								</div>
								<p class="text-3xl font-bold text-secondary-700">{formatNumber(stats.totalInputTokens)}</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-warning-50 to-warning-100 rounded-lg">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-semibold text-dark-700">Output Tokens</span>
									<svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
									</svg>
								</div>
								<p class="text-3xl font-bold text-warning-700">{formatNumber(stats.totalOutputTokens)}</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-lg">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-semibold text-dark-700">Estimated Cost</span>
									<svg class="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
								</div>
								<p class="text-3xl font-bold text-success-700">{formatCurrency(stats.totalCost)}</p>
							</div>
						</div>
					{/snippet}
				</FormCard>

				<!-- Last 7 Days Usage Chart -->
				<FormCard title="Last 7 Days Usage">
					{#snippet children()}
						{#if weeklyUsage.length > 0 && weeklyUsage.some(d => d.requests > 0)}
							<div class="space-y-3">
								{#each weeklyUsage as day}
									<div class="space-y-1">
										<div class="flex items-center justify-between text-sm">
											<span class="font-medium text-dark-700">{formatDate(day.date)}</span>
											<span class="text-dark-600">{day.requests} requests • {formatCurrency(day.estimatedCost)}</span>
										</div>
										<div class="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
											<div
												class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
												style="width: {day.requests > 0 ? (day.requests / maxRequests * 100) : 0}%"
											></div>
										</div>
										<div class="flex items-center justify-between text-xs text-dark-500">
											<span>Input: {formatNumber(day.inputTokens)} • Output: {formatNumber(day.outputTokens)}</span>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="text-center py-12">
								<svg class="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
								</svg>
								<p class="text-dark-600 font-medium">No usage data yet</p>
								<p class="text-sm text-dark-500 mt-1">Start creating summaries to see your usage statistics</p>
							</div>
						{/if}
					{/snippet}
				</FormCard>

				<!-- API Key Management -->
				<FormCard title="API Key Management">
					{#snippet children()}
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-semibold text-dark-700 mb-2">
									Your API Key
								</label>
								<div class="flex gap-2">
									<input
										type="password"
										value="sk-ant-api03-••••••••••••••••••••••••••••"
										readonly
										class="flex-1 px-4 py-3 border border-dark-300 rounded-lg bg-dark-50 cursor-not-allowed"
									/>
									<a
										href="https://console.anthropic.com/settings/keys"
										target="_blank"
										rel="noopener noreferrer"
										class="btn btn-secondary whitespace-nowrap"
									>
										<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
										</svg>
										Manage Keys
									</a>
								</div>
								<p class="text-xs text-dark-500 mt-2">
									Configure your API key in the .env file. Visit the Anthropic Console to regenerate or create new keys.
								</p>
							</div>

							<div class="p-4 bg-primary-50 border border-primary-200 rounded-lg">
								<div class="flex items-start gap-3">
									<svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
									<div>
										<p class="text-sm font-semibold text-primary-900">API Key Security</p>
										<ul class="text-xs text-primary-700 mt-1 space-y-1 list-disc list-inside">
											<li>Never share your API key publicly</li>
											<li>Rotate keys regularly for security</li>
											<li>Use environment variables for key storage</li>
											<li>Monitor usage for unexpected activity</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					{/snippet}
				</FormCard>

				<!-- Quick Links -->
				<FormCard title="Helpful Resources">
					{#snippet children()}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
							<a
								href="https://console.anthropic.com/settings/usage"
								target="_blank"
								rel="noopener noreferrer"
								class="p-4 border-2 border-dark-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
							>
								<div class="flex items-center gap-3">
									<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
									</svg>
									<div>
										<p class="text-sm font-semibold text-dark-900">View Real Usage</p>
										<p class="text-xs text-dark-500">Check actual usage in Anthropic Console</p>
									</div>
								</div>
							</a>

							<a
								href="https://console.anthropic.com/settings/billing"
								target="_blank"
								rel="noopener noreferrer"
								class="p-4 border-2 border-dark-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
							>
								<div class="flex items-center gap-3">
									<svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
									</svg>
									<div>
										<p class="text-sm font-semibold text-dark-900">Manage Billing</p>
										<p class="text-xs text-dark-500">Add credits or change your plan</p>
									</div>
								</div>
							</a>

							<a
								href="https://docs.anthropic.com/en/api/rate-limits"
								target="_blank"
								rel="noopener noreferrer"
								class="p-4 border-2 border-dark-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
							>
								<div class="flex items-center gap-3">
									<svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
									</svg>
									<div>
										<p class="text-sm font-semibold text-dark-900">API Documentation</p>
										<p class="text-xs text-dark-500">Learn about rate limits and pricing</p>
									</div>
								</div>
							</a>

							<a
								href="/help"
								class="p-4 border-2 border-dark-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
							>
								<div class="flex items-center gap-3">
									<svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
									<div>
										<p class="text-sm font-semibold text-dark-900">Help & Support</p>
										<p class="text-xs text-dark-500">Get help with billing questions</p>
									</div>
								</div>
							</a>
						</div>
					{/snippet}
				</FormCard>
			</div>
		</div>

		<Footer isDemoMode={false} />
	</main>
</div>
