angular
.module('starter')
.controller('adminController', adminController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
adminController.$inject = [
	'LOADING_MESSAGES', 
	'ORDER_STATUS', 
	'USER_ROLES', 
	'$http', 
	'$interval', 
	'$ionicLoading', 
	'$ionicPopup', 
	'$state', 
	'loginService', 
	'ordersService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function adminController(
		LOADING_MESSAGES, 
		ORDER_STATUS, 
		USER_ROLES, 
		$http, 
		$interval, 
		$ionicLoading, 
		$ionicPopup, 
		$state, 
		loginService, 
		ordersService
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	var userRole = loginService.getUser().role;
	vm.userRole = userRole;
	var companyBranchOrders = localStorage.getItem('Orders');
	companyBranchOrders = JSON.parse(companyBranchOrders);
	vm.companyBranchOrders = companyBranchOrders;
	vm.interval = undefined;
	
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.reloadCompanyBranchOrders = reloadCompanyBranchOrders;
	vm.updateOrderStatus = updateOrderStatus;
	vm.getMenuMenuitem = getMenuMenuitem;
	vm.getTable = getTable;
	vm.doShowIonicPopup = doShowIonicPopup;
	vm.doShowIonicLoading = doShowIonicLoading;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: reloadCompanyBranchOrders()
	 * purpose: reload company branch orders
	 * ****************************** */
	function reloadCompanyBranchOrders(orderStatus){
		var company = localStorage.getItem('Company');
		company = JSON.parse(company);
		var companyKey = Object.keys(company)[0]; 
		var companyName = company[companyKey].company_name;
		var branch = localStorage.getItem('Branch');
		branch = JSON.parse(branch);
		var branchKey = Object.keys(branch)[0];
		var branchName = branch[branchKey].branch_name;
		var getOption = 2; //getCompanyBranchOrdersOrderStatus
		
		ordersService.setCompanyName(companyName);
		ordersService.setBranchName(branchName);
		ordersService.fetchOrders(getOption, orderStatus)
		.then(fetchOrdersSuccessCallback)
		.catch(fetchOrdersFailedCallback);
		doShowIonicLoading(LOADING_MESSAGES.reloadCompanyBranchOrders);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchOrdersSuccessCallback(response){
			$ionicLoading.hide();
			var companyBranchOrders = localStorage.getItem('Orders');
			companyBranchOrders = JSON.parse(companyBranchOrders);
			var companyBranchOrdersKeys = Object.keys(companyBranchOrders);
			
			for(var i=0; i<companyBranchOrdersKeys.length; i++){
				var companyBranchOrdersRunner = companyBranchOrders[companyBranchOrdersKeys[i]];
				var menuitem_id = companyBranchOrdersRunner.menuitem_id;
				var menuMenuitem = getMenuMenuitem(menuitem_id);
				companyBranchOrdersRunner.menu = menuMenuitem.menu;
				companyBranchOrdersRunner.menuitem = menuMenuitem.menuitem;
				companyBranchOrders[companyBranchOrdersKeys[i]] = companyBranchOrdersRunner;
			}
			
			if(USER_ROLES.admin == vm.userRole){
				vm.companyBranchOrders = companyBranchOrders;
			} else if(USER_ROLES.cook == vm.userRole){
				switch(orderStatus){
				case ORDER_STATUS[1]: //statusAck
					if(null == vm.companyBranchOrders || 
							undefined == vm.companyBranchOrders){
						vm.companyBranchOrders = {};
					}
					vm.companyBranchOrders.statusAck = {};
					vm.companyBranchOrders.statusAck = companyBranchOrders;
					break;
				case ORDER_STATUS[2]: //statusCooking
					if(null == vm.companyBranchOrders || 
							undefined == vm.companyBranchOrders){
						vm.companyBranchOrders = {};
					}
					vm.companyBranchOrders.statusCooking = {};
					vm.companyBranchOrders.statusCooking = companyBranchOrders;
					break;
				default: break;
				}
			}
		}
		
		function fetchOrdersFailedCallback(responseError){
			$ionicLoading.hide();
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateOrderStatus()
	 * purpose: updates order status
	 * ****************************** */
	function updateOrderStatus(order){
		var company = localStorage.getItem('Company');
		company = JSON.parse(company);
		var companyKey = Object.keys(company)[0];
		var companyName = company[companyKey].company_name;
		var branch = localStorage.getItem('Branch');
		branch = JSON.parse(branch);
		var branchKey = Object.keys(branch)[0];
		var branchName = branch[branchKey].branch_name;
		var tableId = order.table_id;
		var table = getTable(tableId);
		var tableKey = Object.keys(table)[0];
		var tableNumber = table[tableKey].table_number;
		var orderId = order.order_id;
		var orderStatus = order.order_status;
		var orders = [];
		var order = {};
		
		ordersService.setCompanyName(companyName);
		ordersService.setBranchName(branchName);
		ordersService.setTableNumber(tableNumber);
		ordersService.setOrderId(orderId);
		
		if(USER_ROLES.admin == vm.userRole){
			var nextStatus = ORDER_STATUS[1]; //statusAck
			order.order_status = nextStatus;
		} else if(USER_ROLES.cook == vm.userRole){
			var nextStatus;
			switch(orderStatus){
			case ORDER_STATUS[1]: //statusAck
				nextStatus = ORDER_STATUS[2]; //statusCooking
				order.order_status = nextStatus;
				break;
			case ORDER_STATUS[2]: //statusCooking
				nextStatus = ORDER_STATUS[3]; //statusServed
				order.order_status = nextStatus;
				break;
			default: 
				break;
			}
		}
		
		orders.push(order);
		ordersService.updateOrder(orders)
		.then(updateOrderSuccessCallback)
		.catch(updateOrderFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateOrderSuccessCallback(response){
			delete vm.companyBranchOrders[orderId];
		}
		
		function updateOrderFailedCallback(responseError){
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: getMenuMenuitem()
	 * purpose: returns menuMenuitem based on menuitem_id
	 * ****************************** */
	function getMenuMenuitem(menuitem_id){
		var menus =localStorage.getItem('Menus');
		menus = JSON.parse(menus);
		var menusKeys = Object.keys(menus);
		
		for(var i=0; i<menusKeys.length; i++){
			var menusRunner = menus[menusKeys[i]];
			var menu = {};
			var menuName = menusRunner.menu_name;
			menu = menusRunner; 
			var menuitems = menu.menuitems;
			var menuitemsKeys = Object.keys(menuitems);
			
			for(var j=0; j<menuitemsKeys.length; j++){
				var menuitemsRunner = menuitems[menuitemsKeys[j]];
				var menuitem = {};
				var menuitemCode = menuitemsRunner.menuitem_code;
				menuitem = menuitemsRunner;
				
				if(menuitem_id == menuitem.menuitem_id){
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
	 * method name: getTable()
	 * purpose: returns table based on table_id
	 * ****************************** */
	function getTable(table_id){
		var tables = localStorage.getItem('Tables');
		tables = JSON.parse(tables);
		var tablesKeys = Object.keys(tables);
		
		for(var i=0; i<tablesKeys.length; i++){
			var tablesRunner = tables[tablesKeys[i]];
			var table = {};
			var tableNumber = tablesRunner.table_number;
			table[tableNumber] = tablesRunner;
			
			if(table_id == table[tableNumber].table_id){
				return table;
			}
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
	
	if(USER_ROLES.admin == vm.userRole){
		/* ******************************
		 * companyBranchOrders first load (Start)
		 * ****************************** */
		reloadCompanyBranchOrders('statusSent'); 
		vm.interval = $interval(function(){ reloadCompanyBranchOrders('statusSent'); }, 5000);
	} else if(USER_ROLES.cook == vm.userRole){
		/* ******************************
		 * companyBranchOrders first load (Start)
		 * ****************************** */
		reloadCompanyBranchOrders('statusAck'); 
		reloadCompanyBranchOrders('statusCooking'); 
		vm.interval = $interval(function(){
			reloadCompanyBranchOrders('statusAck');
			reloadCompanyBranchOrders('statusCooking');
		}, 5000)
	}
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */