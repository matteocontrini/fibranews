<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { schema, type SubmitPostSource } from './form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Field, Fieldset, ElementField, Control, Label, Description, FieldErrors, Legend } from 'formsnap';
	import autosize from 'svelte-autosize';
	import { toast } from 'svelte-sonner';
	import slugify from 'slugify';
	import {
		ArrowDownIcon,
		ArrowUpIcon,
		CheckIcon, CircleFadingArrowUpIcon,
		PlusIcon,
		SaveIcon,
		Trash2Icon,
		WandSparklesIcon
	} from 'lucide-svelte';
	import { browser } from '$app/environment';
	import MultiSelect from 'svelte-multiselect';
	import { tick } from 'svelte';

	let { data } = $props();

	let slugChangedByUser = false;

	const form = superForm(data.form, {
		resetForm: false,
		dataType: 'json',
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
			// Generate a slug from the title if the slug wasn't manually edited by the user
			if (!data.postId && event.paths.includes('title') && !slugChangedByUser) {
				$formData.slug = slugify(event.get('title'), { lower: true, strict: true });
			}

			if (event.paths.includes('slug')) {
				$formData.slug = event.get('slug')
					.replace(/ /g, '-')
					.replace(/-{2,}/g, '-')
					.toLowerCase();
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

	let deleteForm: HTMLFormElement;

	function confirmDelete(e: Event) {
		e.preventDefault();
		if (confirm(`Sei sicuro di voler eliminare il post “${$formData.title}”?`)) {
			deleteForm.submit();
		}
	}

	function addSource() {
		$formData.sources.push({
			id: null,
			url: '',
			title: ''
		});
		$formData.sources = $formData.sources;
	}

	function removeSource(source: SubmitPostSource) {
		$formData.sources = $formData.sources.filter((s) => s.id !== source.id);
	}

	let contentTextarea: HTMLTextAreaElement;

	async function loadArticle(source: SubmitPostSource, field: 'title' | 'content') {
		try {
			const res = await fetch('/admin/api/fetch-article', {
				method: 'POST',
				body: JSON.stringify({
					url: source.url
				})
			});
			if (!res.ok) {
				console.error('Status code: ' + res.status);
				toast.error('Errore nell\'estrazione dell\'articolo');
				return;
			}
			const data = await res.json();
			if (field === 'title') {
				if (!data.title) {
					toast.error('Titolo dell\'articolo non trovato');
					return;
				}
				source.title = data.title;
			}
			if (field === 'content') {
				if (!data.content) {
					toast.error('Contenuto dell\'articolo non trovato');
					return;
				}
				$formData.content = data.content;
				await tick();
				autosize.update(contentTextarea);
			}
			$formData.sources = $formData.sources;
		} catch (e) {
			console.error(e);
			toast.error('Errore nell\'estrazione dell\'articolo');
		}
	}

	let isSummarizing = $state(false);

	async function summarize() {
		isSummarizing = true;
		try {
			const res = await fetch('/admin/api/summarize', {
				method: 'POST',
				body: JSON.stringify({
					text: $formData.content
				})
			});
			if (!res.ok) {
				console.error('Status code: ' + res.status);
				toast.error('Errore nella generazione del contenuto');
				return;
			}
			const data = await res.json();
			$formData.content = data.summary;
			$formData.isAiGenerated = true;
			await tick();
			autosize.update(contentTextarea);
		} catch (e) {
			console.error(e);
			toast.error('Errore nella generazione del contenuto');
		} finally {
			isSummarizing = false;
		}
	}

	function move(i: number, direction: 'up' | 'down') {
		const source = $formData.sources[i];
		const newIndex = direction === 'up' ? i - 1 : i + 1;
		// Swap the elements at the old and new indices
		$formData.sources[i] = $formData.sources[newIndex];
		$formData.sources[newIndex] = source;
		$formData.sources = $formData.sources;
	}

	function onSlugChangedByUser() {
		slugChangedByUser = true;
	}
</script>

<div class="container mt-14">
	<form method="POST" action="?/submit" use:enhance class="grid gap-4.5">
		<!-- Title -->
		<Field {form} name="title">
			<Control>
				{#snippet children({ props })}
					<div class="grid sm:grid-cols-12 gap-4">
						<div class="col-span-3">
							<Label class="font-medium text-lg">Titolo:</Label>
						</div>

						<div class="col-span-9 grid gap-2">
							<textarea {...props}
												bind:value={$formData.title}
												rows={1}
												use:autosize
												class="text-xl"></textarea>
							<FieldErrors />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Slug -->
		<Field {form} name="slug">
			<Control>
				{#snippet children({ props })}
					<div class="grid sm:grid-cols-12 gap-4">
						<div class="col-span-3">
							<Label class="font-medium text-lg">Slug:</Label>
						</div>

						<div class="col-span-9 grid gap-2">
							<input {...props} type="text" bind:value={$formData.slug} readonly={data.postId != null}
										 onchange={() => onSlugChangedByUser()} />
							<Description class="text-xs text-slate-500 dark:text-slate-400">
								<code>
									https://fibra.news/{$formData.date.slice(0, 4) || '?'}/{$formData.slug}
								</code>
							</Description>
							<FieldErrors />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Content -->
		<Field {form} name="content">
			<Control>
				{#snippet children({ props })}
					<div class="grid sm:grid-cols-12 gap-4">
						<div class="col-span-3">
							<Label class="font-medium text-lg">Contenuto:</Label>
						</div>

						<div class="col-span-9 grid gap-2">
							<textarea {...props}
												bind:value={$formData.content}
												bind:this={contentTextarea}
												rows={8}
												use:autosize
												class="text-lg"></textarea>
							<Description class="flex justify-between">
								<p class="text-sm text-slate-500 dark:text-slate-400">
									Usa Markdown per formattare il testo.
								</p>

								<button class="button light flex items-center gap-x-2 justify-center text-sm py-1"
												type="button" disabled={isSummarizing}
												onclick={() => summarize()}>
									<WandSparklesIcon class="size-3" />
									Riassumi
								</button>
							</Description>
							<FieldErrors />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Is AI generated -->
		<Field {form} name="isAiGenerated">
			<Control>
				{#snippet children({ props })}
					<div class="grid sm:grid-cols-12 gap-4">
						<div class="col-span-3">
							<Legend class="font-medium text-lg">AI:</Legend>
						</div>

						<div class="col-span-9">
							<Label class="max-sm:w-full w-fit flex items-center justify-center gap-x-2.5 cursor-pointer
														rounded-md border border-slate-200 dark:border-slate-700 py-2 px-4
														has-checked:border-violet-700 dark:has-checked:border-violet-600
														has-checked:bg-violet-700 dark:has-checked:bg-violet-600 has-checked:text-white">
								<input {...props}
											 bind:checked={$formData.isAiGenerated}
											 type="checkbox" />
								Generato con AI
								<FieldErrors />
							</Label>
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Date -->
		<Field {form} name="date">
			<Control>
				{#snippet children({ props })}
					<div class="grid sm:grid-cols-12 gap-4">
						<div class="col-span-3">
							<Label class="font-medium text-lg">Data:</Label>
						</div>

						<div class="col-span-9 grid gap-2">
							<div class="flex items-center flex-col sm:flex-row gap-4">
								<input {...props}
											 bind:value={$formData.date}
											 type="date"
											 class="max-sm:w-full text-center" />

								<Field {form} name="hideDay">
									<Control>
										{#snippet children({ props })}
											<Label class="max-sm:w-full flex items-center justify-center gap-x-2.5 cursor-pointer
																	rounded-md border border-slate-200 dark:border-slate-700 py-2 px-4
																	has-checked:border-violet-700 dark:has-checked:border-violet-600
																	has-checked:bg-violet-700 dark:has-checked:bg-violet-600 has-checked:text-white">
												<input {...props}
															 bind:checked={$formData.hideDay}
															 type="checkbox" />
												Nascondi giorno
												<FieldErrors />
											</Label>
										{/snippet}
									</Control>
								</Field>
							</div>

							<FieldErrors />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Tags -->
		<Field {form} name="tags">
			<Control>
				{#snippet children({ props })}
					<div class="grid sm:grid-cols-12 gap-4">
						<div class="col-span-3">
							<Label class="font-medium text-lg">Tag:</Label>
						</div>

						<div class="col-span-9 grid gap-2">
							<MultiSelect {...props}
													 bind:selected={$formData.tags}
													 options={data.allTags}
													 allowUserOptions={true}
													 createOptionMsg="Crea questo tag..."
													 --sms-min-height="42px"
													 outerDivClass="!border !border-slate-200 dark:!border-slate-700 !px-3 !rounded-md
															focus-within:!border-violet-700 dark:focus-within:!border-violet-600
															focus-within:!outline focus-within:!outline-violet-700 dark:focus-within:!outline-violet-600"
													 ulSelectedClass="!mx-2"
													 liSelectedClass="!bg-violet-700 dark:!bg-violet-600 !text-white !rounded-md"
													 --sms-remove-btn-hover-color="var(--color-violet-700)"
													 --sms-remove-btn-hover-bg="white"
													 ulOptionsClass="!border !border-slate-200 dark:!border-slate-700 !top-[calc(100%+4px)]
                              !bg-white dark:!bg-slate-900"
													 --sms-options-border-radius="var(--radius-md)"
													 liOptionClass="!py-1.5"
													 liActiveOptionClass="!bg-violet-700 dark:!bg-violet-600 !text-white"
													 liActiveUserMsgClass="!bg-violet-700 dark:!bg-violet-600 !text-white"
							/>
							<FieldErrors />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<!-- Sources -->
		<Fieldset {form} name="sources">
			<div class="grid sm:grid-cols-12 gap-4">
				<div class="col-span-3">
					<Legend class="font-medium text-lg">Fonti:</Legend>
				</div>
				<div class="col-span-9">
					<div class="grid gap-6">
						{#each $formData.sources as source, i}
							<Control>
								{#snippet children({ props })}
									<div class="space-y-2">
										<div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2.5">
											<Label class="font-medium">
												{#if source.id}
													Fonte #{i + 1}
												{:else}
													Nuova fonte
												{/if}
											</Label>

											<div class="flex gap-2 flex-wrap">
												<button class="button light px-2 py-1"
																disabled={i === 0}
																type="button" onclick={() => move(i, 'up')}>
													<ArrowUpIcon class="size-3" />
												</button>

												<button class="button light px-2 py-1"
																disabled={i === $formData.sources.length - 1}
																type="button" onclick={() => move(i, 'down')}>
													<ArrowDownIcon class="size-3" />
												</button>

												<button class="button light flex items-center gap-x-2 justify-center text-sm py-1"
																type="button" onclick={() => loadArticle(source, 'title')}>
													<WandSparklesIcon class="size-3" />
													Titolo
												</button>

												<button class="button light flex items-center gap-x-2 justify-center text-sm py-1"
																type="button" onclick={() => loadArticle(source, 'content')}>
													<CircleFadingArrowUpIcon class="size-3" />
													Contenuto
												</button>

												<button class="button danger flex items-center gap-x-2 justify-center text-sm py-1"
																type="button" onclick={() => removeSource(source)}>
													<Trash2Icon class="size-3" />
													Rimuovi
												</button>
											</div>
										</div>

										<div class="grid sm:grid-cols-2 gap-2.5">
											<ElementField {form} name="sources[{i}].url">
												<div class="flex flex-col gap-2">
													<textarea {...props}
																		class="grow"
																		bind:value={$formData.sources[i].url}
																		rows={1}
																		use:autosize
																		placeholder="https://..."></textarea>
													<FieldErrors />
												</div>
											</ElementField>
											<ElementField {form} name="sources[{i}].title">
												<div class="flex flex-col gap-2">
													<textarea {...props}
																		class="grow"
																		bind:value={$formData.sources[i].title}
																		rows={1}
																		use:autosize
																		placeholder="Titolo"></textarea>
													<FieldErrors />
												</div>
											</ElementField>
										</div>
									</div>
								{/snippet}
							</Control>
						{/each}
					</div>

					<button class="button mt-3 flex items-center gap-x-2 justify-center"
									type="button"
									onclick={addSource}>
						<PlusIcon class="size-4" />
						Aggiungi fonte
					</button>
				</div>
			</div>
		</Fieldset>

		<!-- Post status -->
		<Field {form} name="published">
			<div class="grid sm:grid-cols-12 gap-4">
				<div class="col-span-3">
					<Legend class="font-medium text-lg">Stato:</Legend>
				</div>
				<div class="col-span-9 grid gap-2">
					<div class="flex">
						<Control>
							{#snippet children({ props })}
								<Label class="w-full rounded-l-md border border-slate-200 dark:border-slate-700 py-2 px-4
                              flex items-center justify-center gap-x-2.5 cursor-pointer
                              {$formData.published ? 'bg-violet-700 dark:bg-violet-600 text-white border-violet-700 dark:border-violet-600' : ''}">
									<input {...props} type="radio" bind:group={$formData.published} value={true} />
									Pubblicato
								</Label>
							{/snippet}
						</Control>
						<Control>
							{#snippet children({ props })}
								<Label class="w-full rounded-r-md border-r border-y border-slate-200 dark:border-slate-700 py-2 px-4
															flex items-center justify-center gap-x-2.5 cursor-pointer
                              {!$formData.published ? 'bg-violet-700 dark:bg-violet-600 text-white border-violet-700 dark:border-violet-600' : ''}">
									<input {...props} type="radio" bind:group={$formData.published} value={false} />
									Bozza
								</Label>
							{/snippet}
						</Control>
					</div>
					<FieldErrors />
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

	<form method="POST" action="?/delete" bind:this={deleteForm}>
		<button class="button danger w-full mt-4 flex items-center gap-x-2 justify-center"
						onclick={confirmDelete}>
			<Trash2Icon class="size-4" />
			Elimina post
		</button>
	</form>

	{#if browser}
		<div class="mt-16">
			<SuperDebug data={$formData} />
		</div>
	{/if}
</div>
