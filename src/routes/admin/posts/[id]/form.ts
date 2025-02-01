import { z } from 'zod';

export const schema = z.object({
	title: z.string().min(3).max(255),
	content: z.string().min(3).max(16384),
	published: z.boolean(),
	slug: z.string().min(3).max(255),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.default(() => new Date().toISOString().slice(0, 10)),
	hideDay: z.boolean().default(false)
});
