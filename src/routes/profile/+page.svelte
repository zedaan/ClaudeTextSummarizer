<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FormCard from '$lib/components/FormCard.svelte';
	import { userProfile } from '$lib/stores/userStore';
	import { summaryStats } from '$lib/stores/summaryStore';

	let sidebarOpen = $state(true);
	let profile = $state({ name: '', email: '', bio: '', avatar: '', accountCreated: 0 });
	let stats = $state({ total: 0, saved: 0, totalWords: 0 });
	let isSaving = $state(false);
	let saveMessage = $state('');

	// Subscribe to profile and stats
	$effect(() => {
		const unsubProfile = userProfile.subscribe(p => {
			profile = { ...p };
		});
		const unsubStats = summaryStats.subscribe(s => {
			stats = s;
		});
		return () => {
			unsubProfile();
			unsubStats();
		};
	});

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function saveProfile() {
		isSaving = true;
		saveMessage = '';

		setTimeout(() => {
			userProfile.updateProfile({
				name: profile.name,
				email: profile.email,
				bio: profile.bio
			});
			isSaving = false;
			saveMessage = 'Profile updated successfully!';

			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		}, 500);
	}

	function handleAvatarChange() {
		// Simulate avatar upload
		alert('Avatar upload would be implemented here. For demo purposes, we\'ll keep the current avatar.');
	}
</script>

<div class="flex min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
	<Sidebar bind:isOpen={sidebarOpen} />

	<main class="flex-1 transition-all duration-300 {sidebarOpen ? 'ml-72' : 'ml-20'}">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Header -->
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-2">
					<svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
					</svg>
					<h1 class="text-4xl font-bold text-dark-900">Profile</h1>
				</div>
				<p class="text-dark-600">Manage your personal information and preferences</p>
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
				<!-- Profile Picture -->
				<FormCard title="Profile Picture">
					{#snippet children()}
						<div class="flex items-center gap-6">
							<div class="relative">
								<img
									src={profile.avatar}
									alt="Profile"
									class="w-24 h-24 rounded-full border-4 border-primary-300 shadow-lg"
								/>
								<div class="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full border-2 border-white"></div>
							</div>
							<div class="flex-1">
								<p class="text-sm font-semibold text-dark-900 mb-2">Update your profile picture</p>
								<p class="text-xs text-dark-500 mb-3">JPG, PNG or GIF, max 2MB</p>
								<button
									onclick={handleAvatarChange}
									class="btn btn-secondary"
								>
									<svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
									</svg>
									Change Picture
								</button>
							</div>
						</div>
					{/snippet}
				</FormCard>

				<!-- Basic Information -->
				<FormCard title="Basic Information">
					{#snippet children()}
						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Full Name
							</label>
							<input
								type="text"
								bind:value={profile.name}
								placeholder="Enter your name"
								class="w-full px-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							/>
						</div>

						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Email Address
							</label>
							<input
								type="email"
								bind:value={profile.email}
								placeholder="your.email@example.com"
								class="w-full px-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							/>
						</div>

						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Bio
							</label>
							<textarea
								bind:value={profile.bio}
								placeholder="Tell us about yourself..."
								rows="4"
								class="w-full px-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
							></textarea>
							<p class="text-xs text-dark-500 mt-1">{profile.bio.length} / 500 characters</p>
						</div>

						<button
							onclick={saveProfile}
							disabled={isSaving}
							class="btn btn-primary w-full {isSaving ? 'opacity-75 cursor-not-allowed' : ''}"
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
								Save Changes
							{/if}
						</button>
					{/snippet}
				</FormCard>

				<!-- Account Stats -->
				<FormCard title="Account Statistics">
					{#snippet children()}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-semibold text-dark-700">Total Summaries</span>
									<svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
									</svg>
								</div>
								<p class="text-3xl font-bold text-primary-700">{stats.total}</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-warning-50 to-warning-100 rounded-lg">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-semibold text-dark-700">Saved Items</span>
									<svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
									</svg>
								</div>
								<p class="text-3xl font-bold text-warning-700">{stats.saved}</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-semibold text-dark-700">Words Processed</span>
									<svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
									</svg>
								</div>
								<p class="text-3xl font-bold text-secondary-700">
									{stats.totalWords >= 1000 ? `${(stats.totalWords / 1000).toFixed(1)}K` : stats.totalWords}
								</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-lg">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-semibold text-dark-700">Member Since</span>
									<svg class="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
									</svg>
								</div>
								<p class="text-lg font-bold text-success-700">{formatDate(profile.accountCreated)}</p>
							</div>
						</div>
					{/snippet}
				</FormCard>
			</div>
		</div>

		<Footer isDemoMode={false} />
	</main>
</div>
