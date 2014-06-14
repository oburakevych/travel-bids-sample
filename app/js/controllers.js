'use strict';

/* Controllers */

angular.module('tbApp.controllers', [])
  .controller('AuctionController', ['$scope', '$routeParams',  
  		function($scope, $routeParams) {
  	$scope.user = {
  		name: "GUEST-" + Math.floor(Math.random() * 101),
  		balance: 10
  	}

  	$scope.auction = {
  		id: $routeParams.id, // -J-J9pK14iFXayBDe1H5
  		name: "6 Nights Stay in Fiji resort",
  		endDate: Date.now() + 20000,
  		image: "img/fiji.jpg",
  		price: 1.00,
  		status: "NEW",
  		COUNT_DOWN_TIME: 10000
  	}

  	$scope.biddingHistory = [];

  	$scope.canBid = function() {
		return $scope.user.balance > 0 
			&& $scope.auction 
			&& $scope.auction.status !== "FINISHED"
			&& !$scope.timer.isBeingVerified;
	}

  	$scope.bid = function() {
  		if ($scope.canBid()) {
			$scope.auction.price = Math.round(($scope.auction.price + 0.01) * 100) / 100;
			$scope.auction.endDate = TimeUtil.getNewEndDate($scope.auction.endDate, $scope.auction.COUNT_DOWN_TIME);

			$scope.biddingHistoryEntry = {
				auctionId: $scope.auction.id,
				username: $scope.user.name, 
				timestamp: Date.now()
			};
			$scope.biddingHistory.push($scope.biddingHistoryEntry);
			
			$scope.user.balance -= 1;
		}
	}

	$scope.$on('AUCTION_FINISHED', function($event) {
		$scope.auction.status = "FINISHED";

		if (ArrayUtil.hasElements($scope.biddingHistory)) {
			$scope.auction.winner = ArrayUtil.getLatestElement($scope.biddingHistory);
		} else {
			$scope.auction.winner = {username: "nowinner", id: 0};
		}

		console.log("WINNER: " + $scope.auction.winner.username);
	});

	$scope.timer = {isBeingVerified: false}
  }]);
