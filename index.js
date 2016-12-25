const currDir = process.cwd();

function resolveFile(relPath) {
	return currDir + '/' + relPath;
}

const currentPackage = require(resolveFile('package.json'));
const fs = require('fs');
const path = require('path');

if (!currentPackage['binline']) {
	console.log(currentPackage);

	throw 'No bline config in your package.json';
}

const files = currentPackage['binline'].files;

function executeCommand(file, commands) {
	const mainCmd = commands[0];
	let initialValue;

	if (mainCmd.startsWith('@inline')) {
		const theFile = path.join(path.dirname(file.from), mainCmd.match(/@inline "(.*)"/)[1]);

		initialValue = fs.readFileSync(theFile, 'utf8');
	}
	else {
		// No command found
		return '';
	}

	return commands.slice(1).reduce((acc, cmd) => {
		const lambda = eval(cmd);
		return lambda(acc);
	}, initialValue);
}

files.forEach(function (file) {
	fs.readFile(file.from, 'utf8', function (err, content) {
		console.log('Compiling "' + file.from + '"');
		if (err) {
			throw err;
		}

		const newContent = content.replace(/\{\{((.|\n|\r\n)*?)\}\}/g, function (match, expr) {
			const cmds = expr.split('|').map(str => str.trim());
			return executeCommand(file, cmds);
		});

		fs.writeFile(file.to, newContent, 'utf8', function (err) {
			if (err) {
				throw err;
			}

			console.log('Built "' + file.from + '" to "' + file.to + '"');
		});
	});
});
