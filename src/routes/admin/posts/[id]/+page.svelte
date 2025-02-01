<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { schema } from './form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Field, Control, Label, Description, FieldErrors, Legend } from 'formsnap';
	import autosize from 'svelte-autosize';
	import { toast } from 'svelte-sonner';
	import slugify from 'slugify';
	import { CheckIcon, SaveIcon } from 'lucide-svelte';
	import { browser } from '$app/environment';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(schema),
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.success) {
					toast.success(form.message.text);
				} else {
					toast(form.message.text);
				}
			}
		},
		onChange(event) {
			if (!data.postId && event.paths.includes('title')) {
				$formData.slug = slugify(event.get('title'), { lower: true, strict: true });
			}
		},
		onError({ result }) {
			console.error(result);
			if (result.error.message) {
				toast.error('Errore: ' + result.error.message);
			} else {
				toast.error('Errore sconosciuto');
			}
		}
	});

	const { form: formData, capture, restore, tainted, isTainted, enhance } = form;

	export const snapshot = { capture, restore };
</script>

<div class="container mt-14">
	<form method="POST" use:enhance class="grid gap-4">
		<!-- Title -->
		<Field {form} name="title">
			<Control>
				{#snippet children({ props })}
					<div class="grid grid-cols-12 gap-4">
						<div class="col-span-3">
							<Label class="font-medium text-lg">Titolo:</Label>
						</div>

						<div class="col-span-9">
							<input {...props} type="text" bind:value={$formData.title} />
							<FieldErrors class="mt-2 text-sm text-red-500" />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Slug -->
		<Field {form} name="slug">
			<Control>
				{#snippet children({ props })}
					<div class="grid grid-cols-12 gap-4">
						<div class="col-span-3">
							<Label class="font-medium text-lg">Slug:</Label>
						</div>

						<div class="col-span-9">
							<input {...props} type="text" bind:value={$formData.slug} readonly={data.postId != null} />
							<Description class="mt-2 text-xs text-slate-500 dark:text-slate-400">
								<code>
									https://fibra.news/{$formData.date.slice(0, 4) || '?'}/{$formData.slug}
								</code>
							</Description>
							<FieldErrors class="mt-2 text-sm text-red-500" />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Content -->
		<Field {form} name="content">
			<Control>
				{#snippet children({ props })}
					<div class="grid grid-cols-12 gap-4">
						<div class="col-span-3">
							<Label class="font-medium text-lg">Contenuto:</Label>
						</div>

						<div class="col-span-9">
							<textarea {...props}
												bind:value={$formData.content}
												rows={8}
												use:autosize></textarea>
							<Description class="mt-2 text-sm text-slate-500 dark:text-slate-400">
								<p>
									Puoi usare Markdown per formattare il testo.
								</p>
							</Description>
							<FieldErrors class="mt-2 text-sm text-red-500" />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Date -->
		<Field {form} name="date">
			<Control>
				{#snippet children({ props })}
					<div class="grid grid-cols-12 gap-4">
						<div class="col-span-3">
							<Label class="font-medium text-lg">Data:</Label>
						</div>

						<div class="col-span-9">
							<div class="flex items-center gap-x-4">
								<input {...props}
											 bind:value={$formData.date}
											 type="date" />

								<Field {form} name="hideDay">
									<Control>
										{#snippet children({ props })}
											<Label class="flex items-center gap-x-2.5 cursor-pointer
																	rounded-md border border-slate-200 dark:border-slate-700 py-2 px-4
																	has-checked:bg-violet-700 dark:has-checked:bg-violet-600 has-checked:text-white">
												<input {...props}
															 bind:checked={$formData.hideDay}
															 type="checkbox" />
												Nascondi giorno
												<FieldErrors class="text-sm text-red-500 empty:hidden" />
											</Label>
										{/snippet}
									</Control>
								</Field>
							</div>

							<FieldErrors class="mt-2 text-sm text-red-500" />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Post status -->
		<Field {form} name="published">
			<div class="grid grid-cols-12 gap-4">
				<div class="col-span-3">
					<Legend class="font-medium text-lg">Stato:</Legend>
				</div>
				<div class="col-span-9">
					<div class="flex">
						<Control>
							{#snippet children({ props })}
								<Label class="rounded-l-md border border-slate-200 dark:border-slate-700 py-2 px-4
                              flex items-center gap-x-2.5 cursor-pointer
                              {$formData.published ? 'bg-violet-700 dark:bg-violet-600 text-white' : ''}">
									<input {...props} type="radio" bind:group={$formData.published} value={true} />
									Pubblicato
								</Label>
							{/snippet}
						</Control>
						<Control>
							{#snippet children({ props })}
								<Label class="rounded-r-md border-r border-y border-slate-200 dark:border-slate-700 py-2 px-4
															flex items-center gap-x-2.5 cursor-pointer
                              {!$formData.published ? 'bg-violet-700 dark:bg-violet-600 text-white' : ''}">
									<input {...props} type="radio" bind:group={$formData.published} value={false} />
									Bozza
								</Label>
							{/snippet}
						</Control>
					</div>
					<FieldErrors class="mt-2 text-sm text-red-500" />
				</div>
			</div>
		</Field>

		<button class="button mt-4 flex items-center gap-x-2 justify-center"
						type="submit" disabled={!isTainted($tainted)}>
			{#if data.postId}
				<SaveIcon class="size-4" />
				Salva
			{:else}
				<CheckIcon class="size-4" />
				Crea post
			{/if}
		</button>
	</form>

	{#if browser}
		<div class="mt-16">
			<SuperDebug data={$formData} />
		</div>
	{/if}
</div>
