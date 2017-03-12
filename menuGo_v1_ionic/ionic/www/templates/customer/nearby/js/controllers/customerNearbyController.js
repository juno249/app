angular
.module('starter')
.controller('customerNearbyController', customerNearbyController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerNearbyController.$inject = [
	'$q', 
	'$scope', 
	'$state', 
	'$stateParams', 
	'branchService', 
	'dataService', 
	'geolocationService', 
	'googleplacesService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerNearbyController(
		$q, 
		$scope, 
		$state, 
		$stateParams, 
		branchService, 
		dataService, 
		geolocationService, 
		googleplacesService
){
	const COMPANIES_KEY = 'Companies';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.stateParams = {
			category: $stateParams.category, 
			placeId: $stateParams.placeId
	}
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
	if(null == localStorage.getItem(COMPANIES_KEY)){
		dataService.fetchCompanies();
	}
	var companies = localStorage.getItem(COMPANIES_KEY);
	companies = JSON.parse(companies);
	vm.companies = companies;
	vm.companiesMenuitems = undefined;
	vm.companiesBranches = undefined;
	vm.companiesCategories = undefined;
	vm.mapCenterCoordinates = {
			latitude: undefined, 
			longitude: undefined
	}
	vm.placePredictions = undefined;
	vm.categoryVal = vm.stateParams.category;
	vm.searchVal = vm.stateParams.placeId;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.gotoState = gotoState;
	vm.getPlacesNearby = getPlacesNearby;
	vm.setCategoryVal = setCategoryVal;
	vm.toStringAddress = toStringAddress;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */

	if(
			(
					null == vm.categoryVal || 
					0 == vm.categoryVal.trim().length
			)  && 
			(
					null == vm.searchVal || 
					0 == vm.searchVal.trim().length
			)
	){
		initializeMap();
		loadCompaniesBranches();
		loadCompaniesMenuitems();
		loadCompaniesCategories();
	} else {
		if(
				!(
						null == vm.searchVal || 
						0 == vm.searchVal.trim().length
				)
		){
			initializeMap()
			.then(initializeMapSuccessCallback)
			.catch(initializeMapFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function initializeMapSuccessCallback(){
				var searchVal = vm.searchVal;
				
				getRadarSearch(searchVal)
				.then(getRadarSearchSuccessCallback)
				.catch(getRadarSearchFailedCallback);
				
				/* ******************************
				 * Callback Implementations (Start)
				 * ****************************** */
				function getRadarSearchSuccessCallback(){
					//do something on success
				}
				
				function getRadarSearchFailedCallback(status){
					//do something on failure
				}
				/* ******************************
				 * Callback Implementations (End)
				 * ****************************** */
			}
			
			function initializeMapFailedCallback(){
				//do something on failure
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: gotoState()
	 * purpose: go to a state
	 * ****************************** */
	function gotoState(
			toStateName, 
			toStateParams
	){
		var stateName = toStateName;
		var stateParams = {};
		
		if('customer.nearby.menu' == stateName){
			stateParams['companyName'] = toStateParams.company_name;
			stateParams['branchName'] = toStateParams.branch_name;
			
			$state.go(stateName, stateParams, {reload: true});
		}
		
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: getPlacesNearby()
	 * purpose: get places nearby
	 * ****************************** */
	function getPlacesNearby(placeId){
		var deferred = $q.defer();
		
		googleplacesService.getPlaceCoordinates(placeId)
		.then(getPlaceCoordinatesSuccessCallback)
		.catch(getPlaceCoordinatesFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getPlaceCoordinatesSuccessCallback(placeLocation){
			var companies = vm.companies;
			var companiesNames = '';
			var placeLocation = placeLocation;
			
			angular.forEach(companies, function(v, k){
				companiesNames += k + '|';
			});
			
			googleplacesService.getPlacesNearby(
					companiesNames, 
					placeLocation, 
					'map'
			)
			.then(getPlacesNearbySuccessCallback)
			.catch(getPlacesNearbyFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function getPlacesNearbySuccessCallback(nearby){
				//do something on success callback
				deferred.resolve();
			}
			
			function getPlacesNearbyFailedCallback(){
				deferred.reject(status);
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		}
		
		function getPlaceCoordinatesFailedCallback(status){
			deferred.reject(status);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: setCategoryVal()
	 * purpose: sets categoryVal
	 * ****************************** */
	function setCategoryVal(categoryVal){
		vm.categoryVal = categoryVal;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: toStringAddress()
	 * purpose: returns an address string
	 * ****************************** */
	function toStringAddress(branch){
		branchService.setBranch(branch);
		
		return branchService.toStringAddress();
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: getRadarSearch()
	 * purpose: get places nearby
	 * ****************************** */
	function getRadarSearch(placeId){
		var deferred = $q.defer();
		
		googleplacesService.getPlaceCoordinates(placeId)
		.then(getPlaceCoordinatesSuccessCallback)
		.catch(getPlaceCoordinatesFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getPlaceCoordinatesSuccessCallback(placeLocation){
			var companies = vm.companies;
			var companiesNames = '';
			var placeLocation = placeLocation;
			
			angular.forEach(companies, function(v, k){
				companiesNames += k + '|';
			});
			
			googleplacesService.getRadarSearch(
					companiesNames, 
					placeLocation, 
					'map'
			)
			.then(getRadarSearchSuccessCallback)
			.catch(getRadarSearchFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function getRadarSearchSuccessCallback(nearby){
				var nearby = nearby;
				
				for(var i=0; i<nearby.length; i++){
					var nearbyRunner = nearby[i];
					
					googleplacesService.getPlaceDetails(
							nearbyRunner.place_id, 
							'map'
					)
					.then(getPlaceDetailsSuccessCallback)
					.catch(getPlaceDetailsFailedCallback);
					
					/* ******************************
					 * Callback Implementations (Start)
					 * ****************************** */
					function getPlaceDetailsSuccessCallback(placeDetails){
						//do someting on success
					}
					
					function getPlaceDetailsFailedCallback(status){
						deferred.reject(status);
					}
					/* ******************************
					 * Callback Implementations (End)
					 * ****************************** */
				}
			}
			
			function getRadarSearchFailedCallback(status){
				deferred.reject(status);
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		}
		
		function getPlaceCoordinatesFailedCallback(status){
			deferred.reject(status);
		}
		/* ******************************
		 * Callback Implementations (End
		 * ****************************** */
		
		return deferred.promise;
	}

	/* ******************************
	 * Method Implementation
	 * method name: initializeMap()
	 * purpose: initializes map
	 * ****************************** */
	function initializeMap(){
		var deferred  = $q.defer();
		
		geolocationService.getPosition()
		.then(getPositionSuccessCallback)
		.catch(getPositionFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getPositionSuccessCallback(coordinates){
			var mapCenterCoordinates = vm.mapCenterCoordinates;
			
			mapCenterCoordinates = coordinates;
			
			vm.mapCenterCoordinates = mapCenterCoordinates;
			vm.mapConfig.center = mapCenterCoordinates;
			deferred.resolve();
		}
		
		function getPositionFailedCallback(status){
			deferred.reject(status);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: loadCompaniesBranches()
	 * purpose: loads companies branches
	 * ****************************** */
	function loadCompaniesBranches(){
		var companies = vm.companies;
		var companiesBranches = {};
		
		angular.forEach(companies, function(v, k){
			var company = v;
			var companyBranches = company.branches;
			
			companiesBranches[k] = companyBranches;
		});
		
		vm.companiesBranches = companiesBranches;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: loadCompaniesMenuitems()
	 * purpose: loads companies menuitems
	 * ****************************** */
	function loadCompaniesMenuitems(){
		var companies = vm.companies;
		var companiesMenuitems = {};
		
		angular.forEach(companies, function(v, k){
			var company = v;
			var companyMenus = company.menus;
			var companyMenuitems = [];
			
			angular.forEach(companyMenus, function(v, k){
				var companyMenu = v;
				var companyMenuMenuitems = v.menuitems;
				
				angular.forEach(companyMenuMenuitems, function(v, k){
					var companyMenuMenuitem = v;
					
					if(1 == companyMenuMenuitem.menuitem_featured){
						companyMenuitems.push(companyMenuMenuitem);
					}
				});
			});
			
			companiesMenuitems[k] = companyMenuitems;
		});
		
		vm.companiesMenuitems = companiesMenuitems;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: loadlCompaniesCategories()
	 * purpose: loads companies categories
	 * ****************************** */
	function loadCompaniesCategories(){
		var companies = vm.companies;
		var companiesCategories = [];
		
		angular.forEach(companies, function(v, k){
			var company = v;
			if(-1 == companiesCategories.indexOf(v.company_category)){
				companiesCategories.push(v.company_category);
			}
		});
		
		vm.companiesCategories = companiesCategories;
	}
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
		function(){
			return localStorage.getItem(COMPANIES_KEY);
		}, 
		function(nVal, oVal){
			var companies = vm.companies;
			
			companies = localStorage.getItem(COMPANIES_KEY);
			companies = JSON.parse(companies);
			
			vm.companies = companies;
		}
	);
	
	$scope.$watch(
		function(){
			return vm.companies;
		}, 
		function(nVal, oVal){
			loadCompaniesBranches();
			loadCompaniesMenuitems();
			loadCompaniesCategories();
		}
	);
	
	$scope.$watch(
		function(){
			return vm.searchVal;
		}, 
		function(nVal, oVal){
			var companies = vm.companies;
			var companiesNames = '';
			var searchVal = nVal;
			
			if(
					null == searchVal || 
					0 == searchVal.trim().length
			){	
				var placePredictions = vm.placePredictions;
				
				placePredictions = undefined;
				
				vm.placePredictions = placePredictions;
				return;	
			}
			
			googleplacesService.getPlacePredictions(searchVal)
			.then(getPlacePredictionsSuccessCallback)
			.catch(getPlacePredictionsFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function getPlacePredictionsSuccessCallback(predictions){
				var placePredictions = vm.placePredictions;
				
				placePredictions = predictions;
				
				vm.placePredictions = placePredictions;
			}
			
			function getPlacePredictionsFailedCallback(status){
				//do something on failure
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */