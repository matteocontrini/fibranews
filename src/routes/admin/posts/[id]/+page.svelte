<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { schema } from './form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Field, Control, Label, Description, FieldErrors } from 'formsnap';
	import autosize from 'svelte-autosize';
	import { toast } from 'svelte-sonner';

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
		}
	});

	const { form: formData, capture, restore, tainted, isTainted } = form;

	export const snapshot = { capture, restore };
</script>

<div class="container mt-14">
	<form method="POST" class="grid gap-4">
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
							<FieldErrors class="mt-2 text-sm text-red-500" />
						</div>
					</div>
				{/snippet}
			</Control>
		</Field>

		<button type="submit" disabled={!isTainted($tainted)}>
			{#if data.postId}
				Salva
			{:else}
				Crea post
			{/if}
		</button>
	</form>

	<!--	<div class="mt-8">-->
	<!--		<SuperDebug data={$formData} />-->
	<!--	</div>-->
</div>
