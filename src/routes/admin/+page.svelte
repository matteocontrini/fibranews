<script lang="ts">
	let { data } = $props();
</script>

<div class="container mt-14">
	<div class="flex flex-col md:flex-row gap-4">
		<a class="button" href="/admin/posts/new">
			Nuovo post
		</a>

		<form class="grow">
			<!-- svelte-ignore a11y_autofocus -->
			<input type="search" autofocus
						 name="q" value={data.q}
						 placeholder="Cerca un post..." />
		</form>
	</div>

	<div class="grid gap-4 mt-8">
		{#each data.posts as post}
			<a class="border rounded-md px-4 py-2.5 grid md:grid-cols-12 gap-y-4"
				 href="/admin/posts/{post.id}">
				<div class="text-slate-500 dark:text-slate-400 md:col-span-3 md:grid">
					<span class="font-medium">
						{post.date}
					</span>
					{#if post.hideDay}
						<span class="text-sm">
							(giorno nascosto)
						</span>
					{/if}
				</div>

				<div class="md:col-span-7">
					<span class="font-medium">
						{post.title}
					</span>
					<br>
					<span class="text-slate-500 dark:text-slate-400 text-sm">
						/{post.year}/{post.slug}
					</span>
				</div>

				<div class="md:col-span-2 text-slate-500 dark:text-slate-400">
					{#each post.tags as tag}
						<span>
						  #{tag.slug}&nbsp;
						</span>
					{/each}
				</div>
			</a>
		{/each}
	</div>
</div>
