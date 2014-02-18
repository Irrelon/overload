var Overload = function (arr) {
	if (arr) {
		var arrIndex,
			arrCount = arr.length;

		return function () {
			for (arrIndex = 0; arrIndex < arrCount; arrIndex++) {
				if (arr[arrIndex].length === arguments.length) {
					return arr[arrIndex].apply(this, arguments);
				}
			}
		}
	} else {
		return function () {};
	}
};
