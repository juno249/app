angular
.module('starter')
.factory(
		'reservationOrderreferenceOrderService', 
		reservationOrderreferenceOrderService
		);

reservationOrderreferenceOrderService.$inject = [
                                                 'API_BASE_URL', 
                                                 'KEYS', 
                                                 'ORDERREFERENCE_STATUS', 
                                                 'RESERVATION_STATUS', 
                                                 '$http', 
                                                 '$q', 
                                                 'orderService', 
                                                 'reservationService'
                                                 ];

function reservationOrderreferenceOrderService(
		API_BASE_URL, 
		KEYS, 
		ORDERREFERENCE_STATUS, 
		RESERVATION_STATUS, 
		$http, 
		$q, 
		orderService, 
		reservationService
		){
	var reservationOrderreferenceOrderServiceObj = {
			reservationsOrderreferencesOrders: {}, 
			customerUsername: undefined, 
			companyName: undefined, 
			branchName: undefined, 
			tableNumber: undefined, 
			getReservationsOrderreferencesOrders: getReservationsOrderreferencesOrders, 
			getCustomerUsername: getCustomerUsername, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			getTableNumber: getTableNumber, 
			setReservationsOrderreferencesOrders: setReservationsOrderreferencesOrders, 
			setCustomerUsername: setCustomerUsername, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			setTableNumber: setTableNumber, 
			fetchReservationsOrderreferencesOrders: fetchReservationsOrderreferencesOrders, 
			addReservationOrderreferenceOrder: addReservationOrderreferenceOrder
			}
	
	function getReservationsOrderreferencesOrders(){	return reservationOrderreferenceOrderServiceObj.reservationsOrderreferencesOrders;
	}
	function getCustomerUsername(){	return reservationOrderreferenceOrderServiceObj.customerUsername;
	}
	function getCompanyName(){	return reservationOrderreferenceOrderServiceObj.companyName;
	}
	function getBranchName(){	return reservationOrderreferenceOrderServiceObj.branchName;
	}
	function getTableNumber(){	return reservationOrderreferenceOrderServiceObj.tableNumber;
	}
	function setReservationsOrderreferencesOrders(reservationsOrderreferencesOrders){	reservationOrderreferenceOrderServiceObj.reservationsOrderreferencesOrders = reservationsOrderreferencesOrders;
	}
	function setCustomerUsername(customerUsername){	reservationOrderreferenceOrderServiceObj.customerUsername = customerUsername;
	}
	function setCompanyName(companyName){	reservationOrderreferenceOrderServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){	reservationOrderreferenceOrderServiceObj.branchName = branchName;
	}
	function setTableNumber(tableNumber){	reservationOrderreferenceOrderServiceObj.tableNumber = tableNumber;
	}
	
	function fetchReservationsOrderreferencesOrders(getOptionReservation){
		var deferred = $q.defer();
		var reservationsOrderreferencesOrders = {};
		
		if(16 == getOptionReservation){
			reservationService.setCustomerUsername(reservationOrderreferenceOrderServiceObj.customerUsername);
			reservationService.fetchReservations(	//getCustomerReservationsNotReservationStatus
					16, 
					{	ReservationStatus: RESERVATION_STATUS.done	}
					)
					.then(fetchReservationsSuccessCallback)
					.catch(fetchReservationsFailedCallback);
			} else if(13 == getOptionReservation){
				reservationService.setCustomerUsername(reservationOrderreferenceOrderServiceObj.customerUsername);
				reservationService.fetchReservations(	//getCustomerReservations
						13, 
						{}
						)
						.then(fetchReservationsSuccessCallback)
						.catch(fetchReservationsFailedCallback);
				} else if(4 == getOptionReservation){	//getCompanyBranchReservationsNotReservationStatus
					reservationService.setCompanyName(reservationOrderreferenceOrderServiceObj.companyName);
					reservationService.setBranchName(reservationOrderreferenceOrderServiceObj.branchName);
					reservationService.fetchReservations(
							4, 
							{	ReservationStatus: RESERVATION_STATUS.done	}
							)
							.then(fetchReservationsSuccessCallback)
							.catch(fetchReservationsFailedCallback);
					}
		
		function fetchReservationsSuccessCallback(response){
			var reservations = localStorage.getItem(KEYS.Reservations);
			reservations = JSON.parse(reservations);
			var reservationsKeyIdx = 0;
			
			if(0 == Object.keys(reservations).length){	deferred.resolve();
			}
			
			angular.forEach(
					reservations, 
					function(
							v, 
							k
							){
						reservationsOrderreferencesOrders[k] = {};
						reservationsOrderreferencesOrders[k][KEYS.Customers] = reservations[k][KEYS.Customers];
						reservationsOrderreferencesOrders[k][KEYS.Companies] = reservations[k][KEYS.Companies];
						reservationsOrderreferencesOrders[k][KEYS.Branches] = reservations[k][KEYS.Branches];
						reservationsOrderreferencesOrders[k][KEYS.Tables] = reservations[k][KEYS.Tables];
						reservationsOrderreferencesOrders[k][KEYS.Reservations] = reservations[k][KEYS.Reservations];
						reservationsOrderreferencesOrders[k][KEYS.Orderreferences] = reservations[k][KEYS.Orderreferences];
						
						orderService.fetchOrders(	//getByQuery
								13, 
								{	queryString: ('?OrderreferenceCode='+reservationsOrderreferencesOrders[k][KEYS.Orderreferences].orderreference_code)	}
								)
								.then(fetchOrdersSuccessCallback)
								.catch(fetchOrdersFailedCallback);
						}
					);
			
			function fetchOrdersSuccessCallback(response){
				var orders = localStorage.getItem(KEYS.Orders);
				orders = JSON.parse(orders);
				var orderreferenceCode;
				localStorage.removeItem(KEYS.Orders);
				
				angular.forEach(
						orders, 
						function(
								v, 
								k
								){	orderreferenceCode = v.orderreference_code;
								}
						);
				
				reservationsOrderreferencesOrders[orderreferenceCode][KEYS.Orders] = orders;
				reservationsKeyIdx++;
				
				if(reservationsKeyIdx == Object.keys(reservations).length){	deferred.resolve(reservationsOrderreferencesOrders);
				}
				}
			
			function fetchOrdersFailedCallback(responseError){	deferred.reject(responseError);
			}
			}
		
		function fetchReservationsFailedCallback(responseError){	deferred.reject(responseError);
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