# Overload
Simple JavaScript Method Overloading

## Usage
You can create a new function that takes overloaded calls by definining what those calls should accept by type.

Here is an example of usage:
```
var user = new Overload({
	// Get user name and data
	"": function () {
		return {
			"name": this._name,
			"data": this._data
		};
	},

	// Set user name
	"string": function (name) {
		this._name = name;
	},

	// Set user data
	"object": function (data) {
		this._data = data;
	},

	// Set user name and data
	"string, object": function (name, data) {
		this._name = name;
		this._data = data;
	},

	// Take arbitrary number of exta arguments
	"string, object, ...": function () {
		// Can access arguments through the "arguments" object
		console.log(arguments);
	},

	// Take any type as an argument
	"string, *, object": function () {
		console.log(arguments);
	}
});
```
