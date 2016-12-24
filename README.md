# Bline

A pocket build tool for web-development (or more).
(motto: The build system for the lazy developer)

## Usage

This might be `./index.html`:
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Testing</title>
	</head>
	<body>
		<h1>A Test Page</h1>
		<script>
			{{ @inline "./app.js"}}
		</script>
	</body>
</html>
```

and this `./app.js`:
```javascript
// Some random code

console.log('Hello World!');

```

To let the thing work you need to setup the files in your `package.json`:
```json
{
	...
	"bline": {
		"files": [
			{ "from": "./index.html", "to": "./public/index.html" }
		]
	}
	...
}
```

Just call `bline` from the shell to build everything
