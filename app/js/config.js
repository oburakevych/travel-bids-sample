angular.module('tbApp.config', [])
	.constant('FIREBASE_URL', 'https://travel-bids-sample.firebaseio.com/')
	.constant('COUNT_DOWN_INTERVAL', 500)
	.constant('AUCTION_VERIFY_CONDITION', -3 * 1000)
	.constant('AUCTION_FINISHED_CONDITION', -5 * 1000);
