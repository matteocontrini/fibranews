<script lang="ts">
	import { page } from '$app/state';

	const fallback = {
		title: 'Fibra.news',
		description: 'Notizie sulle telecomunicazioni in Italia.',
		ogType: 'website'
		// ogImage: ''
	};

	let seo = $derived(page.data.seo ?? {});

	let title = $derived(seo.title || fallback.title);
	let description = $derived(seo.description || fallback.description);
	let ogTitle = $derived(seo.ogTitle || seo.title || fallback.title);
	let ogType = $derived(seo.ogType || fallback.ogType);
	// let ogImage = seo.ogImage;
</script>

<title>{title}</title>
<meta name="description" content={description} />
<meta property="og:site_name" content="Fibra.news" />
<meta property="og:title" content={ogTitle} />
<meta property="og:type" content={ogType} />
<meta property="og:description" content={description} />
<!--<meta property="og:image" content={ogImage} />-->
<!--<meta name="twitter:card" content="summary_large_image" />-->
<!--<meta name="twitter:image" content={ogImage} />-->

{#if seo.ogModified}
	<meta property="og:updated_time" content={seo.ogModified.toISOString()} />
{/if}

{#if seo.jsonLd}
	{@html `<script type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>`}
{/if}

<link rel="canonical" href="https://fibra.news{page.url.pathname}" />
