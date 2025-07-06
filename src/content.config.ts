import { glob } from 'astro/loaders';
import { defineCollection, getCollection, z } from 'astro:content';
import type { CollectionEntry, CollectionKey, ImageFunction } from 'astro:content';

// Base schema for all collections
const createCollectionSchema = ({ image }: { image: ImageFunction }) => z.object({
	title: z.string(),
	heroImage: image().optional(),
	featuredImage: image(),
	mediumUrl: z.string().optional(),
	// Transform string to Date object
	link: z.string().optional(),
	updatedDate: z.coerce.date().optional(),
	heroStyle: z.enum(['normal', 'large', 'full-bleed', 'none']).optional(),
	width: z.enum(['full', 'normal']).optional(),
});

const writing = defineCollection({
	loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) => createCollectionSchema({ image }).extend({
		date: z.coerce.date(),
	}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) => createCollectionSchema({ image }).extend({
		date: z.coerce.date(),
	}),
});

const teams = defineCollection({
	loader: glob({ base: './src/content/teams', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) => createCollectionSchema({ image }).extend({
		date: z.coerce.date(),
		start: z.string().or(z.number()),
		end: z.string().or(z.number()).optional(),
		role: z.string(),
		link: z.string().optional(),
	}),
});

const lists = defineCollection({
	loader: glob({ base: './src/content/lists', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) => createCollectionSchema({ image }).extend({
		date: z.coerce.date(),
	}),
});

const talks = defineCollection({
	loader: glob({ base: './src/content/talks', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) => createCollectionSchema({ image }).extend({
		date: z.coerce.date(),
		cta: z.string(),
		location: z.object({
			name: z.string(),
			link: z.string().optional(),
		}).optional(),
	}),
});

const travel = defineCollection({
	loader: glob({ base: './src/content/travel', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) => createCollectionSchema({ image }).extend({
		imageRoots: z.array(z.string()),
		cities: z.array(z.string()),
		startDate: z.coerce.date().optional(),
		endDate: z.coerce.date().optional(),
		timePeriod: z.coerce.string().optional(),
	}),
});

export const getPostDate = (post: CollectionEntry<PostLike>): Date => {
	if ('date' in post.data) return post.data.date;
	if ('startDate' in post.data) return post.data.startDate ?? new Date();
	return new Date();
};

export const getCollectionRevChron = async (collectionKey: CollectionKey) => {
	const collection = await getCollection(collectionKey);
	return collection.sort((a, b) => getPostDate(b).valueOf() - getPostDate(a).valueOf());
};

export const makePostSlug = (post: CollectionEntry<PostLike>) => {
	return post.id.replace(/^\d{4}-\d{2}-\d{2}-/, "")
};

export type PostLike = "writing" | "lists" | "travel" | 'teams' | 'projects' | 'talks';

export const collections = { writing, lists, travel,teams, projects, talks };
