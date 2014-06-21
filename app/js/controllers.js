'use strict';

/* Controllers */

angular.module('tbApp.controllers', [])
  .controller('UserController', ['$rootScope' ,'$scope', '$firebaseSimpleLogin', 'firebaseReference',
		function($rootScope, $scope, $firebaseSimpleLogin, firebaseReference) {
	var auth = $firebaseSimpleLogin(firebaseReference);
	
	$scope.signin = function() {
		auth.$login('facebook').then(function(user) {
			$rootScope.user	 = user;
			$rootScope.user.balance = 10;
		});
	 }
  }])
  .controller('AuctionController', ['$rootScope', '$scope', '$routeParams',  '$firebase', 'firebaseReference',
  		function($rootScope, $scope, $routeParams, $firebase, firebaseReference) {

  	$firebase(firebaseReference.child('auction').child($routeParams.id))
  		.$bind($scope, 'auction')
  		.then(function() {
  			$scope.biddingHistory = $firebase(firebaseReference.child("biddingHistory").child($scope.auction.id).limit(5));
  		}
  	);

  	$scope.canBid = function() {
		return $rootScope.user
			&& $rootScope.user.balance > 0 
			&& $scope.auction 
			&& $scope.auction.status !== "FINISHED"
			&& !$scope.timer.isBeingVerified;
	}

  	$scope.bid = function() {
  		if ($scope.canBid()) {
  			$scope.auction.$transaction(function(auction) {
				auction.price = Math.round((auction.price + 0.01) * 100) / 100;
				auction.endDate = TimeUtil.getNewEndDate(auction.endDate, auction.COUNT_DOWN_TIME, $scope.getTimeOffset());

				return auction;
  			}).then(function(snapshot) {
  				if (!snapshot) {
  					console.log("transaction aborded");
  				} else {
  					var auction = snapshot.val();
					var biddingHistoryEntry = {
						auctionId: auction.id,
						price: auction.price,
						username: $rootScope.user.displayName, 
						timestamp: Date.now()
					};
					
					$scope.biddingHistory.$add(biddingHistoryEntry);
					
					$scope.user.balance -= 1;					
  				}
  			}, function(error) {
  				console.warn(error);
  			});
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

		$event.stopPropagation();
	});

	$scope.getTimeOffset = function() {
		return 0;
	}

	$scope.timer = {isBeingVerified: false}
  }]);
