angular
.module('starter')
.factory('orderService', orderService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
orderService.$inject = [
	'API_BASE_URL', 
	'BROADCAST_MESSAGES', 
	'ORDER_STATUS', 
	'ORDERS_DB_FIELDS', 
	'$rootScope', 
	'$http', 
	'$localStorage', 
	'$q', 
	'loginService' 
];
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function orderService(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		ORDER_STATUS, 
		ORDERS_DB_FIELDS, 
		$rootScope, 
		$http, 
		$localStorage, 
		$q, 
		loginService 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var orderServiceObj = {
			orders: {}, 
			customerOrders: {},  
			companyName: undefined, 
			branchName: undefined, 
			tableNumber: undefined, 
			customerUsername: undefined, 
			orderId: undefined, 
			getOrders: getOrders, 
			getCustomerOrders: getCustomerOrders, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			getTableNumber: getTableNumber, 
			getCustomerUsername: getCustomerUsername, 
			getOrderId: getOrderId, 
			setOrders: setOrders, 
			setCustomerOrders: setCustomerOrders, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			setTableNumber: setTableNumber, 
			setCustomerUsername: setCustomerUsername, 
			setOrderId: setOrderId, 
			getOptions: {
				1: 'getCompanyBranchOrders', 
				2: 'getCompanyBranchOrdersOrderStatus', 
				3: 'getCompanyBranchTableOrders', 
				4: 'getCustomerOrders', 
				5: 'getCompanyBranchOrdersWIP', 
				6: 'getCompanyBranchTableOrdersWIP', 
				7: 'getCustomerOrdersWIP'
			}, 
			deleteOptions: {
				1: 'deleteOrderCompanyDirective', 
				2: 'deleteOrderCustomerDirective'
			}, 
			fetchOrders: fetchOrders, 
			addOrder: addOrder, 
			updateOrder: updateOrder, 
			deleteOrder: deleteOrder, 
			addCustomerOrder: addCustomerOrder, 
			incCustomerOrdersQuantity: incCustomerOrdersQuantity, 
			decCustomerOrdersQuantity: decCustomerOrdersQuantity, 
			customerOrdersToJson: customerOrdersToJson 
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getOrders(){
		return orderServiceObj.orders;
	}
	function getCustomerOrders(){
		return orderServiceObj.customerOrders;
	}
	function getCompanyName(){
		return orderServiceObj.companyName;
	}
	function getBranchName(){
		return orderServiceObj.branchName;
	}
	function getTableNumber(){
		return orderServiceObj.tableNumber;
	}
	function getCustomerUsername(){
		return orderServiceObj.customerUsername;
	}
	function getOrderId(){
		return orderServiceObj.orderId;
	}
	function setOrders(orders){
		orderServiceObj.orders = orders;
	}
	function setCustomerOrders(customerOrders){
		orderServiceObj.customerOrders = customerOrders;
	}
	function setCompanyName(companyName){
		orderServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){
		orderServiceObj.branchName = branchName;
	}
	function setTableNumber(tableNumber){
		orderServiceObj.tableNumber = tableNumber;
	}
	function setCustomerUsername(customerUsername){
		orderServiceObj.customerUsername = customerUsername;
	}
	function setOrderId(orderId){
		orderServiceObj.orderId = orderId;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchOrders()
	 * purpose: fetch orders from server
	 * ****************************** */
	function fetchOrders(getOption, getParams){
		var deferred = $q.defer();
		var httpConfig;
		
		/* ******************************
		 * Get Orders Selection (Start)
		 * ****************************** */
		switch(orderServiceObj.getOptions[getOption]){
		case 'getCompanyBranchOrders': 
			httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders'
			};
			break;
		case 'getCompanyBranchOrdersOrderStatus': 
			httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders/' + getParams //getParams is OrderStatus
			};
			break;
		case 'getCompanyBranchTableOrders':
			httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders'
			};
			break;
		case 'getCustomerOrders': 
			httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + orderServiceObj.customerUsername + '/orders'
			};
			break;
		case 'getCompanyBranchOrdersWIP': 
			httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders/WIP'
			};
			break;
		case 'getCompanyBranchTableOrdersWIP':
			httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders/WIP'
			};
			break;
		case 'getCustomerOrdersWIP': 
			httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + orderServiceObj.customerUsername + '/orders/WIP'
			};
			break;
		default: break;
		}
		/* ******************************
		 * Get Orders Selection (End)
		 * ****************************** */
		$http(httpConfig)
		.then(fetchOrdersSuccessCallback)
		.catch(fetchOrdersFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchOrdersSuccessCallback(response){
			orderServiceObj.orders = {};
			convertOrdersResponseToMap(response.data);
			var orders = orderServiceObj.orders;
			orders = JSON.stringify(orders);
			localStorage.setItem('Orders', orders);
			deferred.resolve(response);
		}
		
		function fetchOrdersFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertOrdersResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertOrdersResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var ordersKey = ORDERS_DB_FIELDS[0]; //order_id
			var ordersDetails = {};
			
			for(var i=0; i<responseDataLength; i++){
				var ordersRunner = responseData[i];
				var ordersDBFieldCount = Object.keys(ORDERS_DB_FIELDS).length;
				var ordersDBFieldRunner = null;
				ordersDetails = {};
				
				for(var j=0; j<ordersDBFieldCount; j++){
					ordersDBFieldRunner = ORDERS_DB_FIELDS[j];
					ordersDetails[ordersDBFieldRunner] = ordersRunner[ordersDBFieldRunner];
				}
				var ordersKeyValue = ordersRunner[ordersKey];
				orderServiceObj.orders[ordersKeyValue] = ordersDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addOrder()
	 * purpose: adds order
	 * ****************************** */
	function addOrder(orders){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers/' + orderServiceObj.customerUsername + '/orders', 
				data: orders
		};
		$http(httpConfig)
		.then(addOrderSuccessCallback)
		.catch(addOrderFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addOrderSuccessCallback(response){
			orderServiceObj.customerOrders = {};
			localStorage.removeItem('CustomerOrders');
			deferred.resolve(response);
		}
		
		function addOrderFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateOrder()
	 * purpose: updates order
	 * ****************************** */
	function updateOrder(order){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders/' + orderServiceObj.orderId, 
				data: order
		};
		$http(httpConfig)
		.then(updateOrderSuccessCallback)
		.catch(updateOrderFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateOrderSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateOrderFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteOrder()
	 * purpose: deletes order
	 * ****************************** */
	function deleteOrder(deleteOption){
		var deferred = $q.defer();
		var httpConfig;
		
		/* ******************************
		 * Delete Orders Selection (Start)
		 * ****************************** */
		switch(orderServiceObj.deleteOptions[deleteOption]){
		case 'deleteOrderCompanyDirective':
			httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders/' + orderServiceObj.orderId
			};
			break;
		case 'deleteOrderCustomerDirective':
			httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers/' + orderServiceObj.customerUsername + '/orders/' + orderServiceObj.orderId
			}
			break;
		default: break;
		}
		/* ******************************
		 * Delete Orders Selection (End)
		 * ****************************** */
		$http(httpConfig)
		.then(deleteOrderSuccessCallback)
		.catch(deleteOrderFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteOrderSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteOrderFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addCustomerOrder()
	 * purpose: adds customer order
	 * ****************************** */
	function addCustomerOrder(
			menu, 
			menuitem, 
			customerOrdersQuantity
	){
		var menuitem_code = menuitem.menuitem_code;
		var customerOrder = orderServiceObj.customerOrders[menuitem_code];
		var customerOrderCount = undefined;
		
		if(null == customerOrder){//non-existing
			customerOrderCount = 0;
			customerOrderCount += customerOrdersQuantity;
			
			customerOrder = {};
			customerOrder.menu = menu;
			customerOrder.menuitem = menuitem;
			customerOrder.customerOrderQuantity = customerOrderCount;
		} else {
			customerOrderCount = customerOrder.customerOrderQuantity;
			customerOrderCount += customerOrdersQuantity;
			customerOrder.customerOrderQuantity = customerOrderCount;
		}
		
		orderServiceObj.customerOrders[menuitem_code] = customerOrder;
		//update localStorage;
		var customerOrders = orderServiceObj.customerOrders;
		customerOrders = JSON.stringify(customerOrders);
		localStorage.setItem('CustomerOrders', customerOrders);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: incCustomerOrdersQuantity()
	 * purpose: increments customer order quantity
	 * ****************************** */
	function incCustomerOrdersQuantity(menuitem){
		var menuitem_code = menuitem.menuitem_code;
		var customerOrder = orderServiceObj.customerOrders[menuitem_code];
		var customerOrderCount = customerOrder.customerOrderQuantity;
		customerOrderCount++;
		
		customerOrder.customerOrderQuantity = customerOrderCount;
		orderServiceObj.customerOrders[menuitem_code] = customerOrder;
		//update localStorage;
		var customerOrders = orderServiceObj.customerOrders;
		customerOrders = JSON.stringify(customerOrders);
		localStorage.setItem('CustomerOrders', customerOrders);
		//broadcast message
		$rootScope.$broadcast(BROADCAST_MESSAGES.reloadCustomerOrders);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: decCustomerOrdersQuantity()
	 * purpose: decrements customer order quantity
	 * ****************************** */
	function decCustomerOrdersQuantity(menuitem){
		var menuitem_code = menuitem.menuitem_code;
		var customerOrder = orderServiceObj.customerOrders[menuitem_code];
		var customerOrderCount = customerOrder.customerOrderQuantity;
		customerOrderCount--;
		
		if(0 == customerOrderCount){
			delete orderServiceObj.customerOrders[menuitem_code];
		} else {
			customerOrder.customerOrderQuantity = customerOrderCount;
		}
		//update localStorage
		var customerOrders = orderServiceObj.customerOrders;
		customerOrders = JSON.stringify(customerOrders);
		localStorage.setItem('CustomerOrders', customerOrders);
		//broadcast message
		$rootScope.$broadcast(BROADCAST_MESSAGES.reloadCustomerOrders);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: customerOrdersToJson()
	 * purpose: converts customer orders to Json format
	 * ****************************** */
	function customerOrdersToJson(){
		var customerOrders = orderServiceObj.customerOrders;
		var customerOrdersKeys = Object.keys(customerOrders);
		var order = {};
		var orders = [];
		
		for(var i=0; i<customerOrdersKeys.length; i++){
			var customerOrdersRunner = customerOrders[customerOrdersKeys[i]];
			var customerOrderQuantity = customerOrdersRunner.customerOrderQuantity;
			
			for(var j=0; j<customerOrderQuantity; j++){
				var table = localStorage.getItem('Table');
				table = JSON.parse(table);
				var tableKey = Object.keys(table)[0]; //get only 1st record
				
				order = {};
				order.customer_username = loginService.getUser().username;
				order.menuitem_id = customerOrdersRunner.menuitem.menuitem_id;
				order.table_id = table[tableKey].table_id;
				order.order_status = ORDER_STATUS[0]; //statusSent
				
				orders.push(order);
			}
		}
		return orders;
	}
	
	return orderServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */