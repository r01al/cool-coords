import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const EXCLUDED_DIRECTORIES = new Set(['.git', 'dist', 'node_modules']);
const INCLUDED_EXTENSIONS = new Set(['.json', '.md', '.mjs', '.ts']);
const INCLUDED_FILENAMES = new Set(['.editorconfig', '.gitignore']);
const FUNCTION_PATTERN = /^(export\s+)?function\s+[A-Za-z0-9_]+\s*\(/u;

/**
	* Recursively walks the repository and returns every file that should be linted.
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

		if (shouldLintFile(entry.name)) {
			files.push(path.join(directory, entry.name));
		}
	}

	return files;
}

/**
	* Returns whether a file participates in style linting.
	*/
function shouldLintFile(filename) {
	return INCLUDED_FILENAMES.has(filename) || INCLUDED_EXTENSIONS.has(path.extname(filename));
}

/**
	* Checks one file for tab indentation, trailing whitespace, and newline issues.
	*/
function lintWhitespace(file, content, errors) {
	if (content.includes('\r')) {
		errors.push(`${file}: use LF newlines only.`);
	}

	const lines = content.split('\n');

	for (let index = 0; index < lines.length; index += 1) {
		const lineNumber = index + 1;
		const line = lines[index];

		if (/[ \t]+$/u.test(line)) {
			errors.push(`${file}:${lineNumber}: trailing whitespace is not allowed.`);
		}

		if (/^[\t]* +/u.test(line)) {
			errors.push(`${file}:${lineNumber}: leading indentation must use tabs only.`);
		}
	}

	if (!content.endsWith('\n')) {
		errors.push(`${file}: file must end with a newline.`);
	}
}

/**
	* Ensures that every function declaration in src files is documented with JSDoc.
	*/
function lintFunctionDocs(file, content, errors) {
	if (!file.startsWith(path.join(ROOT, 'src')) || path.extname(file) !== '.ts') {
		return;
	}

	const lines = content.split('\n');

	for (let index = 0; index < lines.length; index += 1) {
		const trimmed = lines[index].trimStart();

		if (!FUNCTION_PATTERN.test(trimmed)) {
			continue;
		}

		let previousIndex = index - 1;

		while (previousIndex >= 0 && lines[previousIndex].trim() === '') {
			previousIndex -= 1;
		}

		if (previousIndex < 0 || !lines[previousIndex].trim().endsWith('*/')) {
			errors.push(
				`${file}:${index + 1}: function declarations in src/ must have a preceding JSDoc comment.`
			);
		}
	}
}

/**
	* Lints every style-managed file in the repository.
	*/
async function main() {
	const files = await collectFiles(ROOT);
	const errors = [];

	for (const file of files) {
		const content = await readFile(file, 'utf8');

		lintWhitespace(file, content, errors);
		lintFunctionDocs(file, content, errors);
	}

	if (errors.length > 0) {
		console.error(errors.join('\n'));
		process.exitCode = 1;
		return;
	}

	console.log(`Linted ${files.length} file(s) with no style errors.`);
}

await main();
