const currDir = process.argv[2] || '.';

function resolveFile(relPath) {
	return currDir + '/' + relPath;
}

const currentPackage = require(resolveFile('package.json'));
const fs = require('fs');
const path = require('path');

if (!currentPackage['bline']) {
	throw 'No bline config in your package.json';
}

const files = currentPackage['bline'].files;

// console.log("BLINE CONFIG: ");
// console.log(JSON.stringify(currentPackage['bline'], null, 2));

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
		// console.log('lambda: ' + lambda.toString());
		return lambda(acc);
	}, initialValue);
}

files.forEach(function (file) {
	fs.readFile(file.from, 'utf8', function (err, content) {
		if (err) {
			throw err;
		}

		const newContent = content.replace(/\{\{((.|\n|\r\n)*?)\}\}/g, function (match, expr) {
			// console.log('EXPRESSION:');

			const cmds = expr.split('|').map(str => str.trim());

			// cmds.forEach(x => console.log('CMD: ' + x));

			return executeCommand(file, cmds);
		});

		fs.writeFileSync(file.to, newContent, 'utf8');
	});
});
