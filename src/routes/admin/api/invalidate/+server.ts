import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { TagEntity } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request }) => {
	const token = request.headers.get('Webhook-Token');

	if (token != env.REVALIDATE_TOKEN) {
		return json(
			{
				error: 'Invalid token'
			},
			{ status: 401 }
		);
	}

	const body = await request.json();

	// Revalidate homepage
	await revalidate(publicEnv.PUBLIC_BASE_URL);

	// Revalidate post page
	const record = body.record;
	const postPath = `${publicEnv.PUBLIC_BASE_URL}/${record.date.slice(0, 4)}/${record.slug}`;
	await revalidate(postPath);

	// Revalidate old post page
	const oldRecord = body.oldRecord;
	if (oldRecord && oldRecord.slug != record.slug) {
		const oldPostPath = `${publicEnv.PUBLIC_BASE_URL}/${oldRecord.date.slice(0, 4)}/${oldRecord.slug}`;
		await revalidate(oldPostPath);
	}

	// Extract post tags
	const postId = body.record.id;
	const tags = await TagEntity.find({
		where: {
			posts: {
				id: postId
			}
		}
	});

	// Revalidate tag pages
	for (const tag of tags) {
		const tagPath = `${publicEnv.PUBLIC_BASE_URL}/${tag.slug}`;
		await revalidate(tagPath);
	}

	return json({
		ok: true
	});
};

async function revalidate(url: string) {
	console.log('Revalidating: ' + url);

	const headers = new Headers();
	headers.append('x-prerender-revalidate', env.REVALIDATE_TOKEN);

	await fetch(url, {
		method: 'HEAD',
		headers
	});
}
