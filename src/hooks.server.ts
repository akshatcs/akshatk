import type { HandleServerError } from '@sveltejs/kit';

/**
 * Prints the full message of any unexpected error (e.g. an image missing from a post)
 * in the terminal, during both `npm run dev` and `npm run build`.
 */
export const handleError: HandleServerError = ({ error, event }) => {
	console.error(`\nError on ${event.url.pathname}:\n`, error);
};
