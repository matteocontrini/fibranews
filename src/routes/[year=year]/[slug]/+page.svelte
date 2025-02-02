<script lang="ts">
	import Post from '$lib/post.svelte';

	let { data } = $props();
</script>

<div class="container mt-14">
	<Post post={data.post} alwaysShowTags={true} showSources={true} />
</div>
