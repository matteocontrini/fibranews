import { error, json, type RequestHandler } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	const body = await request.json();

	if (!body.text) {
		return error(400, 'Missing text');
	}

	const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

	const prompt = `Riassumi il seguente articolo, seguendo queste regole:
- Il riassunto deve essere lungo al massimo 600 caratteri e al massimo 2 paragrafi.
- Sii conciso, ma completo inserendo tutte le informazioni importanti.
- Usa un italiano corretto.
- Molto importante: lo stile deve essere enciclopedico, non usare espressioni tipiche dei comunicati stampa o del marketing.

<article>
${body.text}
</article>`;

	const result = await model.generateContent(prompt);
	const text = result.response.text();

	return json({
		summary: text
	});
};
