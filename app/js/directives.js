'use strict';

/* Directives */


angular.module('tbApp.directives', [])
	.directive('tbCountdownTimer', ['$timeout', 'AUCTION_VERIFY_CONDITION', 'AUCTION_FINISHED_CONDITION', 'COUNT_DOWN_INTERVAL', 
			function($timeout, AUCTION_VERIFY_CONDITION, AUCTION_FINISHED_CONDITION, COUNT_DOWN_INTERVAL) {
		return {
			restrict: 'AE',
			link: function($scope, element, attrs) {
				$scope.serverOffsetMillis = 0;
				
				$scope.calculateTimeLeft = function() {
					return $scope.auction.endDate - Date.now() - $scope.serverOffsetMillis;
				}

				$scope.startCountdown = function() {
					$scope.timeLeft = $scope.calculateTimeLeft();

					$scope.auctionIntervalTimerId = setInterval(function() {
						$scope.$apply(function() {
							//var start = Date.now();
							if ($scope.auction.status === 'FINISHED') {
								$scope.auctionVerify = false;
								$scope.auctionFinished = true;
								return;
							}

							$scope.timeLeft = $scope.calculateTimeLeft();
							
							if ($scope.timeLeft <= $scope.auction.COUNT_DOWN_TIME) {
								if ($scope.timeLeft <= (AUCTION_VERIFY_CONDITION + 1000) && $scope.timeLeft > AUCTION_FINISHED_CONDITION) {
									if (TimeUtil.millisToSeconds($scope.timeLeft) <= TimeUtil.millisToSeconds(AUCTION_VERIFY_CONDITION)) {
										console.log("VERIFY");
										$scope.auctionVerify = true;
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
					$scope.auctionVerify = false;
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
					$scope.auction.status = "COUNTDOWN";
					$scope.auction.endDate = Date.now() + $scope.resetSeconds * 1000;
					$scope.auction.winnerUserId = null;
					$scope.auction.price = 1.00;

					$scope.user.balance = 10;
				}
			},
			templateUrl: 'partials/tb-reset-timer.html'
		}
	}]);
