<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';
	import MetaTags from '$lib/meta-tags.svelte';
	import { page } from '$app/state';

	import { ModeWatcher, userPrefersMode } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';

	let { children, data } = $props();

	const isAdminPage = $derived(page.url.pathname.startsWith('/admin'));
</script>

<svelte:head>
	<MetaTags />
</svelte:head>

<ModeWatcher />

<Toaster theme={$userPrefersMode} richColors position="bottom-center" />

<div class="py-6 container flex items-center justify-between flex-col gap-y-2.5 md:flex-row">
	<a class="rounded-lg text-4xl md:text-2xl select-none"
		 href="/">
		<span class="font-bold tracking-wide text-slate-600 dark:text-slate-400">
			fibra.
		</span><span class="font-light text-violet-700 dark:text-violet-600">
			news
		</span>
	</a>

	{#if !isAdminPage}
		<p class="italic md:mr-auto md:ml-6 md:mt-1.5 text-slate-500 text-center">
			Notizie sulle telecomunicazioni in Italia
		</p>

		<div class="md:ml-8 md:mt-1.5 flex items-center justify-center gap-x-5 gap-y-1 flex-wrap">
			{#each data.popularTags as tag}
				<a class="text-violet-700 dark:text-violet-500 hover:underline"
					 href="/{tag.slug}">
					#{tag.slug}
				</a>
			{/each}
			<a class="text-violet-700 dark:text-violet-500 hover:underline"
				 href="/argomenti">
				Tutti gli argomenti
			</a>
		</div>
	{:else}
		{#if data.user}
			<a
				class="md:mr-auto md:ml-8 md:mt-1.5 text-center font-medium text-violet-700 dark:text-violet-500 hover:underline"
				href="/admin">
				Lista post
			</a>

			<div class="flex items-center gap-x-2.5">
				{#if data.user?.photoUrl}
					<img src={data.user?.photoUrl} alt="" class="h-8 rounded-full">
				{/if}
				<span>{data.user?.name}</span>
			</div>
		{/if}
	{/if}
</div>

<hr>

{@render children()}

<hr class="mt-20">

<footer class="container py-12 flex flex-col sm:flex-row items-center gap-4 justify-between">
	<div>
		<a href="https://creativecommons.org/licenses/by/4.0/deed.it" rel="external"
			 class="font-medium text-violet-700 dark:text-violet-500 hover:underline">
			&copy; CC BY 4.0
		</a>
	</div>

	<select class="rounded-md" bind:value={$userPrefersMode}>
		<option value="system">Tema automatico</option>
		<option value="light">Tema chiaro</option>
		<option value="dark">Tema scuro</option>
	</select>
</footer>
