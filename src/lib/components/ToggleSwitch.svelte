<script lang="ts">
	interface Props {
		checked: boolean;
		label: string;
		description?: string;
		onToggle: (checked: boolean) => void;
	}

	let { checked = $bindable(false), label, description, onToggle }: Props = $props();

	function handleToggle() {
		checked = !checked;
		onToggle(checked);
	}
</script>

<div class="flex items-center justify-between p-4 bg-dark-50 rounded-lg">
	<div class="flex-1">
		<p class="text-sm font-semibold text-dark-900">{label}</p>
		{#if description}
			<p class="text-xs text-dark-500 mt-0.5">{description}</p>
		{/if}
	</div>
	<label class="relative inline-flex items-center cursor-pointer">
		<input
			type="checkbox"
			bind:checked
			onchange={handleToggle}
			class="sr-only peer"
		/>
		<div class="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
	</label>
</div>
