<script lang="ts">
	import { PlusCircleIcon, WandSparklesIcon } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="container mt-14">
	<div class="flex flex-col md:flex-row gap-4">
		<a class="button flex items-center gap-x-2"
			 href="/admin/posts/new">
			<PlusCircleIcon class="size-4" />
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
			<a class="border rounded-md px-4 py-2.5 grid md:grid-cols-12 gap-y-4 gap-2"
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
					{#if post.status === 'draft'}
						<span class="font-medium text-violet-700 dark:text-violet-500 pr-1">
							[Bozza]
						</span>
					{/if}
					{#if post.isAiGenerated}
						<span class="font-medium text-violet-700 dark:text-violet-500 pr-1">
							[<WandSparklesIcon class="inline-block size-4 mx-1" />]
						</span>
					{/if}
					<span class="font-medium">
						{post.title}
					</span>
					<br>
					<span class="text-slate-500 dark:text-slate-400 text-sm">
						/{post.year}/{post.slug}
					</span>
				</div>

				<div class="md:col-span-2 text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-1.5 h-fit">
					{#each post.tags as tag}
						<span>
						  #{tag.slug}
						</span>
					{/each}
				</div>
			</a>
		{/each}
	</div>
</div>
