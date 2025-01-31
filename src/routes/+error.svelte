<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container mt-16 grid gap-16">
	{#if page.status === 404}
		<h1 class="text-center text-6xl font-black tracking-wide">
			Pagina non trovata
		</h1>

<!--		<p class="text-center text-lg">-->
<!--			TODO: contatti-->
<!--		</p>-->
	{:else}
		<h1 class="text-center text-6xl font-black tracking-wide">
			Errore di caricamento
		</h1>

<!--		<p class="text-center text-lg">-->
<!--			TODO: contatti-->
<!--		</p>-->

		<pre>{JSON.stringify(page.error, null, 2)}</pre>
	{/if}
</div>
