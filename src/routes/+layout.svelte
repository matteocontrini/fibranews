<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';

	import { ModeWatcher, userPrefersMode } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<div class="border-b py-3">
	<h1 class="uppercase font-semibold text-center text-xl">
		Fibra.news
	</h1>
</div>

{@render children()}

<footer class="container py-12 flex justify-center">
	<select class="p-2 rounded-md"
					bind:value={$userPrefersMode}>
		<option value="system">Auto</option>
		<option value="light">Light</option>
		<option value="dark">Dark</option>
	</select>
</footer>
