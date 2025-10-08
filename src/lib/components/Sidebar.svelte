<script lang="ts">
	import Logo from './Logo.svelte';
	import { summaryStats } from '$lib/stores/summaryStore';
	import { page } from '$app/stores';

	interface Props {
		isOpen?: boolean;
	}

	let { isOpen = $bindable(true) }: Props = $props();

	let stats = $state({ total: 0, saved: 0, totalWords: 0 });
	let currentPath = $state('');

	// Subscribe to stats
	$effect(() => {
		const unsubscribe = summaryStats.subscribe(s => {
			stats = s;
		});
		return unsubscribe;
	});

	// Subscribe to page changes
	$effect(() => {
		const unsubscribe = page.subscribe(p => {
			currentPath = p.url.pathname;
		});
		return unsubscribe;
	});

	const navItems = [
		{ icon: 'home', label: 'Dashboard', href: '/' },
		{ icon: 'clock', label: 'History', href: '/history' },
		{ icon: 'bookmark', label: 'Saved', href: '/saved' },
		{ icon: 'settings', label: 'Settings', href: '/settings' },
		{ icon: 'help', label: 'Help & Docs', href: '/help' }
	];

	function isActive(href: string): boolean {
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}

	// User menu state
	let userMenuOpen = $state(false);

	function toggleSidebar() {
		isOpen = !isOpen;
	}

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	function handleMenuAction(action: string) {
		userMenuOpen = false;
		// Navigate to different pages
		switch (action) {
			case 'profile':
				window.location.href = '/profile';
				break;
			case 'settings':
				window.location.href = '/account';
				break;
			case 'password':
				window.location.href = '/password';
				break;
			case 'preferences':
				window.location.href = '/preferences';
				break;
			case 'billing':
				window.location.href = '/billing';
				break;
			case 'logout':
				// Simulate logout
				if (confirm('Are you sure you want to logout?')) {
					alert('Logout functionality would be implemented here. This would clear your session and redirect to login.');
				}
				break;
		}
	}
</script>

<!-- Sidebar -->
<aside
	class="fixed left-0 top-0 h-full bg-white border-r border-dark-200 shadow-xl transition-all duration-300 z-40 {isOpen ? 'w-72' : 'w-20'}"
