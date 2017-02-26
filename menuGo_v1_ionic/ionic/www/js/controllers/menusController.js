angular
.module('starter')
.controller('menusController', menusController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
menusController.$inject = [
	'$ionicPopup', 
	'$localStorage', 
	'$scope', 
	'ordersService' 
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function menusController(
		$ionicPopup, 
		$localStorage, 
		$scope, 
		ordersService
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	var menus = localStorage.getItem('Menus');
	menus = JSON.parse(menus);
	vm.menus = menus;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */

	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.toggleViewMenuitems = toggleViewMenuitems;
	vm.addToCustomerOrders = addToCustomerOrders;
	vm.doShowIonicPopup = doShowIonicPopup;
	vm.doShowIonicLoading = doShowIonicLoading;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	initialize();
	
	/* ******************************
	 * Method Implementation
	 * method name: initialize()
	 * purpose: initializes isHiddenMenuitem property
	 * ****************************** */
	function initialize(){
		var menus = vm.menus;
		var menusKeys = Object.keys(menus);
		
		for(var i=0; i<menusKeys.length; i++){
			var menusRunner = menus[menusKeys[i]];
			menusRunner.isHiddenMenuitems = true;
			vm.menus[menusKeys[i]] = menusRunner;
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: toggleViewMenuitems()
	 * purpose: toggles isHiddenMenuitem property
	 * ****************************** */
	function toggleViewMenuitems(menu){
		var menus = vm.menus;
		var menusKeys = Object.keys(menus);
		
		for(var i=0; i<menusKeys.length; i++){
			menusRunner = menus[menusKeys[i]];
			if(menu.menu_id == menusRunner.menu_id){
				menusRunner.isHiddenMenuitems = !menusRunner.isHiddenMenuitems;
			} else {
				menusRunner.isHiddenMenuitems = true;
			}
			vm.menus[menusKeys[i]] = menusRunner;
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addToCustomerOrders()
	 * purpose: adds item to customerOrders
	 * ****************************** */
	function addToCustomerOrders(menu,  menuitem){
		var addToCustomerOrdersScope = $scope.$new(true); //isolate scope
		var addToCustomerOrdersController = vm;
		
		/* ******************************
		 * Controller Binded Data (Start)
		 * ****************************** */
		addToCustomerOrdersController
			.customerOrdersQuantity = 0;
		addToCustomerOrdersController
			.menu = menu;
		addToCustomerOrdersController
			.menuitem = menuitem;
		/* ******************************
		 * Controller Binded Data (End)
		 * ****************************** */
		
		/* ******************************
		 * Controller Binded Methods (Start)
		 * ****************************** */
		addToCustomerOrdersController
			.incCustomerOrdersQuantity = incCustomerOrdersQuantity;
		addToCustomerOrdersController
			.decCustomerOrdersQuantity = decCustomerOrdersQuantity;
		/* ******************************
		 * Controller Binded Methods (End)
		 * ****************************** */
		
		addToCustomerOrdersScope
			.controller = addToCustomerOrdersController;
		
		/* ******************************
		 * Method Implementation
		 * method name: incCustomerOrdersQuantity()
		 * purpose: increments customer order quantity
		 * ****************************** */
		function incCustomerOrdersQuantity(){
			addToCustomerOrdersScope.controller.customerOrdersQuantity++;
		}
		
		/* ******************************
		 * Method Implementation
		 * method name: decCustomerOrdersQuantity()
		 * purpose: decrements customer order quantity
		 * ****************************** */
		function decCustomerOrdersQuantity(){
			var customerOrdersQuantity = addToCustomerOrdersScope
				.controller
				.customerOrdersQuantity;
			customerOrdersQuantity --;
			if(customerOrdersQuantity < 0){	
				customerOrdersQuantity = 0;	
			}
			addToCustomerOrdersScope
				.controller.customerOrdersQuantity = customerOrdersQuantity;
		}
		
		/* ******************************
		 * Ionic Popup Configuration (Start)
		 * ****************************** */
		var componentClassCancel = 'button button-small button-assertive icon ion-android-close font-family-3-size-medium';
		var componentClassAdd = 'button button-small button-assertive icon ion-android-add font-family-3-size-medium';
		
		var cancelBtnConfig = {
			text:' Cancel', 
			type: componentClassCancel, 
			onTap: function(){
			}
		};
		var addBtnConfig = {
			text:' Add', 
			type: componentClassAdd, 
			onTap: function(){
				ordersService.addCustomerOrder(
					menu, 
					menuitem, 
					addToCustomerOrdersScope.controller.customerOrdersQuantity
				);
			}
		};
		var ionicPopupConfig = {
				templateUrl: 'templates/popups/addToCustomerOrders.html', 
				title:'Add To Cart', 
				scope:addToCustomerOrdersScope, 
				buttons: [cancelBtnConfig, addBtnConfig]
		};
		/* ******************************
		 * Ionic Popup Configuration (End)
		 * ****************************** */
		
		$ionicPopup.show(ionicPopupConfig)
		.then(function(){
			addToCustomerOrdersScope.$destroy();
		});
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