# Binline

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

To let the thing work you need to setup the files to compile in your `package.json`:
```
{
	...
	"binline": {
		"files": [
			{ "from": "./index.html", "to": "./public/index.html" }
		]
	}
	...
}
```

Just call `binline` from the shell to build everything

## Going advanced

For now you can only use `@inline`, but the expressions can become more complex.
Advanced command to uglify the code:
```html
	...
	{{
		@inline "./app.js"
		| content => require('uglify-js').minify(content, { fromString: true }).code
	}}
	...
```
You may pass more commands separated by a `|`. After the first directive (`@inline`) the binline expects a
series of arrow function transform text.

## Future

### 1

Add a way to predefine transformers:
```html
...
{{ @define uglify | content => require('uglify-js').minify(content, { fromString: true }).code }}
...
```
and use them:
```html
...
{{ @inline "./app.js" | uglify }}
...
```

### 2

When predefined trasformers will be a thing I might add a small registry with a list of common transformers (uglify, babel, sass, less, coffeescript, ...)
