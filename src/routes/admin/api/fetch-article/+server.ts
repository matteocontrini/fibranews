import { error, json, type RequestHandler } from '@sveltejs/kit';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	const body = await request.json();

	if (!body.url) {
		return error(400, 'Missing url');
	}

	const resp = await fetch(body.url);
	const html = await resp.text();
	const dom = new JSDOM(html);
	const article = new Readability(dom.window.document).parse();

	const title = article?.title?.trim();
	const content = article?.textContent?.trim();

	return json({
		title,
		content
	});
};
