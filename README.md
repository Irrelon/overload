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

## Shared Main Method
Your overloaded functions support calling a primary function that will handle
all variations of your funtion signatures. This allows you to write a single
piece of logic that all overloaded functions can call to reduce code replication.

Here is an example from ForerunnerDB's Collection class:

	Core.prototype.collection = new Overload({
		/**
		 * Get a collection by name. If the collection does not already exist
		 * then one is created for that name automatically.
		 * @param {Object} options An options object.
		 * @returns {Collection}
		 */
		'object': function (options) {
			return this.$main.call(this, options);
		},
	
		/**
		 * Get a collection by name. If the collection does not already exist
		 * then one is created for that name automatically.
		 * @param {String} collectionName The name of the collection.
		 * @returns {Collection}
		 */
		'string': function (collectionName) {
			return this.$main.call(this, {
				name: collectionName
			});
		},
	
		/**
		 * Get a collection by name. If the collection does not already exist
		 * then one is created for that name automatically.
		 * @param {String} collectionName The name of the collection.
		 * @param {String} primaryKey Optional primary key to specify the primary key field on the collection
		 * objects. Defaults to "_id".
		 * @returns {Collection}
		 */
		'string, string': function (collectionName, primaryKey) {
			return this.$main.call(this, {
				name: collectionName,
				primaryKey: primaryKey
			});
		},
	
		/**
		 * Get a collection by name. If the collection does not already exist
		 * then one is created for that name automatically.
		 * @param {String} collectionName The name of the collection.
		 * @param {Object} options An options object.
		 * @returns {Collection}
		 */
		'string, object': function (collectionName, options) {
			options.name = collectionName;
	
			return this.$main.call(this, options);
		},
	
		/**
		 * Get a collection by name. If the collection does not already exist
		 * then one is created for that name automatically.
		 * @param {String} collectionName The name of the collection.
		 * @param {String} primaryKey Optional primary key to specify the primary key field on the collection
		 * objects. Defaults to "_id".
		 * @param {Object} options An options object.
		 * @returns {Collection}
		 */
		'string, string, object': function (collectionName, primaryKey, options) {
			options.name = collectionName;
			options.primaryKey = primaryKey;
	
			return this.$main.call(this, options);
		},
	
		/**
		 * The main handler method. This get's called by all the other variants and
		 * handles the actual logic of the overloaded method.
		 * @param {Object} options An options object.
		 * @returns {*}
		 */
		'$main': function (options) {
			var name = options.name;
	
			if (name) {
				if (!this._collection[name]) {
					if (options && options.autoCreate === false) {
						throw('ForerunnerDB.Core "' + this.name() + '": Cannot get collection ' + name + ' because it does not exist and auto-create has been disabled!');
					}
	
					if (this.debug()) {
						console.log('Creating collection ' + name);
					}
				}
	
				this._collection[name] = this._collection[name] || new Collection(name).db(this);
	
				if (options.primaryKey !== undefined) {
					this._collection[name].primaryKey(options.primaryKey);
				}
	
				return this._collection[name];
			} else {
				throw('ForerunnerDB.Core "' + this.name() + '": Cannot get collection with undefined name!');
			}
		}
	});
	
Notice that the defined $main function can be referenced from each of the 
overloaded functions via *this.$main()*.