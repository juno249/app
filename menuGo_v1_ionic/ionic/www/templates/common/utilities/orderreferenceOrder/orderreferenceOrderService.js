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
			var orderreferences = localStorage.getItem(ORDERREFERENCES_KEY);
			orderreferences = JSON.parse(orderreferences);
			var orderreferencesKey = Object.keys(orderreferences);
			
			orderreferencesOrders.orderreferences = orderreferences[orderreferencesKey[0]][ORDERREFERENCES_KEY];
			
			orderService.fetchOrders(	//getByQuery
					13, 
					{	queryString: ('?OrderreferenceCode='+orderreferencesOrders.orderreferences.orderreference_code)	}
					)
					.then(fetchOrdersSuccessCallback)
					.catch(fetchOrdersFailedCallback);
			
			function fetchOrdersSuccessCallback(response){
				var orders = localStorage.getItem(ORDERS_KEY);
				orders = JSON.parse(orders);
				reservationsOrderreferencesOrders.orderreferences.orders = orders;
				localStorage.removeItem(ORDERS_KEY);
				
				deferred.resolve(reservationsOrderreferencesOrders);
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