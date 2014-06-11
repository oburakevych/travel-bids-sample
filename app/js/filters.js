'use strict';

/* Filters */

angular.module('tbApp.filters', [])
	.filter('readableTime', [function() {
	    return function(millisLeft) {
	    	if (!millisLeft) {
	    		return "";
	    	}

	    	return TimeUtil.millisToReadableText(millisLeft);
	    }
	}]);