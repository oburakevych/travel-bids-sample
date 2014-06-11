'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('tbApp.services', [])
  .factory('firebaseReference', ['$firebase', 'FIREBASE_URL', function($firebase, FIREBASE_URL) {
	return new Firebase(FIREBASE_URL);
}]);
