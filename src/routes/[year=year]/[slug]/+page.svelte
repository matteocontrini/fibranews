<script lang="ts">
	import Post from '$lib/Post.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.post.title}</title>
</svelte:head>

<div class="container mt-14">
	<Post post={data.post} alwaysShowTags={true} />
</div>
