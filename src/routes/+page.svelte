<script lang="ts">
	import Post from '$lib/Post.svelte';

	let { data } = $props();

	// https://x.com/ilyamiskov/status/1881257760802967832/photo/1
</script>

<div class="w-[600px] mx-auto mt-12 mb-20">
	<div class="flex justify-center items-center py-12 border rounded-sm bg-slate-50/40">
		<img src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Logo_Fastweb_2020.svg"
				 class="w-[300px] mx-auto"
				 alt="Fastweb">
	</div>

	<h2 class="mt-20 text-5xl font-bold text-center">
		2024
	</h2>

	<div class="mt-14 grid gap-14">
		{#each data.posts as post}
			<Post {post} />
			<hr>
		{/each}
	</div>
</div>
