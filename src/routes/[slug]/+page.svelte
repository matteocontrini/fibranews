<script lang="ts">
	import Post from '$lib/post.svelte';

	let { data } = $props();
</script>

<div class="container mt-14">
	<h1 class="text-6xl font-black tracking-wide text-center">
		<span class="text-violet-700 dark:text-violet-600 font-bold">
			#
		</span><span class="pl-1.5">
		{data.tag.slug}
		</span>
	</h1>

	<div class="mt-20 grid gap-20">
		{#each data.postsByYear as year}
			<section class="grid gap-20">
				<div class="text-4xl max-md:text-center">
					{year.year}
				</div>

				<div class="grid gap-20">
					{#each year.posts as post}
						<Post {post} />
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>
