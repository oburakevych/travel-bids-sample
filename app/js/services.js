'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .constant('FIREBASE_URL', 'https://travel-bids-sample.firebaseio.com/')
  .factory('firebaseReference', ['$firebase', 'FIREBASE_URL', function($firebase, FIREBASE_URL) {
	return new Firebase(FIREBASE_URL);
}]);
