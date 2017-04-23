angular
.module('starter')
.factory(
		'reservationOrderreferenceOrderService', 
		reservationOrderreferenceOrderService
		);

reservationOrderreferenceOrderService.$inject = [
                                                 'API_BASE_URL', 
                                                 'RESERVATION_STATUS', 
                                                 '$http', 
                                                 '$q', 
                                                 'orderService', 
                                                 'orderreferenceService', 
                                                 'reservationService'
                                                 ];

function reservationOrderreferenceOrderService(
		API_BASE_URL, 
		RESERVATION_STATUS, 
		$http, 
		$q, 
		orderService, 
		orderreferenceService, 
		reservationService
		){
	const ORDERS_KEY = 'Orders';
	const ORDERREFERENCES_KEY = 'Orderreferences';
	const RESERVATIONS_KEY = 'Reservations';
	
	var reservationOrderreferenceOrderServiceObj = {
			reservationsOrderreferencesOrders: {}, 
			customerUsername: undefined, 
			getReservationsOrderreferencesOrders: getReservationsOrderreferencesOrders, 
			getCustomerUsername: getCustomerUsername, 
			setReservationsOrderreferencesOrders: setReservationsOrderreferencesOrders, 
			setCustomerUsername: setCustomerUsername, 
			fetchReservationsOrderreferencesOrders: fetchReservationsOrderreferencesOrders, 
			addReservationOrderreferenceOrder: addReservationOrderreferenceOrder
			}
	
	function getReservationsOrderreferencesOrders(){	return reservationOrderreferenceOrderServiceObj.reservationsOrderreferencesOrders;
	}
	function setReservationsOrderreferencesOrders(reservationsOrderreferencesOrders){	reservationOrderreferenceOrderServiceObj.reservationsOrderreferencesOrders = reservationsOrderreferencesOrders;
	}
	function getCustomerUsername(){	return reservationOrderreferenceOrderServiceObj.customerUsername;
	}
	function setCustomerUsername(customerUsername){	return reservationOrderreferenceOrderServiceObj.customerUsername = customerUsername;
	}
	
	function fetchReservationsOrderreferencesOrders(){
		var deferred = $q.defer();
		var reservationsOrderreferencesOrders = {};
		
		reservationService.setCustomerUsername(reservationOrderreferenceOrderServiceObj.customerUsername);
		reservationService.fetchReservations(	//getCustomerReservationsNotReservationStatus
				16, 
				{	ReservationStatus: RESERVATION_STATUS.done	}
				)
				.then(fetchReservationsSuccessCallback)
				.catch(fetchReservationsFailedCallback);
		
		function fetchReservationsSuccessCallback(response){
			var reservation = localStorage.getItem(RESERVATIONS_KEY);
			reservation = JSON.parse(reservation);
			reservationsOrderreferencesOrders.reservation = reservation;
			localStorage.removeItem(RESERVATIONS_KEY);
			
			orderreferenceService.setCustomerUsername(reservationOrderreferenceOrderServiceObj.customerUsername);
			orderreferenceService.fetchOrderreferences(	//getCustomerOrderreferencesNotOrderreferenceStatus
					12, 
					{	ReservationStatus: RESERVATION_STATUS.done	}
					)
					.then(fetchOrderreferencesSuccessCallback)
					.catch(fetchOrderreferencesFailedCallback);
			
			function fetchOrderreferencesSuccessCallback(response){
				var orderreferenceCode = undefined;
				var orderreference = localStorage.getItem(ORDERREFERENCES_KEY);
				orderreference = JSON.parse(orderreference);
				reservationsOrderreferencesOrders.orderreference = orderreference;
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
					reservationsOrderreferencesOrders.orderreference.order = order;
					localStorage.removeItem(ORDERS_KEY);
					
					deferred.resolve(reservationsOrderreferencesOrders);
				}
				
				function fetchOrdersFailedCallback(responseError){	deferred.reject(responseError);
				}
				}
			
			function fetchOrderreferencesFailedCallback(responseError){	deferred.reject(responseError);
			}
			}
		
		function fetchReservationsFailedCallback(responseError){	deffered.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addReservationOrderreferenceOrder(transParams){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/reservations-orderreferences-orders', 
				data: transParams
				}
		
		$http(httpConfig)
		.then(addReservationOrderreferenceOrderSuccessCallback)
		.catch(addReservationOrderreferenceOrderFailedCallback);
		
		function addReservationOrderreferenceOrderSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addReservationOrderreferenceOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return reservationOrderreferenceOrderServiceObj;
	}