angular
.module('starter')
.factory(
		'orderreferenceOrderService', 
		orderreferenceOrderService
		);

orderreferenceOrderService.$inject = [
                                      'API_BASE_URL', 
                                      'ORDERREFERENCE_STATUS', 
                                      '$http', 
                                      '$q', 
                                      'orderService', 
                                      'orderreferenceService'
                                      ];

function orderreferenceOrderService(
		API_BASE_URL, 
		ORDERREFERENCE_STATUS, 
		$http, 
		$q, 
		orderService, 
		orderreferenceService
		){
	const ORDERS_KEY = 'Orders';
	const ORDERREFERENCES_KEY = 'Orderreferences';
	
	var orderreferenceOrderServiceObj = {
			orderreferencesOrders: {}, 
			customerUsername: undefined, 
			getOrderreferencesOrders: getOrderreferencesOrders, 
			getCustomerUsername: getCustomerUsername, 
			setOrderreferencesOrders: setOrderreferencesOrders, 
			setCustomerUsername: setCustomerUsername, 
			fetchOrderreferencesOrders: fetchOrderreferencesOrders, 
			addOrderreferenceOrder: addOrderreferenceOrder
			}
	
	function getOrderreferencesOrders(){	return orderreferenceOrderServiceObj.orderreferencesOrders;
	}
	function getCustomerUsername(){	return orderreferenceOrderServiceObj.customerUsername;
	}
	function setOrderreferencesOrders(orderreferencesOrders){	orderreferenceOrderServiceObj.orderreferencesOrders = orderreferencesOrders;
	}
	function setCustomerUsername(customerUsername){	orderreferenceOrderServiceObj.customerUsername = customerUsername;
	}
	
	function fetchOrderreferencesOrders(){
		var deferred = $q.defer();
		var orderreferencesOrders = {};
		
		orderreferenceService.setCustomerUsername(orderreferenceOrderServiceObj.customerUsername);
		orderreferenceService.fetchOrderreferences(	//getCustomerOrderreferencesNotOrderreferenceStatus
				12, 
				{	OrderreferenceStatus: ORDERREFERENCE_STATUS.done	}
				)
				.then(fetchOrderreferencesSuccessCallback)
				.catch(fetchOrderreferencesFailedCallback);
		
		function fetchOrderreferencesSuccessCallback(response){
			var orderreferenceCode = undefined;
			var orderreference = localStorage.getItem(ORDERREFERENCES_KEY);
			orderreference = JSON.parse(orderreference);
			orderreferencesOrders.orderreference = orderreference;
			localStorage.removeItem(ORDERREFERENCES_KEY);
			
			angular.forEach(
					orderreference, 
					function(
							v, 
							k
							){	orderreferenceCode = k;
							}
					);
			
			orderService.fetchOrders(	//getByQuery
					13, 
					{	queryString: ('?OrderreferenceCode='+orderreferenceCode)	}
					)
					.then(fetchOrdersSuccessCallback)
					.catch(fetchOrdersFailedCallback);
			
			function fetchOrdersSuccessCallback(response){
				var order = localStorage.getItem(ORDERS_KEY);
				order = JSON.parse(order);
				orderreferencesOrders.orderreference.order = order;
				localStorage.removeItem(ORDERS_KEY);
				
				deferred.resolve(orderreferencesOrders);
				}
			
			function fetchOrdersFailedCallback(responseError){	deferred.reject(responseError);
			}
			}
		
		function fetchOrderreferencesFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addOrderreferenceOrder(transParams){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/orderreferences-orders', 
				data: transParams
				}
		
		$http(httpConfig)
		.then(addOrderreferenceOrderSuccessCallback)
		.catch(addOrderreferenceOrderFailedCallback);
		
		function addOrderreferenceOrderSuccessCallback(response){	deferred.promise(response);
		}
		
		function addOrderreferenceOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return orderreferenceOrderServiceObj;
	}