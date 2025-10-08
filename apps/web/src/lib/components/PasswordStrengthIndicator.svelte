<script lang="ts">
	interface Props {
		password: string;
	}

	let { password }: Props = $props();

	interface PasswordRequirement {
		met: boolean;
		label: string;
	}

	let strength = $derived.by(() => {
		const requirements: PasswordRequirement[] = [
			{ met: password.length >= 8, label: 'At least 8 characters' },
			{ met: /[A-Z]/.test(password), label: 'Contains uppercase letter' },
			{ met: /[a-z]/.test(password), label: 'Contains lowercase letter' },
			{ met: /[0-9]/.test(password), label: 'Contains number' },
			{ met: /[^A-Za-z0-9]/.test(password), label: 'Contains special character' }
		];

		const metCount = requirements.filter(r => r.met).length;
		const strengthLevel = metCount === 0 ? 'none' : metCount <= 2 ? 'weak' : metCount <= 4 ? 'medium' : 'strong';
		const strengthColor = strengthLevel === 'weak' ? 'danger' : strengthLevel === 'medium' ? 'warning' : strengthLevel === 'strong' ? 'success' : 'dark';
		const strengthPercent = (metCount / requirements.length) * 100;

		return {
			requirements,
			metCount,
			strengthLevel,
			strengthColor,
			strengthPercent
		};
	});
</script>

{#if password.length > 0}
	<div class="mt-4 space-y-3">
		<!-- Strength Bar -->
		<div>
			<div class="flex justify-between items-center mb-1">
				<span class="text-xs font-semibold text-dark-600">Password Strength</span>
				<span class="text-xs font-bold text-{strength.strengthColor}-600 capitalize">{strength.strengthLevel}</span>
			</div>
			<div class="w-full bg-dark-200 rounded-full h-2 overflow-hidden">
				<div
					class="h-full bg-{strength.strengthColor}-600 transition-all duration-300 ease-out"
					style="width: {strength.strengthPercent}%"
				></div>
			</div>
		</div>

		<!-- Requirements Checklist -->
		<div class="space-y-1.5">
			{#each strength.requirements as req}
				<div class="flex items-center gap-2 text-xs">
					{#if req.met}
						<svg class="w-4 h-4 text-success-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
						</svg>
						<span class="text-success-700">{req.label}</span>
					{:else}
						<svg class="w-4 h-4 text-dark-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
						</svg>
						<span class="text-dark-500">{req.label}</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}
