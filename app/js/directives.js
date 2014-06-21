'use strict';

/* Directives */


angular.module('tbApp.directives', [])
	.directive('tbCountdownTimer', ['$timeout', 'AUCTION_VERIFY_CONDITION', 'AUCTION_FINISHED_CONDITION', 'COUNT_DOWN_INTERVAL', 
			function($timeout, AUCTION_VERIFY_CONDITION, AUCTION_FINISHED_CONDITION, COUNT_DOWN_INTERVAL) {
		return {
			restrict: 'AE',
			link: function($scope, element, attrs) {
				$scope.calculateTimeLeft = function() {
					return $scope.auction.endDate - Date.now() - $scope.getTimeOffset();
				}

				$scope.startCountdown = function() {
					$scope.timeLeft = $scope.calculateTimeLeft();

					$scope.auctionIntervalTimerId = setInterval(function() {
						$scope.$apply(function() {
							//var start = Date.now();
							if ($scope.auction.status === 'FINISHED') {
								$scope.timer.isBeingVerified = false;
								$scope.auctionFinished = true;
								return;
							}

							$scope.timeLeft = $scope.calculateTimeLeft();
							
							if ($scope.timeLeft <= $scope.auction.COUNT_DOWN_TIME) {
								if ($scope.timeLeft <= (AUCTION_VERIFY_CONDITION + 1000) && $scope.timeLeft > AUCTION_FINISHED_CONDITION) {
									if (TimeUtil.millisToSeconds($scope.timeLeft) <= TimeUtil.millisToSeconds(AUCTION_VERIFY_CONDITION)) {
										$scope.timer.isBeingVerified = true;
									}
								} else if ($scope.timeLeft <= AUCTION_FINISHED_CONDITION) {
									if (TimeUtil.millisToSeconds($scope.timeLeft) <= TimeUtil.millisToSeconds(AUCTION_FINISHED_CONDITION)) {
										$scope.finishAuction();
									}
								} else if ($scope.auction.status !== 'COUNTDOWN') {
									$scope.auction.status = 'COUNTDOWN';
								}
							}

							//console.log("Time to calculate: " + (Date.now() - start));
						});
						
					}, COUNT_DOWN_INTERVAL);
				}

				$scope.finishAuction = function() {
					console.log("Auction is finished");
					$scope.timer.isBeingVerified = false;
					$scope.auctionFinished = true;

					$scope.$emit('AUCTION_FINISHED', $scope.auction.id);
				}

				$timeout($scope.startCountdown, 200);
			},
			templateUrl: 'partials/tb-countdown-timer.html'
		};
	}])
	.directive('tbResetTimer', [function() {
		return {
			restrict: 'AE',
			link: function($scope, element, attrs) {
				$scope.resetSeconds = 20;
				
				$scope.resetTimer = function() {
					console.log("About to Set COUNTDOWN in transaction");
					$scope.timer.auctionVerify = false;

					if (angular.isArray($scope.biddingHistory)) {
						$scope.biddingHistory.length = 0; // clear history
					} else if ($scope.biddingHistory.$remove) {
						$scope.biddingHistory.$remove(); // clear history
					}
					
					$scope.auction.winner = null;
					$scope.auction.price = 0.01;
					$scope.user.balance = 10;

					$scope.auction.endDate = Date.now() + $scope.resetSeconds * 1000;
					$scope.auction.status = "COUNTDOWN";
				}
			},
			templateUrl: 'partials/tb-reset-timer.html'
		}
	}]);
