angular
.module('starter')
.controller(
		'customerHomeController', 
		customerHomeController
		);

customerHomeController.$inject = [
	'dataService', 
	'$ionicHistory', 
	'$ionicSlideBoxDelegate', 
	'$localStorage', 
	'$scope', 
	'$timeout'
	];

function customerHomeController(
		dataService, 
		$ionicHistory, 
		$ionicSlideBoxDelegate, 
		$localStorage, 
		$scope, 
		$timeout
		){
	const DOM_ADVERTISEMENTS_SLIDEBOX = 'advertisements-slidebox';
	const DOM_BLOGS_SLIDEBOX = 'blogs-slidebox';
	const MARKETING_KEY = 'Marketing';
	
	var vm = this;
	
	if(null == localStorage.getItem(MARKETING_KEY)){	dataService.fetchMarketing();
	} else {
		vm.marketing = localStorage.getItem(MARKETING_KEY);
		vm.marketing = JSON.parse(vm.marketing);
		
		vm.advertisements = vm.marketing.advertisements;
		vm.blogs = vm.marketing.blogs;
		}
	
	$ionicHistory.clearHistory();
	
	$scope.$watch(
			function(){	return localStorage.getItem(MARKETING_KEY);
			}, 
			function(){
				vm.marketing = localStorage.getItem(MARKETING_KEY);
				vm.marketing = JSON.parse(vm.marketing);
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.marketing;
			}, 
			function(){
				if(!(null == vm.marketing)){
					vm.advertisements = vm.marketing.advertisements;
					vm.blogs = vm.marketing.blogs;
					}
				
				$timeout(function(){
					$ionicSlideBoxDelegate.$getByHandle(DOM_ADVERTISEMENTS_SLIDEBOX).update();
					$ionicSlideBoxDelegate.$getByHandle(DOM_BLOGS_SLIDEBOX).update();
					}
				);
				}
			);
	}