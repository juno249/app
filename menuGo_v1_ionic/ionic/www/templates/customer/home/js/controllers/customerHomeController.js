angular
.module('starter')
.controller(
		'customerHomeController', 
		customerHomeController
		);

customerHomeController.$inject = [
                                  'ERROR_MESSAGES', 
                                  'LOADING_MESSAGES', 
                                  '$ionicHistory', 
                                  '$ionicSlideBoxDelegate', 
                                  '$localStorage', 
                                  '$scope', 
                                  '$timeout', 
                                  'dataService'
                                  ];

function customerHomeController(
		ERROR_MESSAGES, 
		LOADING_MESSAGES, 
		$ionicHistory, 
		$ionicSlideBoxDelegate, 
		$localStorage, 
		$scope, 
		$timeout, 
		dataService
		){
	const MARKETING_KEY = 'Marketing';
	const DOM_ADVERTISEMENT_SLIDEBOX = 'advertisement-slidebox';
	const DOM_BLOG_SLIDEBOX = 'blog-slidebox';
	
	var vm = this;
	
	if(!(null == localStorage.getItem(MARKETING_KEY))){
		vm.marketing = localStorage.getItem(MARKETING_KEY);
		vm.marketing = JSON.parse(vm.marketing);
		
		vm.advertisements = vm.marketing.advertisements;
		vm.blogs = vm.marketing.blogs;
		} else {	dataService.fetchMarketing();
		}
	
	$ionicHistory.clearHistory();
	
	function dispIonicLoading(msg){
		var templateString = '';
		templateString += '<ion-spinner></ion-spinner><br>';
		templateString += "<span class='font-family-1-size-small'>" + msg + '</span>';
		
		$ionicLoading.show(
				{	template: templateString	}
				);
		}
	
	function hideIonicLoading(){	$ionicLoading.hide();
	}
	
	function dispIonicPopup(msg){
		var templateString = '';
		templateString += "<span class='font-family-1-size-small'>" + msg + '</span>';
		
		$ionicPopup.alert(
				{	template: templateString	}
				);
		}
	
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
				
				$timeout(
						function(){
							$ionicSlideBoxDelegate.$getByHandle(DOM_ADVERTISEMENT_SLIDEBOX).update();
							$ionicSlideBoxDelegate.$getByHandle(DOM_BLOG_SLIDEBOX).update();
							}
						);
				}
			);
	}