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
	</div>

	<div class="col-span-8">
		<h2 class="text-3xl font-light leading-[1.4] dark:text-white">
			{post.title}
		</h2>

		<div class="mt-6 prose prose-lg dark:text-slate-300 font-light">
			{@html post.content}
		</div>

		<div class="text-sm mt-6 text-violet-700 dark:text-violet-500">
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
					<a class="text-sm text-slate-500 dark:text-slate-400 hover:underline" href="TODO">
						Fastweb entra nel mercato dell’energia elettrica nel segno della sostenibilità
					</a>
				</li>
			</ul>
		</div>
	</div>
</div>
