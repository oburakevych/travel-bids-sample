'use strict';


// Declare app level module which depends on filters, and services
angular.module('tbApp', [
  'ngRoute',
  'tbApp.filters',
  'tbApp.services',
  'tbApp.directives',
  'tbApp.controllers',
  'tbApp.config',
  'firebase'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/auctions', {templateUrl: 'partials/auctions.html'});
  $routeProvider.when('/auctions/:auctionId', {templateUrl: 'partials/auction.html', controller: 'AuctionController'});
  $routeProvider.otherwise({redirectTo: '/auctions'});
}]);