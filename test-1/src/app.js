
console.log('Testing BlineJS');

exports.myVariable = 42;

exports.myFunction = function (list, prefix) {
	return list.map(function (x) {
		return prefix + '' + x;
	});
}
