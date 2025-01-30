<script lang="ts">
	import type { Post } from '$lib/types';

	let { post }: { post: Post } = $props();

	let showSources = $state(false);
</script>

<div class="grid md:grid-cols-12 gap-y-6 max-md:border-b pb-10">
	<div class="col-span-4">
		<p class="text-slate-500 dark:text-slate-400 font-light text-xl leading-10">
			{post.date}
		</p>

		<!--		<div class="uppercase font-medium bg-[#FDC400] text-yellow-900 inline-block px-2.5 py-0.5 rounded-sm">-->
		<!--			{post.date}-->
		<!--		</div>-->
	</div>

	<div class="col-span-8">
		<h3 class="text-4xl font-light dark:text-white">
			{post.title}
		</h3>

		<div class="mt-6 prose prose-lg dark:text-slate-300 font-light">
			{@html post.content}
		</div>

		<div class="text-sm mt-6 text-slate-500 dark:text-slate-400">
			{#if !showSources}
				<button class="flex items-center gap-1.5 group cursor-pointer"
								onclick={() => showSources = true}>
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
						<a class="text-sm text-slate-500 dark:text-slate-400 hover:underline" href="TODO">
							Fastweb entra nel mercato dell’energia elettrica nel segno della sostenibilità
						</a>
					</li>
				</ul>
			{/if}
		</div>
	</div>
</div>
