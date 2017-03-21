angular
.module('starter')
.controller('customerHomeController', customerHomeController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerHomeController.$inject = [
	'dataService', 
	'$ionicHistory', 
	'$ionicSlideBoxDelegate', 
	'$scope', 
	'$timeout'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerHomeController(
		dataService, 
		$ionicHistory, 
		$ionicSlideBoxDelegate, 
		$scope, 
		$timeout
	){
	$ionicHistory.clearHistory();
	
	const MARKETING_KEY = 'Marketing';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	var marketing = undefined;
	if(null == localStorage.getItem(MARKETING_KEY)){
		dataService.fetchMarketing();
		vm.marketing = undefined;
	} else {
		marketing = localStorage.getItem(MARKETING_KEY);
		marketing = JSON.parse(marketing);
		vm.marketing = marketing;
	}
	vm.advertisements = undefined;
	vm.blogs = undefined;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
			function(){
				return localStorage.getItem(MARKETING_KEY);
			}, 
			function(){
				var marketing = undefined;
				
				marketing = localStorage.getItem(MARKETING_KEY);
				marketing = JSON.parse(marketing);
				
				vm.marketing = marketing;
			}
	);
	
	$scope.$watch(
			function(){
				return vm.marketing;
			}, 
			function(){
				var marketing = vm.marketing;
				var advertisements = vm.advertisements;
				var blogs = vm.blogs;
				var advertisementsSlidebox = 'advertisements-slidebox';
				var blogsSlidebox = 'blogs-slidebox';
				
				if(null == marketing){
					return;
				}
				
				advertisements = marketing.advertisements;
				blogs = marketing.blogs;
				
				vm.advertisements = advertisements;
				vm.blogs = blogs;
				
				$timeout(function(){
					$ionicSlideBoxDelegate.$getByHandle(advertisementsSlidebox).update();
					$ionicSlideBoxDelegate.$getByHandle(blogsSlidebox).update();
				});
			}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */