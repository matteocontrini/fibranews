<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';

	import { ModeWatcher, userPrefersMode } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<title>Fibra.news</title>
</svelte:head>

<ModeWatcher />

<div class="py-6 container flex items-center">
	<!--	<a class="px-3.5 py-1 bg-violet-800 text-white rounded-lg text-2xl select-none"-->
	<!--		 href="/">-->
	<!--		<span class="font-bold tracking-wider">-->
	<!--			fibra.-->
	<!--		</span><span class="font-light">-->
	<!--			news-->
	<!--		</span>-->
	<!--	</a>-->
	<a class="rounded-lg text-2xl select-none"
		 href="/">
		<span class="font-bold tracking-wide text-slate-600 dark:text-slate-400">
			fibra.
		</span><span class="font-light text-violet-700 dark:text-violet-600">
			news
		</span>
	</a>

	<div class="ml-auto font-medium flex gap-8">
		<a href="/" class="hover:underline">
			Tutte le notizie
		</a>
		<a href="/" class="hover:underline">
			Tutti i tag
		</a>
	</div>
</div>

<hr>

{@render children()}

<hr class="mt-20">

<footer class="container py-12 flex justify-center">
	<select class="p-2 rounded-md"
					bind:value={$userPrefersMode}>
		<option value="system">Auto</option>
		<option value="light">Light</option>
		<option value="dark">Dark</option>
	</select>
</footer>
