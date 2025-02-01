import { redirect } from '@sveltejs/kit';
import { ILike, IsNull } from 'typeorm';
import { PostEntity } from '$lib/server/db/schema';
import type { AdminPost } from '$lib/server/admin/types';
import { convertDate } from '$lib/server/mapping';

export async function load({ locals, url }) {
	if (!locals.user) {
		return redirect(302, '/admin/login');
	}

	const q = url.searchParams.get('q');
	if (q === '') {
		return redirect(302, '/admin');
	}

	const posts = await PostEntity.find({
		where: {
			deletedAt: IsNull(),
			...(q ? { title: ILike(`%${q}%`) } : {})
		},
		order: {
			date: 'DESC'
		},
		relations: {
			tags: true
		}
	});

	return {
		q,
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
		year: x.date.slice(0, 4),
		hideDay: x.hideDay,
		tags: x.tags.map((t) => ({ slug: t.slug }))
	};
}
