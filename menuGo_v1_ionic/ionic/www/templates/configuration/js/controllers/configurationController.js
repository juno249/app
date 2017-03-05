angular
.module('starter')
.controller('configurationController', configurationController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
configurationController.$inject = [
	'LOADING_MESSAGES', 
	'MQTT_CONFIG', 
	'USER_ROLES', 
	'$ionicHistory', 
	'$ionicLoading', 
	'$ionicPopup', 
	'$localStorage', 
	'$q', 
	'$state', 
	'branchesService', 
	'companiesService', 
	'loginService', 
	'menuitemsService', 
	'mqttService', 
	'menusService', 
	'tablesService' 
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function configurationController(
		LOADING_MESSAGES, 
		MQTT_CONFIG, 
		USER_ROLES, 
		$ionicHistory, 
		$ionicLoading, 
		$ionicPopup, 
		$localStorage, 
		$q, 
		$state, 
		branchesService, 
		companiesService, 
		loginService, 
		menuitemsService, 
		mqttService, 
		menusService, 
		tablesService 
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	var companies = localStorage.getItem('Companies');
	companies = JSON.parse(companies);
	vm.companies = companies;
	vm.companyName = undefined;
	var branches = localStorage.getItem('Branches');
	branches = JSON.parse(branches);
	vm.branches = branches;
	vm.branchName = undefined;
	var tables = localStorage.getItem('Tables');
	tables = JSON.parse(tables);
	vm.tables = tables
	vm.tableNumber = undefined;
	var menus = localStorage.getItem('Menus');
	menus = JSON.parse(menus);
	vm.menus = menus;
	vm.isBranchItemHidden = true;
	vm.isTableItemHidden = true;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.fetchCompanies = fetchCompanies;
	vm.fetchBranches = fetchBranches;
	vm.fetchTables = fetchTables;
	vm.fetchMenus = fetchMenus;
	vm.doMQTTCustomerConfig = doMQTTCustomerConfig;
	vm.doShowIonicPopup = doShowIonicPopup;
	vm.doShowIonicLoading = vm.doShowIonicLoading;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	$ionicHistory.clearHistory();
	vm.fetchCompanies();
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchCompanies()
	 * purpose: doGet companies from server
	 * ****************************** */
	function fetchCompanies(){
		companiesService.fetchCompanies()
		.then(fetchCompaniesSuccessCallback)
		.catch(fetchCompaniesFailedCallback);
		
		doShowIonicLoading(LOADING_MESSAGES.fetchCompanies);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchCompaniesSuccessCallback(response){
			$ionicLoading.hide();
			vm.companies = JSON.parse(localStorage.getItem('Companies'));
		}
		
		function fetchCompaniesFailedCallback(responseError){
			$ionicLoading.hide();
			doShowIonicPopup(2, responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchBranches()
	 * purpose: doGet branches from server
	 * ****************************** */
	function fetchBranches(){
		var company = {};
		var companyName = vm.companyName;
		
		company[companyName] = vm.companies[companyName];
		companiesService.setCompany(company);
		companiesService.setCompanyName(companyName);
		localStorage.setItem('Company', JSON.stringify(company));
		
		branchesService.setCompanyName(companyName);
		branchesService.fetchBranches()
		.then(fetchBranchesSuccessCallback)
		.catch(fetchBranchesFailedCallback);
		
		doShowIonicLoading(LOADING_MESSAGES.fetchBranches);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchBranchesSuccessCallback(response){
			$ionicLoading.hide();
			vm.branches = JSON.parse(localStorage.getItem('Branches'));
			
			vm.isTableItemHidden = true;
			vm.isBranchItemHidden = false;
		}
		
		function fetchBranchesFailedCallback(responseError){
			$ionicLoading.hide();
			doShowIonicPopup(2, responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchTables()
	 * purpose: doGet tables from server
	 * ****************************** */
	function fetchTables(){
		var branch = {};
		var branchName = vm.branchName;
		var companyName = vm.companyName;
		
		branch[branchName] = vm.branches[branchName];
		branchesService.setBranch(branch);
		branchesService.setBranchName(branchName);
		localStorage.setItem('Branch', JSON.stringify(branch));
		
		tablesService.setCompanyName(companyName);
		tablesService.setBranchName(branchName);
		tablesService.fetchTables()
		.then(fetchTablesSuccessCallback)
		.catch(fetchTablesFailedCallback);
		
		doShowIonicLoading(LOADING_MESSAGES.fetchTables);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchTablesSuccessCallback(response){
			$ionicLoading.hide();
			vm.tables = JSON.parse(localStorage.getItem('Tables'));
			
			var userRole = loginService.getUser().role;
			if(USER_ROLES.admin == userRole ||
					USER_ROLES.cook == userRole){
				fetchMenus();
				return;
			}
			
			vm.isTableItemHidden = false;
			vm.isBranchItemHidden = false;
		}
		
		function fetchTablesFailedCallback(responseError){
			$ionicLoading.hide();
			doShowIonicPopup(2, responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchMenus()
	 * purpose: doGet menus from server
	 * ****************************** */
	function fetchMenus(){
		var table = {};
		var companyName = vm.companyName;
		
		var userRole = loginService.getUser().role;
		if(!(USER_ROLES.admin == userRole || 
				USER_ROLES.cook == userRole)){
			var tableNumber = vm.tableNumber;
			table[tableNumber] = vm.tables[tableNumber];
			tablesService.setTable(table);
			tablesService.setTableNumber(tableNumber);
			localStorage.setItem('Table', JSON.stringify(table));
		}
		
		menusService.setCompanyName(companyName);
		menusService.fetchMenus()
		.then(fetchMenusSuccessCallback)
		.catch(fetchMenusFailedCallback);
		doShowIonicLoading(LOADING_MESSAGES.fetchMenus);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchMenusSuccessCallback(response){
			$ionicLoading.hide();
			vm.menus = JSON.parse(localStorage.getItem('Menus'));
			var menus = vm.menus;
	
			fetchMenuMenuitems(menus)
			.then(fetchMenuMenuitemsSuccessCallback)
			.catch(fetchMenuMenuitemsFailedCallback);
			doShowIonicLoading(LOADING_MESSAGES.fetchMenuitems);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function fetchMenuMenuitemsSuccessCallback(response){
				$ionicLoading.hide();
				
				var userRole = loginService.getUser().role;
				if(USER_ROLES.admin == userRole || 
						USER_ROLES.cook == userRole){
					$state.go('admin', {}, {reload: true});
					return;
				}
				
				var tableNumber = vm.tableNumber;
				var amendments = [];
				var amendment = {};
				amendment.table_status = 'statusOccupied';
				amendments.push(amendment);
				
				tablesService.setTableNumber(tableNumber);
				tablesService.updateTable(amendments)
				.then(updateTableSuccessCallback)
				.catch(updateTableFailedCallback);
				doShowIonicLoading(LOADING_MESSAGES.updateTable);
				
				/* ******************************
				 * Callback Implementations (Start)
				 * ****************************** */
				function updateTableSuccessCallback(response){
					$ionicLoading.hide();
					doMQTTCustomerConfig();
				}
				
				function updateTableFailedCallback(responseError){
					$ionicLoading.hide();
					doShowIonicPopup(2, responseError);
				}
				/* ******************************
				 * Callback Implementations (End)
				 * ****************************** */
			}
			
			function fetchMenuMenuitemsFailedCallback(responseError){
				//do something on failure
				//this implements $q.all
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
			
			/* ******************************
			 * Method Implementation
			 * method name: fetchMenuMenuitems()
			 * purpose: doGet menuitems from server
			 * ****************************** */
			function fetchMenuMenuitems(menus){
				var promises = [];
				var menusKeys = Object.keys(menus);
				var menuMap_nameId = {};
				var companyName = vm.companyName;
				
				for(var i=0; i<menusKeys.length; i++){
					var menusRunner = menus[menusKeys[i]];
					menuMap_nameId[menusRunner.menu_id] = menusRunner.menu_name;
				}
				
				menuitemsService.setCompanyName(companyName);
				for(var i=0; i<menusKeys.length; i++){
					var menusRunner = menus[menusKeys[i]];
					menuitemsService.setMenuName(menusRunner.menu_name);
					
					promises.push(
							menuitemsService.fetchMenuitems()
							.then(fetchMenuitemsSuccessCallback)
							.catch(fetchMenuitemsFailedCallback)
						);
					
					/* ******************************
					 * Callback Implementations (Start)
					 * ****************************** */
					function fetchMenuitemsSuccessCallback(response){
						var menuitems = response.data;
						var menuitemsKeys = Object.keys(menuitems);
						if(0 < menuitemsKeys.length){
							var menuId = menuitems[menuitemsKeys[0]].menu_id; //all menuitems contain same menu_id
							var menuKey = menuMap_nameId[menuId];
							vm.menus[menuKey].menuitems = menuitems;
						}
						localStorage.setItem('Menus', JSON.stringify(vm.menus));
					}
					
					function fetchMenuitemsFailedCallback(responseError){
						$ionicLoading.hide();
						doShowIonicPopup(2, responseError);
					}
					/* ******************************
					 * Callback Implementations (End)
					 * ****************************** */
				}
				return $q.all(promises);
			}
		}
		
		function fetchMenusFailedCallback(responseError){
			$ionicLoading.hide();
			doShowIonicPopup(2, responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doMQTTCustomerConfig()
	 * purpose: configures MQTT based on customer setup
	 * ****************************** */
	function doMQTTCustomerConfig(){
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		var onConnectionLostCallback = function(){
		}
		var onMessageArrivedCallback = function(response){
			$ionicLoading.hide();
			if(MQTT_CONFIG.topicWaiterResponse == response.destinationName){
				handleMessageArrivalWaiterResponse(response);
			}
		}
		var onSuccessCallback = function(){
			$ionicLoading.hide();
			
			var userRole = loginService.getUser().role;
			if(USER_ROLES.customer == userRole){
				$state.go('home.menus', {}, {reload: true});
			}
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		$ionicLoading.hide();
		mqttService.useDefaultConfig();
		try{
			doShowIonicLoading(LOADING_MESSAGES.doConnect);
			mqttService.doConnect(
					onConnectionLostCallback, 
					onMessageArrivedCallback, 
					onSuccessCallback		
			);
		} catch(err){
			$ionicLoading.hide();
			doShowIonicPopup(1, err);
		}
		
		/* ******************************
		 * Method Implementation
		 * method name: handleMessageArrivalWaiterResponse()
		 * purpose: handles MQTT message w/topicWaiterResponse
		 * ****************************** */
		function handleMessageArrivalWaiterResponse(response){
			var msgBody = response.payloadString;
			msgBody = JSON.parse(msgBody);
			var customerUsername = msgBody.customer_username;
			var tableNumber = msgBody.table_number;
			var timestamp = msgBody.timestamp;
			var respondingUser = msgBody.responding_user;
			
			var msgString = '';
			msgString += respondingUser + ' heed your call request';
			doShowIonicPopup(0, msgString);
			
			// unsubscrbe to topicWaiterResponse
			mqttService.setMqttTopic(MQTT_CONFIG.topicWaiterResponse);
			try{ 	mqttService.doUnsubscribe();
			} catch (err){	doShowIonicPopup(1, err);	}
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doShowIonicPopup()
	 * purpose: show Ionic Popup
	 * ****************************** */
	function doShowIonicPopup(type, message){
		var title = '';
		var template = '';
		
		switch(type){
		case 0: //information
			title += 'Information';
			template += '<b>' + message + '</b>';
			break;
		case 1: //error
			title += 'Error';
			template += '<b>' + message + '</b>';
			break; 
		case 2: //response error
			title += 'Response Error';
			template += '<b>statusCode: ' + message.status + '<br>statusText: ' + message.statusText + '</b>'
			break;
		default: break;
		}
		$ionicPopup.alert({
			title: title, 
			template: template
		});
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doShowIonicLoading()
	 * purpose: show Ionic Loading
	 * ****************************** */
	function doShowIonicLoading(message){
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner><p class="font-family-1-size-medium">' + message + '</p>'
		});
	}
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */