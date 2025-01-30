<script lang="ts">
	import Post from '$lib/Post.svelte';

	let { data } = $props();
</script>

<div class="container mt-16 mb-20">
	<h2 class="text-center text-5xl font-medium">
		Fastweb
	</h2>

	<hr class="border-t my-20">

	<div>
		<div class="font-light text-4xl">
			2025
		</div>

		<div class="mt-20 grid gap-16 md:gap-24">
			{#each data.posts as post}
				<Post {post} />
			{/each}
		</div>
	</div>
</div>