>
	<!-- Sidebar Header -->
	<div class="p-4 border-b border-dark-200">
		{#if isOpen}
			<Logo size="sm" />
		{:else}
			<Logo size="sm" variant="icon-only" showText={false} />
		{/if}
	</div>

	<!-- Navigation -->
	<nav class="p-4 space-y-2">
		{#each navItems as item}
			<a
				href={item.href}
				data-sveltekit-preload-data="hover"
				class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group {isActive(item.href) ? 'bg-primary-50 text-primary-700' : 'text-dark-600 hover:bg-dark-50'}"
			>
				<!-- Icon -->
				<div class="flex-shrink-0">
					{#if item.icon === 'home'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
						</svg>
					{:else if item.icon === 'clock'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					{:else if item.icon === 'bookmark'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
						</svg>
					{:else if item.icon === 'settings'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
						</svg>
					{:else if item.icon === 'help'}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					{/if}
				</div>

				<!-- Label -->
				{#if isOpen}
					<span class="flex-1 font-medium">{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>

	{#if isOpen}
		<!-- Stats Card -->
		<div class="mx-4 my-6 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
			<h3 class="text-sm font-semibold text-dark-700 mb-3">Usage Stats</h3>
			<div class="space-y-2">
				<div class="flex justify-between items-center">
					<span class="text-xs text-dark-600">Total Summaries</span>
					<span class="text-sm font-bold text-primary-700">{stats.total}</span>
				</div>
				<div class="flex justify-between items-center">
					<span class="text-xs text-dark-600">Saved</span>
					<span class="text-sm font-bold text-warning-700">{stats.saved}</span>
				</div>
				<div class="flex justify-between items-center">
					<span class="text-xs text-dark-600">Words Processed</span>
					<span class="text-sm font-bold text-secondary-700">{stats.totalWords >= 1000 ? `${(stats.totalWords / 1000).toFixed(1)}K` : stats.totalWords}</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- User Menu at Bottom -->
	<div class="absolute bottom-0 left-0 right-0 border-t border-dark-200 bg-white">
		{#if isOpen}
			<!-- Expanded User Menu -->
			<div class="relative">
				<button
					onclick={toggleUserMenu}
					class="w-full p-4 flex items-center space-x-3 hover:bg-dark-50 transition-colors cursor-pointer"
				>
					<div class="relative">
						<img
							src="/images/cool-dog.webp"
							alt="AI Assistant"
							class="w-12 h-12 rounded-full border-2 border-primary-300 transform transition-all duration-300"
						/>
						<div class="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white animate-pulse"></div>
					</div>
					<div class="flex-1 text-left">
						<p class="text-sm font-semibold text-dark-900">Your AI Assistant</p>
						<p class="text-xs text-dark-500">Ready to help!</p>
					</div>
					<svg
						class="w-4 h-4 text-dark-400 transform transition-transform {userMenuOpen ? 'rotate-180' : ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
					</svg>
				</button>

				<!-- Dropdown Menu -->
				{#if userMenuOpen}
					<div class="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-white rounded-lg shadow-2xl border border-dark-200 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
						<button
							onclick={() => handleMenuAction('profile')}
							class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
						>
							<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
							</svg>
							<span class="text-sm font-medium text-dark-900">View Profile</span>
						</button>

						<button
							onclick={() => handleMenuAction('settings')}
							class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
						>
							<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
							</svg>
							<span class="text-sm font-medium text-dark-900">Account Settings</span>
						</button>

						<button
							onclick={() => handleMenuAction('password')}
							class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
						>
							<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
							</svg>
							<span class="text-sm font-medium text-dark-900">Change Password</span>
						</button>

						<button
							onclick={() => handleMenuAction('preferences')}
							class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
						>
							<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
							</svg>
							<span class="text-sm font-medium text-dark-900">Preferences</span>
						</button>

						<button
							onclick={() => handleMenuAction('billing')}
							class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
						>
							<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
							</svg>
							<span class="text-sm font-medium text-dark-900">Usage & Billing</span>
						</button>

						<div class="border-t border-dark-200 my-2"></div>

						<button
							onclick={() => handleMenuAction('logout')}
							class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-danger-50 transition-colors text-left"
						>
							<svg class="w-5 h-5 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
							</svg>
							<span class="text-sm font-medium text-danger-600">Logout</span>
						</button>
					</div>

					<!-- Overlay to close menu -->
					<div
						class="fixed inset-0 z-40"
						onclick={() => userMenuOpen = false}
						role="button"
						tabindex="-1"
					></div>
				{/if}
			</div>
		{:else}
			<!-- Collapsed User Menu -->
			<button
				onclick={toggleUserMenu}
				class="w-full p-4 flex justify-center hover:bg-dark-50 transition-colors"
			>
				<div class="relative">
					<img
						src="/images/cool-dog.webp"
						alt="AI Assistant"
						class="w-10 h-10 rounded-full border-2 border-primary-300 hover:scale-110 transition-transform duration-300"
					/>
					<div class="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white animate-pulse"></div>
				</div>
			</button>

			<!-- Collapsed Dropdown Menu -->
			{#if userMenuOpen}
				<div class="absolute bottom-full left-full ml-2 mb-4 bg-white rounded-lg shadow-2xl border border-dark-200 py-2 z-50 w-56 animate-in fade-in slide-in-from-left-2 duration-200">
					<button
						onclick={() => handleMenuAction('profile')}
						class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
					>
						<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
						</svg>
						<span class="text-sm font-medium text-dark-900">View Profile</span>
					</button>

					<button
						onclick={() => handleMenuAction('settings')}
						class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
					>
						<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
						</svg>
						<span class="text-sm font-medium text-dark-900">Account Settings</span>
					</button>

					<button
						onclick={() => handleMenuAction('password')}
						class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
					>
						<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
						</svg>
						<span class="text-sm font-medium text-dark-900">Change Password</span>
					</button>

					<button
						onclick={() => handleMenuAction('preferences')}
						class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
					>
						<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
						</svg>
						<span class="text-sm font-medium text-dark-900">Preferences</span>
					</button>

					<button
						onclick={() => handleMenuAction('billing')}
						class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
					>
						<svg class="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
						</svg>
						<span class="text-sm font-medium text-dark-900">Usage & Billing</span>
					</button>

					<div class="border-t border-dark-200 my-2"></div>

					<button
						onclick={() => handleMenuAction('logout')}
						class="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-danger-50 transition-colors text-left"
					>
						<svg class="w-5 h-5 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
						</svg>
						<span class="text-sm font-medium text-danger-600">Logout</span>
					</button>
				</div>

				<!-- Overlay to close menu -->
				<div
					class="fixed inset-0 z-40"
					onclick={() => userMenuOpen = false}
					role="button"
					tabindex="-1"
				></div>
			{/if}
		{/if}
	</div>

	<!-- Toggle Button -->
	<button
		onclick={toggleSidebar}
		class="absolute -right-3 top-8 w-6 h-6 bg-white border-2 border-primary-300 rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors shadow-md"
	>
		<svg class="w-3 h-3 text-primary-600 transform {isOpen ? '' : 'rotate-180'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
		</svg>
	</button>
</aside>

<!-- Mobile Overlay -->
{#if isOpen}
	<div
		class="fixed inset-0 bg-black/50 z-30 lg:hidden"
		onclick={toggleSidebar}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && toggleSidebar()}
	></div>
{/if}
