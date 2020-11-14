import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

const delimiter = path.sep;

try {
	const changedFiles: string[] = JSON.parse(core.getInput('changed-files'));
	const tsBuildInfoFilenames: string[] = core
		.getInput('tsBuildInfoFile')
		.split('\n')
		.filter(x => x !== '');

	core.info('changedFiles: ' + changedFiles.length);
	core.info('tsBuildInfoFilenames: ' + JSON.stringify(tsBuildInfoFilenames));

	tsBuildInfoFilenames.forEach(tsBuildInfoFilename => {
		changedFiles.forEach(changedFile => {
			const fileParts = path.dirname(changedFile).split(delimiter);
			let fileFound: undefined | string;

			do {
				const tsbuildInfoFile = path.join(fileParts.join(delimiter), tsBuildInfoFilename);
				// console.log('tsbuildInfoFile', fileParts, tsbuildInfoFile, fileParts.length);
				if (fs.existsSync(tsbuildInfoFile)) {
					fileFound = tsbuildInfoFile;
				}
				fileParts.pop();
			} while (fileParts.length > 0 && !fileFound);

			if (fileFound) {
				core.info('removing ts buildinfo file ' + fileFound);
				fs.unlinkSync(fileFound);
			}
		});
	});
} catch (error) {
	core.setFailed(error.message);
}
