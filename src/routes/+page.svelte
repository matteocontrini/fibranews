<script lang="ts">
	import Post from '$lib/Post.svelte';

	let { data } = $props();
</script>

<div class="container mt-14">
	<h1 class="text-6xl font-black tracking-wide text-center">
		<span>
			Ultime
		</span>
		<span class="text-violet-700 dark:text-violet-600">
			notizie
		</span>
	</h1>

	<div class="mt-20 grid gap-20">
		{#each data.posts as post}
			<Post {post} alwaysShowTags={true} />
		{/each}
	</div>
</div>
