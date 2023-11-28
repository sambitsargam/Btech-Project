import { z } from 'zod';

export const shortnameRegex = /^[\w-]+$/g;
export const youtubeRegex =
	/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/; // https://stackoverflow.com/a/27728417

export const refineYouTube = (val: string) =>
	val.length === 0 || youtubeRegex.test(val);

export const schema = z.object({
	projectName: z
		.string()
		.min(3, { message: 'Project name should have at least 3 characters' })
		.max(24, {
			message: 'Project name should not be longer than 24 characters',
		})
		.regex(shortnameRegex, {
			message:
				'Project name can only contain letters, numbers, and dashes',
		})
		.refine((val: string) => val.toLocaleLowerCase() === val, {
			message: 'Project name can only contain lowercase letters',
		}),
	displayName: z
		.string()
		.min(3, { message: 'Display name should have at least 3 characters' })
		.max(24, {
			message: 'Display name should not be longer than 32 characters',
		}),
	website: z.string(),
	description: z.string(),
	youTubeLink: z
		.string()
		.refine(refineYouTube, { message: 'YouTube link format is invalid.' }),
	shortDescription: z
		.string()
		.max(100, {
			message: 'Description should be shorter than 100 characters',
		}),
	type: z.string(),
	tags: z.string().array(),
});
