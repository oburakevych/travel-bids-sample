'use strict';


// Declare app level module which depends on filters, and services
angular.module('tbApp', [
  'ngRoute',
  'tbApp.filters',
  'tbApp.services',
  'tbApp.directives',
  'tbApp.controllers',
  'tbApp.config'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/auctions', {templateUrl: 'partials/tb-auctions.html'});
  $routeProvider.when('/auctions/:id', {templateUrl: 'partials/tb-auction.html', controller: 'AuctionController'});
  $routeProvider.otherwise({redirectTo: '/auctions'});
}]);
