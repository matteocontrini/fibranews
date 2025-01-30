<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';

	let { children } = $props();
</script>

<div class="border-b py-3">
	<h1 class="uppercase font-semibold text-center text-xl">
		Fibra.news
	</h1>
</div>

{@render children()}
