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
		templateUrl: 'templates/login.html', 
		controller: 'loginController', 
		controllerAs: 'loginController'
	})
	.state('config', {
		url: '/config', 
		templateUrl: 'templates/config.html', 
		controller: 'configController', 
		controllerAs: 'configController'
	})
	.state('home', {
		url: '/home', 
		abstract: true, 
		templateUrl: 'templates/home.html', 
		controller: 'homeController', 
		controllerAs: 'homeController'
	})
	.state('home.menus', {
		url: '/menus', 
		views: {
			'menuContent': {
				templateUrl: 'templates/home-menus.html', 
				controller: 'menusController', 
				controllerAs: 'menusController'
			}
		}
	})
	.state('home.orders', {
		url: '/orders', 
		abstract: true, 
		views: {
			'menuContent': {
				templateUrl: 'templates/home-orders.html', 
				controller: 'ordersController',
				controllerAs: 'ordersController'
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
	.state('admin', {
		url: '/admin', 
		templateUrl: 'templates/admin.html', 
		controller: 'adminController', 
		controllerAs: 'adminController'
	});
	
	$urlRouterProvider
	.otherwise('/');
}

function doIonicConfig($ionicConfigProvider){
	$ionicConfigProvider.tabs.position('bottom');
}