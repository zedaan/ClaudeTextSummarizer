<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FormCard from '$lib/components/FormCard.svelte';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import { accountSettings, userProfile } from '$lib/stores/userStore';

	let sidebarOpen = $state(true);
	let settings = $state({
		emailNotifications: false,
		dailyDigest: false,
		language: 'en',
		timezone: 'UTC',
		privacyMode: false
	});
	let profile = $state({ email: '' });
	let isSaving = $state(false);
	let saveMessage = $state('');
	let showDeleteConfirm = $state(false);
	let exportingData = $state(false);

	// Subscribe to settings and profile
	$effect(() => {
		const unsubSettings = accountSettings.subscribe(s => {
			settings = { ...s };
		});
		const unsubProfile = userProfile.subscribe(p => {
			profile = { email: p.email };
		});
		return () => {
			unsubSettings();
			unsubProfile();
		};
	});

	function saveSettings() {
		isSaving = true;
		saveMessage = '';

		setTimeout(() => {
			accountSettings.updateSettings(settings);
			isSaving = false;
			saveMessage = 'Account settings saved successfully!';

			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		}, 500);
	}

	function exportAccountData() {
		exportingData = true;

		setTimeout(() => {
			const data = accountSettings.exportData();
			const blob = new Blob([data], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `account-data-${new Date().toISOString().split('T')[0]}.json`;
			a.click();
			URL.revokeObjectURL(url);

			exportingData = false;
			saveMessage = 'Account data exported successfully!';
			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		}, 1000);
	}

	function deleteAccount() {
		// Simulate account deletion
		alert('Account deletion would be implemented here. This action would permanently delete all your data.');
		showDeleteConfirm = false;
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
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
					</svg>
					<h1 class="text-4xl font-bold text-dark-900">Account Settings</h1>
				</div>
				<p class="text-dark-600">Manage your account preferences and settings</p>
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
				<!-- Email Notifications -->
				<FormCard title="Email Notifications">
					{#snippet children()}
						<div class="space-y-3">
							<ToggleSwitch
								bind:checked={settings.emailNotifications}
								label="Email notifications"
								description="Receive email updates about your account activity"
								onToggle={(checked) => {}}
							/>

							<ToggleSwitch
								bind:checked={settings.dailyDigest}
								label="Daily digest"
								description="Get a daily summary of your summarization activity"
								onToggle={(checked) => {}}
							/>
						</div>

						<div class="p-4 bg-primary-50 border border-primary-200 rounded-lg">
							<div class="flex items-start gap-3">
								<svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
								<div>
									<p class="text-sm font-semibold text-primary-900">Email Address</p>
									<p class="text-xs text-primary-700 mt-1">
										Notifications will be sent to: <span class="font-medium">{profile.email}</span>
									</p>
								</div>
							</div>
						</div>
					{/snippet}
				</FormCard>

				<!-- Localization -->
				<FormCard title="Localization">
					{#snippet children()}
						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Language
							</label>
							<select
								bind:value={settings.language}
								class="w-full px-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							>
								<option value="en">English</option>
								<option value="es">Español</option>
								<option value="fr">Français</option>
								<option value="de">Deutsch</option>
								<option value="ja">日本語</option>
								<option value="zh">中文</option>
							</select>
							<p class="text-xs text-dark-500 mt-2">Select your preferred language for the interface</p>
						</div>

						<div>
							<label class="block text-sm font-semibold text-dark-700 mb-2">
								Timezone
							</label>
							<select
								bind:value={settings.timezone}
								class="w-full px-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							>
								<option value="UTC">UTC (Coordinated Universal Time)</option>
								<option value="America/New_York">Eastern Time (US & Canada)</option>
								<option value="America/Chicago">Central Time (US & Canada)</option>
								<option value="America/Denver">Mountain Time (US & Canada)</option>
								<option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
								<option value="Europe/London">London (GMT)</option>
								<option value="Europe/Paris">Paris (CET)</option>
								<option value="Asia/Tokyo">Tokyo (JST)</option>
								<option value="Asia/Shanghai">Shanghai (CST)</option>
								<option value="Australia/Sydney">Sydney (AEST)</option>
							</select>
							<p class="text-xs text-dark-500 mt-2">Set your local timezone for accurate timestamps</p>
						</div>
					{/snippet}
				</FormCard>

				<!-- Privacy & Security -->
				<FormCard title="Privacy & Security">
					{#snippet children()}
						<ToggleSwitch
							bind:checked={settings.privacyMode}
							label="Privacy mode"
							description="Prevent summary history from being saved in browser storage"
							onToggle={(checked) => {}}
						/>

						<div class="p-4 bg-warning-50 border border-warning-200 rounded-lg">
							<div class="flex items-start gap-3">
								<svg class="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
								</svg>
								<div>
									<p class="text-sm font-semibold text-warning-800">Privacy Mode Active</p>
									<p class="text-xs text-warning-700 mt-1">
										When enabled, summaries will not be saved to your browser's local storage. History and saved items will be cleared on exit.
									</p>
								</div>
							</div>
						</div>

						<div>
							<a
								href="/password"
								class="btn btn-secondary w-full justify-center"
							>
								<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
								</svg>
								Change Password
							</a>
						</div>
					{/snippet}
				</FormCard>

				<!-- Data Export -->
				<FormCard title="Data Export">
					{#snippet children()}
						<div class="p-4 bg-primary-50 border border-primary-200 rounded-lg">
							<p class="text-sm text-primary-900 mb-3">
								Export all your account data, including settings, preferences, and summary history in JSON format.
							</p>
							<button
								onclick={exportAccountData}
								disabled={exportingData}
								class="btn btn-primary w-full justify-center {exportingData ? 'opacity-75 cursor-not-allowed' : ''}"
							>
								{#if exportingData}
									<svg class="w-5 h-5 mr-2 inline-block animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
									</svg>
									Exporting...
								{:else}
									<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
									</svg>
									Export Account Data
								{/if}
							</button>
						</div>
					{/snippet}
				</FormCard>

				<!-- Danger Zone -->
				<FormCard title="Danger Zone">
					{#snippet children()}
						<div class="p-4 bg-danger-50 border border-danger-200 rounded-lg space-y-4">
							<div>
								<p class="text-sm font-semibold text-danger-900 mb-1">Delete Account</p>
								<p class="text-xs text-danger-700 mb-3">
									Permanently delete your account and all associated data. This action cannot be undone.
								</p>

								{#if !showDeleteConfirm}
									<button
										onclick={() => showDeleteConfirm = true}
										class="btn btn-danger"
									>
										<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
										</svg>
										Delete My Account
									</button>
								{:else}
									<div class="space-y-2">
										<p class="text-sm font-bold text-danger-900">Are you absolutely sure?</p>
										<p class="text-xs text-danger-700">This will permanently delete all your data including:</p>
										<ul class="text-xs text-danger-700 list-disc list-inside ml-2 space-y-1">
											<li>Profile information</li>
											<li>All summary history</li>
											<li>Saved summaries</li>
											<li>Account settings and preferences</li>
										</ul>
										<div class="flex gap-2 pt-2">
											<button
												onclick={deleteAccount}
												class="btn btn-danger flex-1"
											>
												Yes, Delete Everything
											</button>
											<button
												onclick={() => showDeleteConfirm = false}
												class="btn btn-secondary flex-1"
											>
												Cancel
											</button>
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/snippet}
				</FormCard>

				<!-- Save Button -->
				<div class="sticky bottom-4">
					<button
						onclick={saveSettings}
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
							Save Settings
						{/if}
					</button>
				</div>
			</div>
		</div>

		<Footer isDemoMode={false} />
	</main>
</div>
