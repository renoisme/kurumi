import { build } from 'bun';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// ディレクトリ内のすべての.tsファイルを再帰的に取得する関数
const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
	const files = readdirSync(dirPath);

	files.forEach((file) => {
		const filePath = join(dirPath, file);
		if (statSync(filePath).isDirectory()) {
			arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
		} else if (file.endsWith('.ts')) {
			arrayOfFiles.push(filePath);
		}
	});

	return arrayOfFiles;
};

// srcディレクトリとmodulesディレクトリ内のすべての.tsファイルを取得
const srcFiles: string[] = getAllFiles('./src');
const entrypoints: string[] = [...srcFiles];

await build({
	entrypoints,
	outdir: './dist',
	target: 'bun',
});
