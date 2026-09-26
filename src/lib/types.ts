/** Everything known about a markdown file without rendering it. */
export interface EntryMeta {
	/** Folder it lives in under src/content/, e.g. "posts". */
	collection: string;
	/** File name without ".md" — also its URL segment. */
	slug: string;
	title: string;
	summary?: string;
	/** ISO date string, e.g. "2026-09-26T00:00:00.000Z". */
	date?: string;
	draft: boolean;
	toc: boolean;
	/** Minutes. */
	readingTime: number;
}

/** A markdown file rendered to HTML, ready to display. */
export interface Entry extends EntryMeta {
	html: string;
	/** Headings for the table of contents. */
	tocItems: TocItem[];
}

/** A heading in a post's table of contents. */
export interface TocItem {
	/** 2 for h2, 3 for h3 */
	depth: number;
	id: string;
	text: string;
}
