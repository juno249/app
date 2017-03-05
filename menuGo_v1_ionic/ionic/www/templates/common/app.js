angular
/* ******************************
 * Module Dependency Injection (Start)
 * ****************************** */
.module('starter', [
	'ionic', 
	'angular.filter', 
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
		
		$urlRouterProvider
		.otherwise('/');
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