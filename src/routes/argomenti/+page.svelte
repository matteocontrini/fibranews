<script lang="ts">
	let { data } = $props();
</script>

<div class="container mt-14">
	<h1 class="text-6xl font-black tracking-wide text-center">
		<span>
			Tutti gli
		</span>
		<span class="text-violet-700 dark:text-violet-600">
			argomenti
		</span>
	</h1>

	<div class="mt-20 grid gap-5 items-center text-3xl">
		{#each data.tags as tag}
			<a class="text-4xl font-semibold tracking-wide text-center group"
				 href="/{tag.slug}">
				<span class="text-violet-700 dark:text-violet-600 font-bold">
					#
				</span><span class="pl-1 group-hover:underline">
				  {tag.slug}
				</span>
			</a>
		{/each}
	</div>
</div>
