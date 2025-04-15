import { build } from 'bun';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const getAllFiles = async (dirPath: string, arrayOfFiles: string[] = []): Promise<string[]> => {
	try {
		const files = await readdir(dirPath);
		for (const file of files) {
			const filePath = join(dirPath, file);
			const stats = await stat(filePath);
			if (stats.isDirectory()) {
				await getAllFiles(filePath, arrayOfFiles);
			} else if (file.endsWith('.ts')) {
				arrayOfFiles.push(filePath);
			}
		}
	} catch (error) {
		console.error(`📛 ${dirPath}:`, error);
	}
	return arrayOfFiles;
};

(async () => {
	try {
		const srcFiles = await getAllFiles('./src');
		const entrypoints = [...srcFiles];

		await build({
			entrypoints,
			outdir: './dist',
			target: 'bun',
		});
		console.log('✅ build complete');
	} catch (error) {
		console.error('📛 build error:', error);
	}
})();
