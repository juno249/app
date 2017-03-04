angular.module('starter', 
		[ 
			'ionic', 
			'angular.filter', 
			'ngStorage'
		])

.run(doRunConfig)
.config(doRouteConfig)
.config(doIonicConfig);

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

function doRouteConfig(
	APP_CONFIG, 
	$stateProvider, 
	$urlRouterProvider
){
	$stateProvider
	.state('login', {
		url: '/', 
		templateUrl: 'templates/login/login.html', 
		controller: 'loginController', 
		controllerAs: 'loginController'
	})
	.state('configuration', {
		url: '/configuration', 
		templateUrl: 'templates/configuration/configuration.html', 
		controller: 'configurationController', 
		controllerAs: 'configurationController'
	})
	.state('home', {
		url: '/home', 
		abstract: true, 
		templateUrl: 'templates/in-house/home.html', 
		controller: 'homeController', 
		controllerAs: 'homeController'
	})
	.state('home.menu', {
		url: '/menu', 
		views: {
			'menuContent': {
				templateUrl: 'templates/in-house/home-menu.html', 
				controller: 'homeMenuController', 
				controllerAs: 'homeMenuController'
			}
		}
	})
	.state('home.order', {
		url: '/order', 
		abstract: true, 
		views: {
			'menuContent': {
				templateUrl: 'templates/in-house/home-order/home-order.html', 
				controller: 'homeOrderController',
				controllerAs: 'homeOrderController'
			}
		}
	})
	.state('home.orders.main', {
		url: '/orders-main', 
		views: {
			'orders-main': {
				templateUrl: 'templates/home-orders-main.html', 
			}
		}
	})
	.state('home.orders.monitoring', {
		url: '/orders-monitoring', 
		views: {
			'orders-monitoring': {
				templateUrl: 'templates/home-orders-monitoring.html'
			}
		}
	})
	.state('waiter', {
		url: '/waiter', 
		templateUrl: 'templates/waiter.html', 
		controller: 'waiterController', 
		controllerAs: 'waiterController'
	})
	.state('manager', {
		url: '/manager', 
		templateUrl: 'templates/manager/manager.html', 
		controller: 'managerController', 
		controllerAs: 'managerController'
	});
	
	$urlRouterProvider
	.otherwise('/');
}

function doIonicConfig($ionicConfigProvider){
	$ionicConfigProvider.tabs.position('bottom');
}