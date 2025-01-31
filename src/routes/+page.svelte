<script lang="ts">
	import Post from '$lib/Post.svelte';

	let { data } = $props();
</script>

<div class="container mt-16">
	<h1 class="text-center text-6xl font-black tracking-wide">
		<span>
			Ultime
		</span>
		<span class="text-violet-700 dark:text-violet-600">
			notizie
		</span>
	</h1>

	<div class="mt-6 flex flex-wrap justify-center gap-4">
		<span class="text-slate-500">
			Popolari:
		</span>
		{#each data.popularTags as tag}
			<a class="text-violet-700 dark:text-violet-500 hover:underline"
				 href="{tag.slug}">
				#{tag.slug}
			</a>
		{/each}
	</div>

	<div class="mt-24 grid gap-16 md:gap-24">
		{#each data.posts as post}
			<Post {post} alwaysShowTags={true} />
		{/each}
	</div>
</div>
