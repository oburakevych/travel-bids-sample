'use strict';

/* Controllers */

angular.module('tbApp.controllers', [])
  .controller('AuctionController', ['$scope', '$routeParams', '$firebase', 'firebaseReference', 
  		function($scope, $routeParams, $firebase, firebaseReference) {
  	$scope.user = {
  		name: "GUEST" + Math.floor(Math.random() * 101),
  		id: Math.floor(Math.random() * 101),
  		balance: 10
  	}

  	var auctionRef = firebaseReference.child("auction").child($routeParams.auctionId); // -J-J9pK14iFXayBDe1H5


  	$firebase(auctionRef).$bind($scope, 'auction').then(
  		function() {
  			var biddingHistoryRef = firebaseReference.child('bidding-history/auction/' + $scope.auction.id);

  			$scope.biddingHistory = $firebase(biddingHistoryRef.limit(5));
  		}
  	);

  	$scope.bid = function() {
  		if ($scope.canBid()) {
			$scope.auction.$transaction(function(auction) {
				auction.price = Math.round((auction.price + 0.01) * 100) / 100;
				auction.endDate = TimeUtil.getNewEndDate($scope.auction.endDate, $scope.auction.COUNT_DOWN_TIME);

				$scope.biddingHistoryEntry = $scope.biddingHistory.$add({'username': $scope.user.name, 'userId': $scope.user.id, 'date': Firebase.ServerValue.TIMESTAMP});	
				$scope.user.balance -= 1;

				return auction;
			}).then(function(snapshot) {
				// committed successfully				
			}, function(error) {
				console.error("Error increasing auction price: " + error);
				$scope.biddingHistoryEntry.remove();
				$scope.user.balance += 1;
			});
		}
	}

	$scope.canBid = function() {
		return $scope.user.balance > 0 
			&& $scope.auction 
			&& !$scope.timer.auctionVerify
			&& $scope.auction.status !== "FINISHED";
	}

	$scope.$on('AUCTION_FINISHED', function() {
		$scope.auction.status = "FINISHED";

		if (ArrayUtil.hasElements($scope.biddingHistory)) {
			$scope.auction.winner = ArrayUtil.getLatestElement($scope.biddingHistory);
		} else {
			$scope.auction.winner = {username: "nowinner", id: 0};
		}

		console.log("WINNER: " + $scope.auction.winner.username);
	});

	$scope.timer = {auctionVerify: false}
  }]);
