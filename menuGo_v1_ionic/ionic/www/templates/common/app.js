angular
/* ******************************
 * Module Dependency Injection (Start)
 * ****************************** */
.module('starter', [
	'ionic', 
	'ngCordova', 
	'ngMap', 
	'ngStorage', 
	'ion-datetime-picker'
	])
/* ******************************
 * Module Dependency Injection (End)
 * ****************************** */

.config(doRouteConfig)
.config(doIonicConfig)
.run(doRunConfig);

/* ******************************
 * Method Implementation
 * method name: doRouteConfig()
 * purpose: handles routing configuration
 * ****************************** */
function doRouteConfig( 
		$stateProvider, 
		$urlRouterProvider
	){
		$stateProvider
		.state('login', {
			url: '/', 
			views: {
				'main': {
					templateUrl: 'templates/login/login.html', 
					controller: 'loginController', 
					controllerAs: 'loginController'
				}
			}
		})
		.state('customer', {
			url: '/customer', 
			abstract: true, 
			views: {
				'main': {
					templateUrl: 'templates/customer/customer.html'
				}
			}
		})
		.state('customer.home', {
			url: '/home', 
			views: {
				'customer-home': {
					templateUrl: 'templates/customer/home/customer-home.html', 
					controller: 'customerHomeController', 
					controllerAs: 'customerHomeController'
				}
			}
		})
		.state('customer.nearby', {
			url: '/nearby', 
			views: {
				'customer-nearby': {
					templateUrl: 'templates/customer/nearby/customer-nearby.html', 
					controller: 'customerNearbyController', 
					controllerAs: 'customerNearbyController'
				}
			}
		})
		.state('customer.nearby.reservation_menu', {
			url: '/reservation_menu/:companyName/:branchName', 
			views: {
				'customer-nearby@customer': {
					templateUrl: 'templates/customer/nearby/reservation_menu/nearby-reservation_menu.html', 
					controller: 'nearbyReservationMenuController', 
					controllerAs: 'nearbyReservationMenuController'
				}
			}
		})

		$urlRouterProvider
		.otherwise('/customer/home');
	}

/* ******************************
 * Method Implementation
 * method name: doIonicConfig()
 * purpose: handles ionic configuration
 * ****************************** */
function doIonicConfig($ionicConfigProvider){
	$ionicConfigProvider.tabs.position('bottom');
}

/* ******************************
 * Method Implementation
 * method name: doRunConfig()
 * purpose: handles run configuration
 * ****************************** */
function doRunConfig(
		$ionicPlatform, 
		$rootScope
	){
	$ionicPlatform.ready(function(){
	    if(window.cordova && window.cordova.plugins.Keyboard) {
	    	cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	    	cordova.plugins.Keyboard.disableScroll(true);
	    }
	    if(window.StatusBar) {
	    	StatusBar.styleDefault();
	    }
	});
	
	$rootScope.keys = Object.keys;
	
	$rootScope.$on(
			'$stateChangeStart', 
			function(
				e, 
				toState, 
				toStateParams, 
				fromState, 
				fromStateParams
				){
			}
		)
}