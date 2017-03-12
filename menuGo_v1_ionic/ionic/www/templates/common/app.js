angular
/* ******************************
 * Module Dependency Injection (Start)
 * ****************************** */
.module('starter', [
	'ionic', 
	'ngCordova', 
	'ngMap', 
	'ngStorage'
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
			url: '/nearby/placeId/:placeId/category/:category', 
			views: {
				'customer-nearby': {
					templateUrl: 'templates/customer/nearby/customer-nearby.html', 
					controller: 'customerNearbyController', 
					controllerAs: 'customerNearbyController'
				}
			}
		})
		.state('customer.menu', {
			url: '/menu/company/:companyName/branch/:branchName', 
			views: {
				'main@': {
					templateUrl: 'templates/customer/nearby/menu/customer-menu.html', 
					controller: 'customerMenuController', 
					controllerAs: 'customerMenuController'
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
function doRunConfig($ionicPlatform){
	$ionicPlatform.ready(function() {
	    if(window.cordova && window.cordova.plugins.Keyboard) {
	    	cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	    	cordova.plugins.Keyboard.disableScroll(true);
	    }
	    if(window.StatusBar) {
	    	StatusBar.styleDefault();
	    }
	});
}