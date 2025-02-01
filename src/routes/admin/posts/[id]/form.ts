import { z } from 'zod';

export const schema = z.object({
	title: z.string().min(3).max(255),
	content: z.string().min(3).max(16384)
});
