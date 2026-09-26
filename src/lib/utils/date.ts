const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

// Dates are formatted by hand (instead of toLocaleDateString) so the output is
// identical at build time and in every visitor's browser, whatever their locale.
// UTC is used because frontmatter dates like `2026-09-26` are parsed as UTC midnight.

/** "26 Sep 2026" — used in lists. */
export function formatShortDate(iso: string): string {
	const d = new Date(iso);
	return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`;
}

/** "September 26, 2026" — used at the top of a post. */
export function formatLongDate(iso: string): string {
	const d = new Date(iso);
	return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
