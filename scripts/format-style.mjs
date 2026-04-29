import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const EXCLUDED_DIRECTORIES = new Set(['.git', 'dist', 'node_modules']);
const INCLUDED_EXTENSIONS = new Set(['.json', '.md', '.mjs', '.ts']);
const INCLUDED_FILENAMES = new Set(['.editorconfig', '.gitignore']);

/**
	* Recursively walks the repository and returns every file that should be formatted.
	*/
async function collectFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		if (entry.isDirectory()) {
			if (!EXCLUDED_DIRECTORIES.has(entry.name)) {
				files.push(...await collectFiles(path.join(directory, entry.name)));
			}

			continue;
		}

		if (shouldFormatFile(entry.name)) {
			files.push(path.join(directory, entry.name));
		}
	}

	return files;
}

/**
	* Returns whether a file should be included in repository-wide formatting.
	*/
function shouldFormatFile(filename) {
	return INCLUDED_FILENAMES.has(filename) || INCLUDED_EXTENSIONS.has(path.extname(filename));
}

/**
	* Normalizes newlines, indentation, and trailing whitespace for a file.
	*/
function formatContent(content) {
	const normalizedNewlines = content.replace(/\r\n?/g, '\n');
	const formattedLines = normalizedNewlines
		.split('\n')
		.map((line) => formatLine(line));

	return `${formattedLines.join('\n').replace(/\n+$/u, '')}\n`;
}

/**
	* Converts leading indentation to tabs and removes trailing whitespace.
	*/
function formatLine(line) {
	const trimmedLine = line.replace(/[ \t]+$/u, '');
	const indentationMatch = trimmedLine.match(/^[ \t]+/u);

	if (!indentationMatch) {
		return trimmedLine;
	}

	const indentation = indentationMatch[0];
	const content = trimmedLine.slice(indentation.length);
	const tabs = indentation.match(/\t/g)?.length ?? 0;
	const spaces = indentation.match(/ /g)?.length ?? 0;
	const indentLevels = tabs + Math.ceil(spaces / 2);

	return `${'\t'.repeat(indentLevels)}${content}`;
}

/**
	* Formats every tracked repository file that participates in the tab-based style.
	*/
async function main() {
	const files = await collectFiles(ROOT);
	let changedFiles = 0;

	for (const file of files) {
		const currentContent = await readFile(file, 'utf8');
		const formattedContent = formatContent(currentContent);

		if (formattedContent !== currentContent) {
			await writeFile(file, formattedContent);
			changedFiles += 1;
		}
	}

	console.log(`Formatted ${changedFiles} file(s).`);
}

await main();
