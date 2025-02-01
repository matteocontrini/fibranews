import { error, fail, redirect } from '@sveltejs/kit';
import { PostEntity, PostStatus } from '$lib/server/db/schema';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from './form';

export async function load({ params, locals }) {
	if (!locals.user) {
		return redirect(302, '/admin/login');
	}

	const { id } = params;

	if (id === 'new') {
		return {
			postId: null,
			form: await superValidate(zod(schema)),
			seo: {
				title: 'Nuovo post'
			}
		};
	}

	const post = await PostEntity.findOne({
		where: {
			id: +id
		}
	});

	if (!post) {
		return error(404, 'Post non trovato');
	}

	return {
		postId: post.id,
		form: await superValidate(mapPost(post), zod(schema)),
		seo: {
			title: `Modifica “${post.title}”`
		}
	};
}

function mapPost(x: PostEntity) {
	return {
		title: x.title,
		content: x.content
	};
}

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/admin/login');
		}

		const form = await superValidate(event, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id } = event.params;

		if (id === 'new') {
			const post = new PostEntity();
			post.title = form.data.title;
			post.content = form.data.content;
			post.createdByUser = event.locals.user;
			post.updatedByUser = event.locals.user;
			post.status = PostStatus.DRAFT;
			post.slug = post.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
			post.date = '2025-01-01';
			post.hideDay = false;

			await post.save();

			return redirect(302, `/admin/posts/${post.id}`);
		} else {
			const post = await PostEntity.findOne({
				where: {
					id: +id
				}
			});

			if (!post) {
				return error(404, 'Post non trovato');
			}

			post.title = form.data.title;
			post.content = form.data.content;
			post.updatedByUser = event.locals.user;

			await post.save();

			return message(form, { text: 'Post salvato!', success: true });
		}
	}
};
