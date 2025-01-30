<script lang="ts">
	import Post from '$lib/Post.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Notizie {data.tag.name}</title>
</svelte:head>

<div class="container mt-16 mb-20">
	<h1 class="text-center text-6xl font-black tracking-wide">
		{data.tag.name}
	</h1>

	<div class="mt-24">
		<div class="text-4xl max-md:text-center">
			2025
		</div>

		<div class="mt-20 grid gap-16 md:gap-24">
			{#each data.posts as post}
				<Post {post} />
			{/each}
		</div>
	</div>
</div>
