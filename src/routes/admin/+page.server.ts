import { redirect } from '@sveltejs/kit';
import { IsNull } from 'typeorm';
import { PostEntity } from '$lib/server/db/schema';
import type { AdminPost } from '$lib/server/admin/types';
import { convertDate } from '$lib/server/mapping';

export async function load({ locals }) {
	if (!locals.user) {
		return redirect(302, '/admin/login');
	}

	const posts = await PostEntity.find({
		where: {
			deletedAt: IsNull()
		},
		order: {
			date: 'DESC'
		},
		relations: {
			tags: true,
		}
	});

	return {
		posts: posts.map(mapPost),
		seo: {
			title: 'Fibra.news ADMIN'
		}
	};
}

function mapPost(x: PostEntity): AdminPost {
	return {
		id: x.id,
		title: x.title,
		slug: x.slug,
		date: convertDate(x.date, false),
		hideDay: x.hideDay,
		tags: x.tags.map((t) => ({ slug: t.slug })),
	};
}
