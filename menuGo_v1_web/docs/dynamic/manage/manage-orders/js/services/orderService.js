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
				3: 'getCompanyBranchOrdersNotOrderStatus', 
				4: 'getCompanyBranchTableOrders', 
				5: 'getCompanyBranchTableOrdersOrderStatus', 
				6: 'getCompanyBranchTableOrdersNotOrderStatus', 
				7: 'getCustomerOrders', 
				8: 'getCustomerOrdersOrderStatus', 
				9: 'getCustomerOrdersNotOrderStatus'
			}, 
			deleteOptions: {
				1: 'deleteOrderCompany', 
				2: 'deleteOrderCustomer'
			}, 
			fetchOrders: fetchOrders, 
			addOrder: addOrder, 
			updateOrder: updateOrder, 
			deleteOrder: deleteOrder
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
	function fetchOrders(
			getOption, 
			getParams
		){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET'
		}
		
		/* ******************************
		 * Get Orders Selection (Start)
		 * ****************************** */
		switch(orderServiceObj.getOptions[getOption]){
			case 'getCompanyBranchOrders': 
				httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders';
				break;
			case 'getCompanyBranchOrdersOrderStatus': 
				httpConfiig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders/' + getParams['OrderStatus'];
				break;
			case 'getCompanyBranchOrdersNotOrderStatus': 
				httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders/not/' + getParams['OrderStatus'];
				break;
			case 'getCompanyBranchTableOrders': 
				httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders';
				break;
			case 'getCompanyBranchTableOrdersOrderStatus': 
				httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders/' + getParams['OrderStatus'];
				break;
			case 'getCompanyBranchTableOrdersNotOrderStatus':
				httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders/not/' + getParams['OrderStatus'];
				break;
			case 'getCustomerOrders': 
				httpConfig['url'] = API_BASE_URL + '/customers/' + orderServiceObj.customerUsername + '/orders';
				break;
			case 'getCustomerOrdersOrderStatus': 
				httpConfig['url'] = API_BASE_URL + '/customers/' + orderServiceObj.customerUsername + '/orders/' + getParams['OrderStatus']
				break;
			case 'getCustomerOrdersNotOrderStatus': 
				httpConfig['url'] = API_BASE_URL + '/customers/' + orderServiceObj.customerUsername + '/orders/not/' + getParams['OrderStatus']
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
			var orders = orderServiceObj.orders;
			orders = {};
			orderServiceObj.orders = orders;
			
			convertOrdersResponseToMap(response.data);
			orders = orderServiceObj.orders;
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
		var httpConfig = {
				method: 'DELETE'
		}
		
		/* ******************************
		 * Delete Orders Selection (Start)
		 * ****************************** */
		switch(orderServiceObj.deleteOptions[deleteOption]){
			case 'deleteOrderCompany':
				httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders/' + orderServiceObj.orderId;
				break;
			case 'deleteOrderCustomer':
				httpConfig['url'] = API_BASE_URL + '/customers/' + orderServiceObj.customerUsername + '/orders/' + orderServiceObj.orderId;
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
	
	return orderServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */