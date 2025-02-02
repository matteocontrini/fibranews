<script lang="ts">
	import type { Post } from '$lib/types';
	import { WandSparklesIcon } from 'lucide-svelte';

	type Props = {
		post: Post,
		alwaysShowTags?: boolean
	}

	let { post, alwaysShowTags }: Props = $props();

	let showSources = $state(false);

	function faviconUrl(domain: string) {
		return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=32`;
	}

	/* eslint svelte/no-at-html-tags: "off" */
</script>

<article class="grid md:grid-cols-12 gap-y-6 max-md:border-b max-md:pb-10">
	<div class="col-span-4">
		<p class="text-slate-500 dark:text-slate-400 text-xl leading-10">
			{post.date}
		</p>
	</div>

	<div class="col-span-8">
		<h2 class="text-3xl leading-[1.4] dark:text-white">
			<a href="/{post.year}/{post.slug}" class="hover:underline">
				{post.title}
			</a>
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

		<div class="mt-6 prose prose-lg prose-slate dark:prose-invert max-w-none">
			{@html post.content}
		</div>

		{#if post.isAiGenerated}
			<footer class="italic mt-6 text-slate-500 dark:text-slate-400 flex gap-x-2.5">
				<WandSparklesIcon class="size-4 shrink-0 mt-1.5" />
				Questa notizia è stata riassunta con l'aiuto di un'AI.
			</footer>
		{/if}

		{#if post.sources.length > 0}
			<aside class="mt-6 text-violet-700 dark:text-violet-500">
				<button class="flex items-center gap-1.5 group cursor-pointer"
								class:hidden={showSources}
								onclick={() => showSources = true}>
					<span class="rotate-90">
						»
					</span>
					<span class="group-hover:underline">
						Mostra fonti
					</span>
				</button>

				<ul class:hidden={!showSources} class="space-y-1.5">
					{#each post.sources as source}
						<li class="flex gap-2.5">
							<img src={faviconUrl(source.domain)}
									 alt="" class="mt-1.25 size-4">
							<a class="hover:underline"
								 href="{source.url}" rel="external" target="_blank">
								{source.title}
							</a>
						</li>
					{/each}
				</ul>
			</aside>
		{/if}
	</div>
</article>
