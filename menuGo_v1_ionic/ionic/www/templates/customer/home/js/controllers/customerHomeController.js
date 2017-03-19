angular
.module('starter')
.controller('customerHomeController', customerHomeController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerHomeController.$inject = [
	'dataService', 
	'$ionicSlideBoxDelegate', 
	'$scope'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerHomeController(
		dataService, 
		$ionicSlideBoxDelegate, 
		$scope
){
	const ADVERTISEMENTS_KEY = 'Advertisements';
	const BLOGS_KEY = 'Blogs';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	var advertisements = undefined;
	if(null == localStorage.getItem(ADVERTISEMENTS_KEY)){
		dataService.fetchAdvertisements();
		vm.advertisements = undefined;
	} else {
		advertisements = localStorage.getItem(ADVERTISEMENTS_KEY);
		advertisements = JSON.parse(advertisements);
		vm.advertisements = advertisements;
	}
	var blogs = undefined;
	if(null == localStorage.getItem(BLOGS_KEY)){
		dataService.fetchBlogs();
		vm.blogs = undefined;
	} else {
		blogs = localStorage.getItem(BLOGS_KEY);
		blogs = JSON.parse(blogs);
		vm.blogs = blogs;
	}
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
			function(){
				return localStorage.getItem(ADVERTISEMENTS_KEY);
			}, 
			function(nVal, oVal){
				var advertisements = vm.advertisements;
				var advertisementsSlidebox = 'advertisements-slidebox';
				
				advertisements = localStorage.getItem(ADVERTISEMENTS_KEY);
				advertisements = JSON.parse(advertisements);
				
				$ionicSlideBoxDelegate.$getByHandle(advertisementsSlidebox).update();
				vm.advertisements = advertisements;
			}
	);
	
	$scope.$watch(
			function(){
				return localStorage.getItem(BLOGS_KEY);
			}, 
			function(nVal, oVal){
				var blogs = vm.blogs;
				var blogsSlidebox = 'blogs-slidebox';
				
				blogs = localStorage.getItem(BLOGS_KEY);
				blogs = JSON.parse(blogs);
				
				$ionicSlideBoxDelegate.$getByHandle(blogsSlidebox).update();
				vm.blogs = blogs;
			}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */