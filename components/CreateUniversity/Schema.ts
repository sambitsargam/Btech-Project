import { z } from 'zod';
const shortnameRegex = /^[\w-]+$/g;

export const schema = z.object({
	accountName: z
		.string()
		.min(3, { message: 'Account name should have at least 3 characters' })
		.max(24, {
			message: 'Account name should not be longer than 24 characters',
		})
		.regex(shortnameRegex, {
			message:
				'Account name can only contain letters, numbers, and dashes',
		})
		.refine((val) => val.toLocaleLowerCase() === val, {
			message: 'Account name can only contain lowercase letters',
		}),
	displayName: z
		.string()
		.min(3, { message: 'Display name should have at least 3 characters' })
		.max(24, {
			message: 'Display name should not be longer than 32 characters',
		}),
	website: z.string(),
	description: z.string().max(500, {
		message: 'Description should be shorter than 500 characters',
	}),
});
