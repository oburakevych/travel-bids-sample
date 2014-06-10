'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('AuctionController', ['$scope', '$firebase', 'firebaseReference', function($scope, $firebase, firebaseReference) {
  	$scope.user = {
  		name: "GUEST" + Math.floor(Math.random() * 101),
  		id: Math.floor(Math.random() * 101),
  		balance: 10
  	}

  	var AUCTION_ID = "-J-J9pK14iFXayBDe1H5";
  	var auctionRef = firebaseReference.child("auction").child(AUCTION_ID);


  	$firebase(auctionRef).$bind($scope, 'auction').then(
  		function() {
  			var biddingHistoryRef = firebaseReference.child('bidding-history/auction/' + $scope.auction.id);

  			$scope.biddingHistory = $firebase(biddingHistoryRef.limit(5));
  		}
  	);

  	$scope.bid = function() {
  		if ($scope.user.balance > 0) {
			$scope.auction.$transaction(function(auction) {
				auction.price = Math.round((auction.price + 0.01) * 100)/100;

				$scope.biddingHistoryEntry = $scope.biddingHistory.$add({'username': $scope.user.name, 'userId': $scope.user.id, 'date': Firebase.ServerValue.TIMESTAMP});	
				return auction;
			}).then(function(snapshot) {
				// committed successfully
				$scope.user.balance -= 1;
			}, function(error) {
				console.error("Error increasing auction price: " + error);
				$scope.biddingHistoryEntry.remove();
			});
		}
	}
  }]);
