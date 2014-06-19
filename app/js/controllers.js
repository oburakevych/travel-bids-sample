'use strict';

/* Controllers */

angular.module('tbApp.controllers', [])
  .controller('UserController', ['$rootScope' ,'$scope',
		function($rootScope, $scope) {
  	$rootScope.user = {
  		displayName: "GUEST-" + Math.floor(Math.random() * 101),
  		balance: 10
  	}
  }])
  .controller('AuctionController', ['$rootScope', '$scope', '$routeParams',  
  		function($rootScope, $scope, $routeParams) {

  	$scope.auction = {
  		id: $routeParams.id, // -J-J9pK14iFXayBDe1H5
  		name: "6 Nights Stay in Fiji",
  		description: "5 stars resort on Turtle Island",
  		endDate: Date.now() + 20000, // 20 seconds from now
  		image: "img/Turtle-Island.jpg",
  		price: 1.00,
  		status: "NEW",
  		COUNT_DOWN_TIME: 10000 // when the timer can be reset
  	}

  	$scope.biddingHistory = [];

  	$scope.canBid = function() {
		return $rootScope.user
			&& $rootScope.user.balance > 0 
			&& $scope.auction 
			&& $scope.auction.status !== "FINISHED"
			&& !$scope.timer.isBeingVerified;
	}

  	$scope.bid = function() {
  		if ($scope.canBid()) {
			$scope.auction.price = Math.round(($scope.auction.price + 0.01) * 100) / 100;
			$scope.auction.endDate = TimeUtil.getNewEndDate($scope.auction.endDate, $scope.auction.COUNT_DOWN_TIME, $scope.getTimeOffset());

			var biddingHistoryEntry = {
				auctionId: $scope.auction.id,
				price: $scope.auction.price,
				username: $rootScope.user.displayName, 
				timestamp: Date.now()
			};
			
			$scope.biddingHistory.push(biddingHistoryEntry);
			
			$scope.user.balance -= 1;
		}
	}

	$scope.getWinningBid = function() {
		return ArrayUtil.getLatestElement($scope.biddingHistory);
	}

	$scope.$on('AUCTION_FINISHED', function($event) {
		$scope.auction.status = "FINISHED";

		if (ArrayUtil.hasElements($scope.biddingHistory)) {
			$scope.auction.winner = $scope.getWinningBid();
		} else {
			$scope.auction.winner = {username: "nowinner", id: 0};
		}

		console.log("WINNER: " + $scope.auction.winner.username);
	});

	$scope.getTimeOffset = function() {
		return 0;
	}

	$scope.timer = {isBeingVerified: false}
  }]);
