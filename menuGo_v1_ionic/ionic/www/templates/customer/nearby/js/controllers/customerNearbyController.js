angular
.module('starter')
.controller(
		'customerNearbyController', 
		customerNearbyController
		);

customerNearbyController.$inject = [
                                    '$ionicHistory', 
                                    '$ionicSlideBoxDelegate', 
                                    '$localStorage', 
                                    '$scope', 
                                    '$state', 
                                    '$timeout', 
                                    'branchService', 
                                    'dataService', 
                                    'googleplacesService'
                                    ];

function customerNearbyController(
		$ionicHistory, 
		$ionicSlideBoxDelegate, 
		$localStorage, 
		$scope, 
		$state, 
		$timeout, 
		branchService, 
		dataService, 
		googleplacesService
		){
	$ionicHistory.clearHistory();
	
	const COMPANIES_KEY = 'Companies';
	const DOM_FEATURED_MENU_SLIDEBOX = 'featured-menu-slidebox';
	
	var vm = this;
	vm.mapConfig = {
			center: {
				latitude: undefined, 
				longitude: undefined
				}, 
				mapTypeControl: false, 
				scaleControl: false, 
				streetViewControl: false, 
				zoom: 15, 
				zoomControl: false
				}
	
	if(!(null == localStorage.getItem(COMPANIES_KEY))){
		vm.companies = localStorage.getItem(COMPANIES_KEY);
		vm.companies = JSON.parse(vm.companies);
		} else {	dataService.fetchCompanies();
		}
	
	//controller_method
	vm.gotoState = gotoState;
	//controller_method
	vm.setCompanyCategory = setCompanyCategory;
	//controller_method
	vm.toStringBranchAddress = toStringBranchAddress;
	
	function gotoState(
			stateName, 
			stateParams
			){
		if('customer.nearby.reservation_menu' == stateName){
			$state.go(
					stateName, 
					{
						companyName: stateParams.companyName, 
						branchName: stateParams.branchName
						}, 
						{	reload: true	}
						);
			}
		}
	
	function setCompanyCategory(companyCategory){	vm.companyCategory = companyCategory;
	}
	
	function toStringBranchAddress(branch){
		branchService.setBranches(branch);
		
		return branchService.toStringAddress();
		}
	
	function genCompanyMenuMenuitems(){
		var companyMenuMenuitems = {};
		
		angular.forEach(
				vm.companyMenus, 
				function(
						v, 
						k
						){
					angular.forEach(
							v.menuitems, 
							function(
									v, 
									k
									){	companyMenuMenuitems[v.menuitem_id] = v;
									}
							);
					}
				);
		
		$timeout(
				function(){	$ionicSlideBoxDelegate.$getByHandle(DOM_FEATURED_MENU_SLIDEBOX).update();
				}
				);
		
		return companyMenuMenuitems;
		}
	
	function genCompanyCategories(){
		var companyCategories = [];
		
		angular.forEach(
				vm.companies, 
				function(
						v, 
						k
						){
					var company = v;
					
					if(-1 == companyCategories.indexOf(v.company_category)){	companyCategories.push(v.company_category);
					}
					}
				);
		
		return companyCategories;
		}
	
	$scope.$watch(
			function(){	return localStorage.getItem(COMPANIES_KEY);
			}, 
			function(){
				vm.companies = localStorage.getItem(COMPANIES_KEY);
				vm.companies = JSON.parse(vm.companies);
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.companies;
			}, 
			function(){
				vm.companyMenuMenuitems = genCompanyMenuMenuitems();
				vm.companyCategories = genCompanyCategories();
				}
			);
	
	$scope.$watch(
			function(){	return vm.search;
			}, 
			function(){
				if(
						null == vm.search ||
						0 == vm.search.trim().length
						){
					vm.placePredictions = undefined;
					return;
					}
				
				googleplacesService.getPlacePredictions(vm.search)
				.then(getPlacePredictionsSuccessCallback)
				.catch(getPlacePredictionsFailedCallback);
				
				function getPlacePredictionsSuccessCallback(predictions){		vm.placePredictions = predictions;
				}
				
				function getPlacePredictionsFailedCallback(status){	//do something on failure
				}
				}
			);
	}