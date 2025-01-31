<script lang="ts">
	import type { Post } from '$lib/types';

	let { post, alwaysShowTags }: { post: Post, alwaysShowTags?: boolean } = $props();

	let showSources = $state(false);

	/* eslint svelte/no-at-html-tags: "off" */
</script>

<div class="grid md:grid-cols-12 gap-y-6 max-md:border-b pb-10">
	<div class="col-span-4">
		<p class="text-slate-500 dark:text-slate-400 text-xl leading-10">
			{post.date}
		</p>
	</div>

	<div class="col-span-8">
		<h2 class="text-3xl leading-[1.4] dark:text-white">
			{post.title}
		</h2>

		{#if post.tags.length > 1 || alwaysShowTags}
			<div class="mt-3 space-x-2.5">
				{#each post.tags as tag}
					<a class="text-violet-700 dark:text-violet-500 hover:underline"
						 href="/{tag.slug}">
						#{tag.slug}
					</a>
				{/each}
			</div>
		{/if}

		<div class="mt-6 prose prose-lg dark:text-slate-300">
			{@html post.content}
		</div>

		<div class="mt-6 text-violet-700 dark:text-violet-500">
			<button class="flex items-center gap-1.5 group cursor-pointer"
							class:hidden={showSources}
							onclick={() => showSources = true}>
				<span class="rotate-90">
					»
				</span>
				<span class="group-hover:underline">
					Mostra 5 fonti
				</span>
			</button>

			<ul class:hidden={!showSources}>
				<li class="flex items-center gap-2">
					<img
						src="https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://repubblica.it&size=32"
						alt="" class="size-4">
					<a class="text-violet-700 dark:text-violet-500 hover:underline"
						 href="TODO" rel="external"
						 target="_blank">
						Fastweb entra nel mercato dell’energia elettrica nel segno della sostenibilità
					</a>
				</li>
			</ul>
		</div>
	</div>
</div>
