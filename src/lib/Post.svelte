<script lang="ts">
	import type { Post } from '$lib/types';

	let { post }: { post: Post } = $props();

	let showSources = $state(false);
</script>

<div>
	<div class="uppercase font-medium bg-[#FDC400] text-yellow-900 inline-block px-2.5 py-0.5 rounded">
		{post.date}
	</div>
	<h3 class="text-3xl font-light mt-4">
		{post.title}
	</h3>

	<div class="mt-4 prose prose-lg">
		{@html post.content}
	</div>

	<div class="text-sm mt-6 text-slate-500">
		{#if !showSources}
			<button class="flex items-center gap-1.5 group" onclick={() => showSources = true}>
				<span class="rotate-90">
					»
				</span>
				<span class="group-hover:underline">
					Mostra 5 fonti
				</span>
			</button>
		{:else}
			<ul>
				<li class="flex items-center gap-2">
					<img
						src="https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://repubblica.it&size=32"
						alt="" class="size-4">
					<a class="text-sm text-slate-500 hover:underline" href="TODO">
						Italiano arrestato in Venezuela, da due mesi non si sa dove sia. “Intervenga il governo"
					</a>
				</li>
			</ul>
		{/if}
	</div>
</div>
