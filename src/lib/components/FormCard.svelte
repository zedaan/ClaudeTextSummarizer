<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		icon?: Snippet;
		children: Snippet;
	}

	let { title, description, icon, children }: Props = $props();
</script>

<div class="card">
	<div class="mb-4">
		<h2 class="text-xl font-bold text-dark-900 flex items-center gap-2">
			{#if icon}
				{@render icon()}
			{/if}
			{title}
		</h2>
		{#if description}
			<p class="text-sm text-dark-600 mt-1">{description}</p>
		{/if}
	</div>

	<div class="space-y-4">
		{@render children()}
	</div>
</div>
