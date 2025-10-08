<script lang="ts">
	let imageUrl = $state<string>('');
	let imageType = $state<string>('');
	let imageFile = $state<File | null>(null);
	let descriptionLength = $state(10);
	let descriptionOutput = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let copyFeedback = $state<'success' | 'failure' | ''>('');
	let isDemoMode = $state(false);
	let isDragOver = $state(false);

	// Derived state
	let hasImage = $derived(imageUrl !== '');
	let hasDescription = $derived(descriptionOutput.trim() !== '');
	let hasError = $derived(errorMessage !== '');

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragOver = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;
		const file = e.dataTransfer?.files[0];
		if (file && file.type.startsWith('image/')) {
			await displayImage(file);
		}
	}

	async function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			await displayImage(file);
		}
	}

	async function displayImage(file: File) {
		imageFile = file;
		imageType = file.type;
		const reader = new FileReader();
		reader.onload = (e) => {
			imageUrl = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	function clickFileInput() {
		document.getElementById('file-input')?.click();
	}

	async function describe() {
		if (!hasImage || !imageUrl) return;

		isLoading = true;
		errorMessage = '';
		descriptionOutput = '';

		try {
			// Extract base64 data from data URL
			const base64Data = imageUrl.split(',')[1];

			const apiUrl = import.meta.env.PUBLIC_IMAGE_API_URL || 'http://localhost:3002';
			const response = await fetch(`${apiUrl}/describe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					imageData: base64Data,
					imageType: imageType,
					descriptionLength: descriptionLength
				})
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to describe image');
			}

			const data = await response.json();
			descriptionOutput = data.description;
			isDemoMode = data.demoMode || false;
		} catch (err) {
			errorMessage = `There was an error processing the image: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			isLoading = false;
		}
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(descriptionOutput);
			copyFeedback = 'success';
			setTimeout(() => {
				copyFeedback = '';
			}, 3000);
		} catch (err) {
			copyFeedback = 'failure';
			setTimeout(() => {
				copyFeedback = '';
			}, 3000);
		}
	}

	function clear() {
		imageUrl = '';
		imageType = '';
		imageFile = null;
		descriptionOutput = '';
		errorMessage = '';
		isDemoMode = false;
		const fileInput = document.getElementById('file-input') as HTMLInputElement;
		if (fileInput) fileInput.value = '';
	}

	function dismissError() {
		errorMessage = '';
		clear();
	}
</script>

<!-- Image Describer Section -->
<div class="space-y-6">
	<div class="flex items-center space-x-3">
		<div class="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center">
			<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
			</svg>
		</div>
		<h2 class="text-2xl font-bold text-dark-900">Image Describer</h2>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Image Upload Card -->
		<div class="card animate-slide-in">
			<h3 class="text-xl font-bold text-dark-900 mb-4">Upload Image</h3>

			<!-- Image Input Area -->
			<button
				onclick={clickFileInput}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				class="w-full h-64 border-2 border-dashed rounded-lg transition-all {isDragOver ? 'border-secondary-500 bg-secondary-50' : 'border-dark-300 hover:border-secondary-400'} {hasImage ? 'p-0' : 'flex flex-col items-center justify-center p-6'}"
			>
				{#if hasImage}
					<img src={imageUrl} alt="Uploaded" class="w-full h-full object-contain rounded-lg" />
				{:else}
					<svg class="w-12 h-12 text-dark-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
					</svg>
					<p class="text-dark-600 text-center">Drop image here or click to upload</p>
					<p class="text-dark-400 text-xs mt-2">Supports JPG, PNG, GIF, WebP</p>
				{/if}
			</button>
			<input type="file" id="file-input" accept="image/*" onchange={handleFileSelect} class="hidden" />

			<!-- Settings -->
			<div class="mt-6 space-y-4">
				<div>
					<div class="flex items-center justify-between mb-2">
						<label for="description-length-input" class="text-sm font-semibold text-dark-700">Description Length</label>
						<span class="text-sm font-bold text-secondary-600">{descriptionLength} words</span>
					</div>
					<input
						type="range"
						id="description-length-input"
						bind:value={descriptionLength}
						min="1"
						max="100"
						disabled={!hasImage}
						class="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 accent-secondary-600"
					/>
					<div class="flex justify-between text-xs text-dark-500 mt-1">
						<span>1</span>
						<span>50</span>
						<span>100</span>
					</div>
				</div>

				<button
					onclick={describe}
					disabled={!hasImage || isLoading}
					class="btn btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<svg class="animate-spin h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Describing...
					{:else}
						<svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
						</svg>
						Describe Image
					{/if}
				</button>
			</div>
		</div>

		<!-- Description Output Card -->
		<div class="card animate-slide-in relative min-h-[500px]">
			{#if hasError}
				<!-- Error State -->
				<div class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white rounded-xl">
					<div class="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mb-4">
						<svg class="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<h3 class="text-lg font-bold text-dark-900 mb-2">Error</h3>
					<p class="text-center text-dark-600 mb-6 max-w-md">{errorMessage}</p>
					<button onclick={dismissError} class="btn btn-danger">
						Dismiss & Try Again
					</button>
				</div>
			{:else if isLoading}
				<!-- Loading State -->
				<div class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white rounded-xl">
					<div class="relative w-24 h-24 mb-4">
						<div class="absolute inset-0 border-8 border-secondary-200 rounded-full"></div>
						<div class="absolute inset-0 border-8 border-secondary-600 rounded-full border-t-transparent animate-spin"></div>
					</div>
					<p class="text-dark-600 font-medium animate-pulse">Analyzing image...</p>
				</div>
			{:else if hasDescription}
				<!-- Success State -->
				<div class="h-full flex flex-col">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-xl font-bold text-dark-900">Description</h3>
						{#if isDemoMode}
							<span class="px-3 py-1 bg-warning-100 text-warning-800 rounded-lg text-xs font-semibold">
								Demo
							</span>
						{/if}
					</div>

					<div class="flex-1 p-4 bg-dark-50 rounded-lg border border-dark-200 mb-4 overflow-y-auto">
						<p class="text-dark-800 leading-relaxed whitespace-pre-wrap">{descriptionOutput}</p>
					</div>

					<div class="flex space-x-3">
						<button
							onclick={copy}
							class="btn btn-outline flex-1 {copyFeedback === 'success' ? 'bg-success-100 text-success-800 border-success-300' : copyFeedback === 'failure' ? 'bg-danger-100 text-danger-800 border-danger-300' : ''}"
						>
							{#if copyFeedback === 'success'}
								<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
								</svg>
								Copied!
							{:else if copyFeedback === 'failure'}
								😔 Failed
							{:else}
								<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
								</svg>
								Copy
							{/if}
						</button>
						<button onclick={clear} class="btn btn-outline flex-1">
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
							</svg>
							Clear
						</button>
					</div>
				</div>
			{:else}
				<!-- Empty State -->
				<div class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white rounded-xl">
					<div class="w-20 h-20 bg-dark-100 rounded-full flex items-center justify-center mb-4">
						<svg class="w-10 h-10 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
						</svg>
					</div>
					<h3 class="text-lg font-bold text-dark-900 mb-2">Ready to Describe</h3>
					<p class="text-center text-dark-600 max-w-md">Upload an image and click "Describe Image" to get an AI-powered description.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
