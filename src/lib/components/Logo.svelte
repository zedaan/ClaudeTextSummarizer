<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg' | 'xl';
		showText?: boolean;
		variant?: 'full' | 'icon-only';
	}

	let { size = 'md', showText = true, variant = 'full' }: Props = $props();

	const sizes = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-16 h-16',
		xl: 'w-24 h-24'
	};

	const textSizes = {
		sm: 'text-lg',
		md: 'text-2xl',
		lg: 'text-3xl',
		xl: 'text-4xl'
	};
</script>

<div class="flex items-center space-x-3">
	<!-- Dog Logo with Gradient Border -->
	<div class="relative group">
		<div class="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
		<div class="relative {sizes[size]} rounded-full overflow-hidden border-2 border-white shadow-lg">
			<img
				src="/images/cool-dog.webp"
				alt="AI Summarizer Mascot"
				class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
			/>
		</div>
	</div>

	{#if showText && variant === 'full'}
		<!-- Logo Text -->
		<div class="flex flex-col">
			<h1 class="{textSizes[size]} font-bold text-dark-900 font-display leading-none">
				AI Summarizer
			</h1>
			<p class="text-xs text-dark-500 font-medium">Powered by Claude AI</p>
		</div>
	{/if}
</div>
