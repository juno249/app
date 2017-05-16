angular
.module(
		'starter', 
		[
			'ionic', 
			'ngCordova', 
			'ngMap', 
			'ngStorage', 
			'ion-datetime-picker', 
			'ionic.cloud'
			]
		)
		.config(doRouteConfig)
		.config(doIonicConfig)
		.config(doIonicCloudConfig)
		.run(doRunConfig);

function doRouteConfig(
		$stateProvider, 
		$urlRouterProvider
		){
	$stateProvider
	.state(
			'login', 
			{
				url: '/', 
				views: {
					'main': {
						templateUrl: 'templates/login/login.html', 
						controller: 'loginController', 
						controllerAs: 'loginController'
							}
			}
			}
			)
			.state(
					'customer', 
					{
						url: '/customer', 
						abstract: true, 
						views: {
							'main': {
								templateUrl: 'templates/customer/customer.html'
									}
					}
					}
					)
					.state(
							'customer.home', 
							{
								url: '/home', 
								views: {
									'customer-home': {
										templateUrl: 'templates/customer/home/customer-home.html', 
										controller: 'customerHomeController', 
										controllerAs: 'customerHomeController'
											}
							}
							}
							)
							.state(
									'customer.nearby', 
									{
										url: '/nearby', 
										views: {
											'customer-nearby': {
												templateUrl: 'templates/customer/nearby/customer-nearby.html', 
												controller: 'customerNearbyController', 
												controllerAs: 'customerNearbyController'
													}
									}
									}
									)
									.state(
											'customer.nearby.reservation_menu', 
											{
												url: '/reservation_menu/:companyName/:branchName', 
												views: {
													'customer-nearby@customer': {
														templateUrl: 'templates/customer/nearby/reservation_menu/nearby-reservation_menu.html', 
														controller: 'nearbyReservationMenuController', 
														controllerAs: 'nearbyReservationMenuController'
															}
											}
											}
											)
											.state(
													'customer.nearby.reservation_order', 
													{
														url: '/reservation_order', 
														views: {
															'customer-nearby@customer': {
																templateUrl: 'templates/customer/nearby/reservation_order/nearby-reservation_order.html', 
																controller: 'nearbyReservationOrderController', 
																controllerAs: 'nearbyReservationOrderController'
																	}
													}
													}
													)
													.state(
															'customer.mymenu', 
															{
																url: '/mymenu', 
																views: {
																	'customer-mymenu': {
																		templateUrl: 'templates/customer/mymenu/customer-mymenu.html', 
																		controller: 'customerMymenuController', 
																		controllerAs: 'customerMymenuController'
																			}
															}
															}
															)
															.state(
																	'customer.reservation', 
																	{
																		url: '/reservation', 
																		views: {
																			'customer-reservation': {
																				templateUrl: 'templates/customer/reservation/customer-reservation.html', 
																				controller: 'customerReservationController', 
																				controllerAs: 'customerReservationController'
																					}
																	}
																	}
																	)
			.state(
					'restaurant', 
					{
						url: '/restaurant', 
						abstract: true, 
						views: {
							'main': {
								templateUrl: 'templates/restaurant/restaurant.html'
									}
					}
					}
					)
					.state(
							'restaurant.home', 
							{
								url: '/home/:companyName', 
								views: {
									'restaurant-content': {
										templateUrl: 'templates/restaurant/home/restaurant-home.html', 
										controller: 'restaurantHomeController', 
										controllerAs: 'restaurantHomeController'
											}
							}
							}
							)
							.state(
									'restaurant.customer-launch', 
									{
										url: '/customer-launch/:companyName', 
										views: {
											'restaurant-content': {
												templateUrl: 'templates/restaurant/customer/launch/customer-launch.html', 
												controller: 'customerLaunchController', 
												controllerAs: 'customerLaunchController'
													}
									}
									}
									)
									.state(
											'restaurant.customer-qr', 
											{
												url: '/customer-qr/:companyName', 
												views: {
													'restaurant-content': {
														templateUrl: 'templates/restaurant/customer/qr/customer-qr.html', 
														controller: 'customerQrController', 
														controllerAs: 'customerQrController'
															}
											}
											}
											)
											.state(
													'restaurant.customer-order_menu', 
													{
														url: '/customer-order_menu/:companyName/:branchName/:tableNumber/:orderreferenceCode', 
														views: {
															'restaurant-content': {
																templateUrl: 'templates/restaurant/customer/order_menu/customer-order_menu.html', 
																controller: 'customerOrderMenuController', 
																controllerAs: 'customerOrderMenuController'
																	}
													}
													}
													)
													.state(
															'restaurant.customer-order_order', 
															{
																url: '/customer-order_order/:companyName/:branchName/:tableNumber/:orderreferenceCode', 
																views: {
																	'restaurant-content': {
																		templateUrl: 'templates/restaurant/customer/order_order/customer-order_order.html', 
																		controller: 'customerOrderOrderController', 
																		controllerAs: 'customerOrderOrderController'
																			}
															}
															}
															)
															.state(
																	'restaurant.table-orderreference', 
																	{
																		url: '/table-orderreference/:companyName/:branchName', 
																		views: {
																			'restaurant-content': {
																				templateUrl: 'templates/restaurant/table/orderreference/table-orderreference.html', 
																				controller: 'tableOrderreferenceController', 
																				controllerAs: 'tableOrderreferenceController'
																					}
																	}
																	}
																	)
																	.state(
																			'restaurant.table-order', 
																			{
																				url: '/table-order/:companyName/:branchName/:orderreference', 
																				views: {
																					'restaurant-content': {
																						templateUrl: 'templates/restaurant/table/order/table-order.html', 
																						controller: 'tableOrderController', 
																						controllerAs: 'tableOrderController'
																							}
																			}
																			}
																			);
	
	$urlRouterProvider
	.otherwise('/');
	}

function doIonicConfig($ionicConfigProvider){	$ionicConfigProvider.tabs.position('bottom');
}

function doIonicCloudConfig($ionicCloudProvider){
	var ionicCloudConfig = {
			'core': {
				'app_id': 'bdc472d0'
			}, 
			'push': {
				'sender_id': '965409630264', 
				'pluginConfig': {
					'ios': {
						'badge': true, 
						'sound': true
					}, 
					'android': {
						'iconColor': '#303030'
							}
					}
			}
			}
	
	$ionicCloudProvider.init(ionicCloudConfig);
	}

function doRunConfig(
		$ionicPlatform, 
		$ionicPush, 
		$rootScope
		){
	$ionicPlatform.ready(
			function(){
				if(window.cordova && window.cordova.plugins.Keyboard){
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
					cordova.plugins.Keyboard.disableScroll(true);
					}
				
				if(window.StatusBar) {	StatusBar.styleDefault();
				}
				}
			);
	
	$rootScope.keys = Object.keys;
	$rootScope.$on(
			'$stateChangeStart', 
			function(
					e, 
					toState, 
					toStateParams, 
					fromState, 
					fromStateParams
					){
				}
			);
	}