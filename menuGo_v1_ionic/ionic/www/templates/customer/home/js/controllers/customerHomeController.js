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
	const DOM_ADVERTISEMENTS_SLIDEBOX = 'advertisements-slidebox';
	const DOM_BLOGS_SLIDEBOX = 'blogs-slidebox';
	const MARKETING_KEY = 'Marketing';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	var marketing = undefined;
	if(null == localStorage.getItem(MARKETING_KEY)){
		dataService.fetchMarketing();
		
		vm.marketing = undefined;
		vm.advertisements = undefined;
		vm.blogs = undefined;
	} else {
		marketing = localStorage.getItem(MARKETING_KEY);
		marketing = JSON.parse(marketing);
		
		vm.marketing = marketing;
		vm.advertisements = vm.marketing.advertisements;
		vm.blogs = vm.marketing.blogs;
	}
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	$ionicHistory.clearHistory();
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
			function(){	return localStorage.getItem(MARKETING_KEY);
			}, 
			function(){
				var marketing = undefined;
				
				marketing = localStorage.getItem(MARKETING_KEY);
				marketing = JSON.parse(marketing);
				
				vm.marketing = marketing;
			}
	);
	
	$scope.$watch(
			function(){	return vm.marketing;
			}, 
			function(){
				var marketing = undefined;
				var advertisements = undefined;
				var blogs = undefined;
				
				marketing = vm.marketing;
				if(!(null == marketing)){
					advertisements = marketing.advertisements;
					blogs = marketing.blogs;
					
					vm.advertisements = advertisements;
					vm.blogs = blogs;
				}

				$timeout(function(){
					$ionicSlideBoxDelegate.$getByHandle(DOM_ADVERTISEMENTS_SLIDEBOX).update();
					$ionicSlideBoxDelegate.$getByHandle(DOM_BLOGS_SLIDEBOX).update();
				}, 1000);
			}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */