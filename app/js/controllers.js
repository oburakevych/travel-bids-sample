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
				auction.price = Math.round((auction.price + 0.01) * 100)/100;
				auction.endDate = $scope.getNewEndDate();

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
		return $scope.user.balance > 0 && $scope.auction.status !== "FINISHED";
	}

	$scope.getNewEndDate = function() {
			var millis = Date.now() + $scope.auction.COUNT_DOWN_TIME;

			if(millis < $scope.auction.endDate) {
				return $scope.auction.endDate;
			}

			return millis;
		}

	$scope.resetTimer = function() {
		$scope.auction.$transaction(function(auction) {
				console.log("About to Set COUNTDOWN in transaction");
				auction.status = "COUNTDOWN";
				console.log("Set COUNTDOWN in transaction");
				auction.endDate = Date.now() + $scope.resetSeconds * 1000;
				auction.winnerUserId = null;
				auction.price = 1.00;

				return auction;
		}).then(function() {
			$scope.user.balance = 10;
		});
	}

	$scope.resetSeconds = 20;

	$scope.$on('AUCTION_FINISHED', function() {
		$scope.auction.status = "FINISHED";

		if ($scope.biddingHistory.$getIndex().length > 0) {
			var historyArray = $scope.biddingHistory.$getIndex();

			$scope.auction.winnerUserId = $scope.biddingHistory[historyArray[historyArray.length - 1]].username;
		} else {
			console.warn("Auction finished with no winner");
			$scope.auction.winnerUserId = "nowinner";
		}

		console.log("WINNER: " + $scope.auction.winnerUserId);
					
		//$scope.winner = $firebase(firebaseReference.child("/user/" + $scope.auction.winnerUserId + "/name"));
	})
  }]);
