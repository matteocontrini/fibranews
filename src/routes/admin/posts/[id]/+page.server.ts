import { error, fail, redirect } from '@sveltejs/kit';
import { PostEntity, PostStatus, TagEntity, UserEntity } from '$lib/server/db/schema';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from './form';
import { In } from 'typeorm';

export async function load({ params, locals }) {
	if (!locals.user) {
		return redirect(302, '/admin/login');
	}

	const { id } = params;

	const allTags = (
		await TagEntity.find({
			select: ['slug'],
			order: {
				slug: 'ASC'
			}
		})
	).map((t) => t.slug);

	if (id === 'new') {
		return {
			postId: null,
			allTags,
			form: await superValidate(zod(schema)),
			seo: {
				title: 'Nuovo post'
			}
		};
	}

	const post = await PostEntity.findOne({
		where: {
			id: +id
		},
		relations: {
			tags: true
		}
	});

	if (!post) {
		return error(404, 'Post non trovato');
	}

	return {
		postId: post.id,
		allTags,
		form: await superValidate(mapPost(post), zod(schema)),
		seo: {
			title: `Modifica “${post.title}”`
		}
	};
}

function mapPost(x: PostEntity) {
	return {
		title: x.title,
		slug: x.slug,
		content: x.content,
		published: x.status === PostStatus.PUBLISHED,
		date: x.date,
		hideDay: x.hideDay,
		tags: x.tags.map((t) => t.slug)
	};
}

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/admin/login');
		}

		const form = await superValidate(event, zod(schema), { strict: true });

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
			post.status = form.data.published ? PostStatus.PUBLISHED : PostStatus.DRAFT;
			post.slug = form.data.slug;
			post.date = form.data.date;
			post.hideDay = form.data.hideDay;
			post.tags = await queryOrCreateTags(form.data.tags, event.locals.user);

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
			post.status = form.data.published ? PostStatus.PUBLISHED : PostStatus.DRAFT;
			post.date = form.data.date;
			post.hideDay = form.data.hideDay;
			post.updatedByUser = event.locals.user;
			post.tags = await queryOrCreateTags(form.data.tags, event.locals.user);

			await post.save();

			return message(form, { text: 'Post salvato!', success: true });
		}
	}
};

async function queryOrCreateTags(tags: string[], user: UserEntity) {
	if (!tags.length) {
		return [];
	}

	const tagEntities = await TagEntity.find({
		where: {
			slug: In(tags)
		}
	});

	for (const tag of tags) {
		if (tagEntities.some((et) => et.slug === tag)) {
			continue;
		}

		const newTag = new TagEntity();
		newTag.createdByUser = user;
		newTag.updatedByUser = user;
		newTag.name = tag;
		newTag.slug = tag;
		await newTag.save();
		tagEntities.push(newTag);
	}

	return tagEntities;
}
