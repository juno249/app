angular
.module('starter')
.controller('homeOrderController', homeOrderController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
homeOrderController.$inject = [
	'BROADCAST_MESSAGES', 
	'LOADING_MESSAGES', 
	'MQTT_CONFIG', 
	'$ionicLoading', 
	'$ionicPopup', 
	'$localStorage', 
	'$rootScope', 
	'$scope', 
	'$timeout', 
	'loginService', 
	'mqttService', 
	'ordersService', 
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function homeOrderController(
		BROADCAST_MESSAGES, 
		LOADING_MESSAGES, 
		MQTT_CONFIG, 
		$ionicLoading, 
		$ionicPopup, 
		$localStorage, 
		$rootScope, 
		$scope, 
		$timeout, 
		loginService, 
		mqttService, 
		ordersService
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	var customerOrders = localStorage.getItem('CustomerOrders');
	customerOrders = JSON.parse(customerOrders);
	vm.customerOrders = customerOrders;
	var orders = localStorage.getItem('Orders');
	orders = JSON.parse(orders);
	vm.orders = orders;
	vm.isCheckoutBtnHidden = true;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.incCustomerOrdersQuantity = incCustomerOrdersQuantity;
	vm.decCustomerOrdersQuantity = decCustomerOrdersQuantity;
	vm.addOrder = addOrder;
	vm.getMenuMenuitem = getMenuMenuitem;
	vm.broadcastEventMessage = broadcastEventMessage;
	vm.doShowIonicPopup = doShowIonicPopup;
	vm.doShowIonicLoading = doShowIonicLoading;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: reloadCustomerOrders()
	 * purpose: reloads customer orders
	 * ****************************** */
	var reloadCustomerOrders = function(){
		var customerOrders = localStorage.getItem('CustomerOrders');
		if(null == customerOrders){
			vm.customerOrders = customerOrders;
			vm.isCheckoutBtnHidden = true;
			return;
		}
		customerOrders = JSON.parse(customerOrders);
		var customerOrdersKeys = Object.keys(customerOrders);
		vm.customerOrders = customerOrders;
		vm.isCheckoutBtnHidden =
			(null == customerOrders) || 
			(0 == customerOrdersKeys.length);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: reloadOrders()
	 * purpose: reloads orders
	 * ****************************** */
	var reloadOrders = function(){
		var getOption = 7; //getCustomerOrdersWIP
		var customerUsername = loginService.getUser().username;
		
		ordersService.setCustomerUsername(customerUsername);
		ordersService.fetchOrders(getOption, null)
		.then(fetchOrdersSuccessCallback)
		.catch(fetchOrdersFailedCallback);
		doShowIonicLoading(LOADING_MESSAGES.reloadOrders);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchOrdersSuccessCallback(response){
			$ionicLoading.hide();
			var orders = localStorage.getItem('Orders');
			orders = JSON.parse(orders);
			vm.orders = orders;
			var ordersKeys = Object.keys(orders);
			
			for(var i=0; i<ordersKeys.length; i++){
				var ordersRunner = orders[ordersKeys[i]];
				var menuMenuitem = getMenuMenuitem(ordersRunner.menuitem_id);
				//get menu & menuitem records
				var menuKey = Object.keys(menuMenuitem.menu)[0];
				var menuitemKey = Object.keys(menuMenuitem.menuitem)[0];
				ordersRunner.menu = menuMenuitem.menu[menuKey];
				ordersRunner.menuitem = menuMenuitem.menuitem[menuitemKey];
				vm.orders[ordersKeys[i]] = ordersRunner;
			}
		}
		
		function fetchOrdersFailedCallback(responseError){
			$ionicLoading.hide();
			doShowIonicPopup(2, responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: incCustomerOrdersQuantity()
	 * purpose: increments customer order quantity
	 * ****************************** */
	function incCustomerOrdersQuantity(menuitem){
		ordersService.incCustomerOrdersQuantity(menuitem);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: decCustomerOrdersQuantity()
	 * purpose: decrements customer order quantity
	 * ****************************** */
	function decCustomerOrdersQuantity(menuitem){
		ordersService.decCustomerOrdersQuantity(menuitem);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addOrder()
	 * purpose: sends order to server
	 * ****************************** */
	function addOrder(){
		var customerOrders = ordersService.customerOrdersToJson();
		
		ordersService.addOrder(customerOrders)
		.then(addOrderSuccessCallback)
		.catch(addOrderFailedCallback);
		doShowIonicLoading(LOADING_MESSAGES.addOrder);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addOrderSuccessCallback(response){
			$ionicLoading.hide();
			
			//broadcast message to reload customerOrders & orders
			$rootScope.$broadcast(BROADCAST_MESSAGES.reloadCustomerOrders);
			$rootScope.$broadcast(BROADCAST_MESSAGES.reloadOrders);
		}
		
		function addOrderFailedCallback(responseError){
			$ionicLoading.hide();
			doShowIonicPopup(2, responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: getMenuMenuitem()
	 * purpose: returns menuMenuitem  based on menuitem_id
	 * ****************************** */
	function getMenuMenuitem(menuitem_id){
		var menus =localStorage.getItem('Menus');
		menus = JSON.parse(menus);
		var menusKeys = Object.keys(menus);
		
		for(var i=0; i<menusKeys.length; i++){
			var menusRunner = menus[menusKeys[i]];
			var menu = {};
			var menuName = menusRunner.menu_name;
			menu[menuName] = menusRunner; 
			var menuitems = menu[menuName].menuitems;
			var menuitemsKeys = Object.keys(menuitems);
			
			for(var j=0; j<menuitemsKeys.length; j++){
				var menuitemsRunner = menuitems[menuitemsKeys[j]];
				var menuitem = {};
				var menuitemCode = menuitemsRunner.menuitem_code;
				menuitem[menuitemCode] = menuitemsRunner;
				
				if(menuitem_id == menuitem[menuitemCode].menuitem_id){
					var menuMenuitem = {};
					menuMenuitem.menu = menu;
					menuMenuitem.menuitem = menuitem;
					return menuMenuitem;
				}
			}
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: broadcastEventMessage()
	 * purpose: broadcast an event message
	 * ****************************** */
	function broadcastEventMessage(eventMessage){
		var timeoutDelay = 100;
		$timeout(function(){ 
			$rootScope.$broadcast(eventMessage); 
			}, timeoutDelay);
	}

	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGES.reloadCustomerOrders, reloadCustomerOrders);
	$scope.$on(BROADCAST_MESSAGES.reloadOrders, reloadOrders);
	/* ******************************
	 * Broadcast Event Handlers (End)
	 * ****************************** */
	
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