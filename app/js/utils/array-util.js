var ArrayUtil = {

}

ArrayUtil.hasElements = function(obj) {
	if (!obj) {
		return false;
	}

	if (angular.isArray(obj)) {
		return obj.length > 0;
	} else if (obj.$getIndex){
		return obj.$getIndex().length > 0;
	}

	return false;
}

ArrayUtil.getLatestElement = function(obj) {
	if (!obj) {
		return false;
	}

	if (angular.isArray(obj)) {
		return obj[0];
	} else if (obj.$getIndex) {
		var arrayOfKeys = obj.$getIndex();
		return obj[arrayOfKeys[arrayOfKeys.length - 1]];		
	}

	return null;
}