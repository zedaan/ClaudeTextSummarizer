<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FormCard from '$lib/components/FormCard.svelte';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import PasswordStrengthIndicator from '$lib/components/PasswordStrengthIndicator.svelte';

	let sidebarOpen = $state(true);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let isSaving = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	// Validation states
	let passwordsMatch = $derived(newPassword === confirmPassword && confirmPassword.length > 0);
	let hasMinLength = $derived(newPassword.length >= 8);
	let hasUppercase = $derived(/[A-Z]/.test(newPassword));
	let hasLowercase = $derived(/[a-z]/.test(newPassword));
	let hasNumber = $derived(/[0-9]/.test(newPassword));
	let hasSpecialChar = $derived(/[^A-Za-z0-9]/.test(newPassword));
	let isPasswordValid = $derived(hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar);
	let canSubmit = $derived(currentPassword.length > 0 && isPasswordValid && passwordsMatch);

	function changePassword() {
		errorMessage = '';
		successMessage = '';

		if (!canSubmit) {
			errorMessage = 'Please fill out all fields correctly.';
			return;
		}

		isSaving = true;

		// Simulate API call
		setTimeout(() => {
			// Simulate validation
			if (currentPassword === 'wrong') {
				errorMessage = 'Current password is incorrect.';
				isSaving = false;
				return;
			}

			// Success
			successMessage = 'Password changed successfully! You will be logged out for security.';
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			isSaving = false;

			// Simulate logout after 3 seconds
			setTimeout(() => {
				successMessage = '';
				alert('In a real application, you would be logged out here.');
			}, 3000);
		}, 1500);
	}

	function cancelChange() {
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		errorMessage = '';
		successMessage = '';
	}
</script>

<div class="flex min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
	<Sidebar bind:isOpen={sidebarOpen} />

	<main class="flex-1 transition-all duration-300 {sidebarOpen ? 'ml-72' : 'ml-20'}">
		<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Header -->
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-2">
					<svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
					</svg>
					<h1 class="text-4xl font-bold text-dark-900">Change Password</h1>
				</div>
				<p class="text-dark-600">Update your password to keep your account secure</p>
			</div>

			<!-- Success Message -->
			{#if successMessage}
				<div class="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
					<svg class="w-5 h-5 text-success-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
					<p class="text-sm font-semibold text-success-800">{successMessage}</p>
				</div>
			{/if}

			<!-- Error Message -->
			{#if errorMessage}
				<div class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
					<svg class="w-5 h-5 text-danger-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
					<p class="text-sm font-semibold text-danger-800">{errorMessage}</p>
				</div>
			{/if}

			<div class="space-y-6">
				<!-- Security Notice -->
				<div class="p-4 bg-primary-50 border border-primary-200 rounded-lg">
					<div class="flex items-start gap-3">
						<svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
						</svg>
						<div>
							<p class="text-sm font-semibold text-primary-900">Security Best Practices</p>
							<ul class="text-xs text-primary-700 mt-1 space-y-1 list-disc list-inside">
								<li>Use a unique password you don't use elsewhere</li>
								<li>Make it at least 8 characters with a mix of letters, numbers, and symbols</li>
								<li>Avoid common words or personal information</li>
								<li>Consider using a password manager</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- Change Password Form -->
				<FormCard title="Change Your Password">
					{#snippet children()}
						<form onsubmit={(e) => { e.preventDefault(); changePassword(); }} class="space-y-4">
							<!-- Current Password -->
							<PasswordInput
								bind:value={currentPassword}
								label="Current Password"
								placeholder="Enter your current password"
								autocomplete="current-password"
							/>

							<!-- New Password -->
							<PasswordInput
								bind:value={newPassword}
								label="New Password"
								placeholder="Enter your new password"
								autocomplete="new-password"
							/>

							<!-- Password Strength Indicator -->
							<PasswordStrengthIndicator password={newPassword} />

							<!-- Confirm New Password -->
							<div>
								<PasswordInput
									bind:value={confirmPassword}
									label="Confirm New Password"
									placeholder="Re-enter your new password"
									autocomplete="new-password"
								/>

								<!-- Password Match Indicator -->
								{#if confirmPassword.length > 0}
									<div class="mt-2 flex items-center gap-2">
										{#if passwordsMatch}
											<svg class="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
											</svg>
											<span class="text-xs text-success-700 font-medium">Passwords match</span>
										{:else}
											<svg class="w-4 h-4 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
											</svg>
											<span class="text-xs text-danger-700 font-medium">Passwords do not match</span>
										{/if}
									</div>
								{/if}
							</div>

							<!-- Action Buttons -->
							<div class="flex gap-3 pt-4">
								<button
									type="submit"
									disabled={!canSubmit || isSaving}
									class="btn btn-primary flex-1 {(!canSubmit || isSaving) ? 'opacity-50 cursor-not-allowed' : ''}"
								>
									{#if isSaving}
										<svg class="w-5 h-5 mr-2 inline-block animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
										</svg>
										Changing Password...
									{:else}
										<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
										</svg>
										Change Password
									{/if}
								</button>

								<button
									type="button"
									onclick={cancelChange}
									disabled={isSaving}
									class="btn btn-secondary flex-1 {isSaving ? 'opacity-50 cursor-not-allowed' : ''}"
								>
									<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
									</svg>
									Cancel
								</button>
							</div>
						</form>
					{/snippet}
				</FormCard>

				<!-- Additional Security Options -->
				<FormCard title="Additional Security">
					{#snippet children()}
						<div class="space-y-3">
							<button
								onclick={() => alert('Two-factor authentication setup would be implemented here.')}
								class="w-full p-4 border-2 border-dark-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
							>
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
										</svg>
										<div>
											<p class="text-sm font-semibold text-dark-900">Two-Factor Authentication</p>
											<p class="text-xs text-dark-500">Add an extra layer of security to your account</p>
										</div>
									</div>
									<svg class="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
									</svg>
								</div>
							</button>

							<button
								onclick={() => alert('Active sessions management would be implemented here.')}
								class="w-full p-4 border-2 border-dark-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
							>
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
										</svg>
										<div>
											<p class="text-sm font-semibold text-dark-900">Active Sessions</p>
											<p class="text-xs text-dark-500">View and manage devices with access to your account</p>
										</div>
									</div>
									<svg class="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
									</svg>
								</div>
							</button>
						</div>
					{/snippet}
				</FormCard>
			</div>
		</div>

		<Footer isDemoMode={false} />
	</main>
</div>
