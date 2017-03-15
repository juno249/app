<?php

use Illuminate\Http\Request;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');

/*
 |--------------------------------------------------------------------------
 | API Routes
 |--------------------------------------------------------------------------
 |
 | Here is where you can register API routes for your application. These
 | routes are loaded by the RouteServiceProvider within a group which
 | is assigned the "api" middleware group. Enjoy building your API!
 |
 */

Route::get('/user', function (Request $request) {
	return $request->user();
})->middleware('auth:api');

/*
 * Routes::authenticateController
 * */
Route::post('login', 'authenticateController@authenticate');

/*
 * Routes: filesController
 * */
Route::get('companies/{CompanyName}/companyImage', [
		'uses' => 'filesController@getCompanyImage'
]);

Route::post('companies/{CompanyName}/companyImage', [
		'uses' => 'filesController@uploadCompanyImage'
]);

Route::delete('companies/{CompanyName}/companyImage', [
		'uses' => 'filesController@deleteCompanyImage'
]);

Route::get('companies/{CompanyName}/menus/{MenuName}/menuImage', [
		'uses' => 'filesController@getCompanyMenuImage'
]);

Route::post('companies/{CompanyName}/menus/{MenuName}/menuImage', [
		'uses' => 'filesController@uploadCompanyMenuImage'
]);

Route::delete('companies/{CompanyName}/menus/{MenuName}/menuImage', [
		'uses' => 'filesController@deleteCompanyMenuImage'
]);

Route::get('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}/menuitemImage', [
		'uses' => 'filesController@getCompanyMenuMenuitemImage'
]);

Route::post('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}/menuitemImage', [
		'uses' => 'filesController@uploadCompanyMenuMenuitemImage'
]);

Route::delete('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}/menuitemImage', [
		'uses' => 'filesController@deleteCompanyMenuMenuitemImage'
]);

/*
 * Routes::companiesController
 * */
Route::get('companies/customers/{CustomerUsername}', [
		'uses' => 'companiesController@getAllCompaniesAdministrator'
]);

Route::get('companies', [
		'uses' => 'companiesController@getAllCompanies'
]);

Route::get('companies/query', [
		'uses' => 'companiesController@getByQuery'
]);

Route::get('companies/{CompanyName}', [
		'uses' => 'companiesController@getCompany'
]);

Route::post('companies/validate', [
		'uses' => 'companiesController@addCompanyValidate'
]);

Route::post('companies', [
		'uses' => 'companiesController@addCompany'
]);

Route::put('companies/{CompanyName}/validate', [
		'uses' => 'companiesController@updateCompanyValidate'
]);

Route::put('companies/{CompanyName}', [
		'uses' => 'companiesController@updateCompany'
]);

Route::delete('companies/{CompanyName}', [
		'uses' => 'companiesController@deleteCompany'
]);

/*
 * Routes::customersController
 * */

Route::get('customers/companies/{CompanyName}', [
		'uses' => 'customersController@getAllCustomersAdministrator'
]);

Route::get('customers', [
		'uses' => 'customersController@getAllCustomers'
]);

Route::get('customers/query', [
		'uses' => 'customersController@getByQuery'
]);

Route::get('customers/{CustomerUsername}', [
		'uses' => 'customersController@getCustomer'
]);

Route::post('customers/validate', [
		'uses' => 'customersController@addCustomerValidate'
]);

Route::post('customers', [
		'uses' => 'customersController@addCustomer'
]);

Route::put('customers/{CustomerUsername}/validate', [
		'uses' => 'customersController@updateCustomerValidate'
]);

Route::put('customers/{CustomerUsername}', [
		'uses' => 'customersController@updateCustomer'
]);

Route::delete('customers/{CustomerUsername}', [
		'uses' => 'customersController@deleteCustomer'
]);

/*
 * Route::branchesController
 * */
Route::get('companies/{CompanyName}/branches', [
		'uses' => 'branchesController@getAllCompanyBranches'
]);

Route::get('companies/{CompanyName}/branches/{BranchName}', [
		'uses' => 'branchesController@getCompanyBranch'
]);

Route::get('branches/query', [
		'uses' => 'branchesController@getByQuery'
]);

Route::post('companies/{CompanyName}/branches/validate', [
		'uses' => 'branchesController@addBranchValidate'	
]);

Route::post('companies/{CompanyName}/branches', [
		'uses' =>	'branchesController@addBranch'
]);

Route::put('companies/{CompanyName}/branches/{BranchName}/validate', [
		'uses' => 'branchesController@updateBranchValidate'	
]);

Route::put('companies/{CompanyName}/branches/{BranchName}', [
		'uses' => 'branchesController@updateBranch'
]);

Route::delete('companies/{CompanyName}/branches/{BranchName}', [
		'uses' => 'branchesController@deleteBranch'
]);

/*
 * Routes::menusController
 * */
Route::get('companies/{CompanyName}/menus', [
		'uses' => 'menusController@getAllCompanyMenus'
]);

Route::get('companies/{CompanyName}/menus/{MenuName}', [
		'uses' => 'menusController@getCompanyMenu'
]);

Route::get('menus/query', [
		'uses' => 'menusController@getByQuery'
]);

Route::post('companies/{CompanyName}/menus', [
		'uses' => 'menusController@addMenu'
]);

Route::put('companies/{CompanyId}/menus/{MenuName}', [
		'uses' => 'menusController@updateMenu'
]);

Route::delete('companies/{CompanyName}/menus/{MenuName}', [
		'uses' => 'menusController@deleteMenu'
]);

/*
 * Route::tablesController
 * */
Route::get('companies/{CompanyName}/branches/{BranchName}/tables', [
		'uses' => 'tablesController@getAllCompanyBranchTables'
]);

Route::get('companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}', [
		'uses' => 'tablesController@getCompanyBranchTable'
]);

Route::get('tables/query', [
		'uses' => 'tablesController@getByQuery'
]);

Route::post('companies/{CompanyName}/branches/{BranchName}/tables', [
		'uses' => 'tablesController@addTable'
]);

Route::put('companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}', [
		'uses' => 'tablesController@updateTable'
]);

Route::delete('companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}', [
		'uses' => 'tablesController@deleteTable'
]);

/*
 * Routes::menuitemsController
 * */
Route::get('companies/{CompanyName}/menus/{MenuName}/menuitems', [
		'uses' => 'menuitemsController@getAllCompanyMenuMenuitems'
]);

Route::get('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}', [
		'uses' => 'menuitemsController@getCompanyMenuMenuitem'
]);

Route::get('menuitems/query', [
		'uses' => 'menuitemsController@getByQuery'
]);

Route::post('companies/{CompanyName}/menus/{MenuName}/menuitems', [
		'uses' => 'menuitemsController@addMenuitem'
]);

Route::put('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}', [
		'uses' => 'menuitemsController@updateMenuitem'
]);

Route::delete('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}', [
		'uses' => 'menuitemsController@deleteMenuitem'
]);

/*
 * Routes: ordersController
 * */
Route::get('companies/{CompanyName}/branches/{BranchName}/orders', [
		'uses' => 'ordersController@getCompanyBranchOrders'
]);

Route::get('companies/{CompanyName}/branches/{BranchName}/orders/{OrderStatus}', [
		'uses' => 'ordersController@getCompanyBranchOrdersOrderStatus'	
]);

Route::get('companies/{CompanyName}/branches/{BranchName}/orders/not/{OrderStatus}', [
		'uses' => 'ordersController@getCompanyBranchOrdersNotOrderStatus' 
]);

Route::get('companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders', [
		'uses' => 'ordersController@getCompanyBranchTableOrders'
]);

Route::get('companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders/{OrderStatus}', [
		'uses' => 'ordersController@getCompanyBranchTableOrdersOrderStatus'
]);

Route::get('companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders/not/{OrderStatus}', [
		'uses' => 'ordersController@getCompanyBranchTableOrdersNotOrderStatus'
]);

Route::get('customers/{CustomerUsername}/orders', [
		'uses' => 'ordersController@getCustomerOrders'
]);

Route::get('customers/{CustomerUsername}/orders/{OrderStatus}', [
		'uses' => 'ordersController@getCustomerOrdersOrderStatus'
]);

Route::get('customers/{CustomerUsername}/orders/not/{OrderStatus}', [
		'uses' => 'ordersController@getCustomerOrdersNotOrderStatus'
]);

Route::get('orders/query', [
		'uses' => 'ordersController@getByQuery'
]);

Route::post('customers/{CustomerUsername}/orders', [
		'uses' => 'ordersController@addOrder'
]);

Route::put('companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders/{OrderId}', [
		'uses' => 'ordersController@updateOrder'
]);

Route::delete('companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders/{OrderId}', [
		'uses' => 'ordersController@deleteOrderCompany'
]);

Route::delete('customers/{CustomerUsername}/orders/{OrderId}', [
		'uses' => 'ordersController@deleteOrderCustomer'
]);

/**
 * Routes: customersCompaniesBranchesController
 * */
Route::get('customers-companies-branches', [
		'uses' => 'customersCompaniesBranchesController@getAllCustomersCompaniesBranches'
]);

Route::get('customers-companies-branches/{CustomerUsername}/{CompanyName}/{BranchName}', [
		'uses' => 'customersCompaniesBranchesController@getCustomerCompanyBranch'	
]);

Route::get('customers-companies-branches/query', [
		'uses' =>'customersCompaniesBranchesController@getByQuery'
]);

Route::post('customers-companies-branches', [
		'uses' => 'customersCompaniesBranchesController@addCustomerCompanyBranch'
]);

Route::delete('customers-companies-branches/{CustomerUsername}', [
		'uses' => 'customersCompaniesBranchesController@deleteCustomerCompanyBranch'	
]);

/**
 * Routes: advertisementsController
 * */
Route::get('advertisements', [
		'uses' => 'advertisementsController@getAllAdvertisements'
]);

Route::get('advertisements/{AdvertisementId}', [
		'uses' => 'advertisementsController@getAdvertisement'
]);

Route::get('companies/{CompanyName}/advertisements', [
		'uses' => 'advertisementsController@getCompanyAdvertisements'
]);

Route::get('companies/{CompanyName}/advertisements/{AdvertisementId}', [
		'uses' => 'advertisementsController@getCompanyAdvertisement'	
]);

Route::get('advertisements/query', [
		'uses' => 'advertisementsController@getByQuery'
]);

Route::post('advertisements', [
		'uses' => 'advertisementsController@addAdvertisement'
]);

Route::put('advertisements/{AdvertisementId}', [
		'uses' => 'advertisementsController@updateAdvertisement'
]);

Route::delete('advertisements/{AdvertisementId}', [
		'uses' => 'advertisementsController@deleteAdvertisement'
]);

/*
 * Routes: blogsController
 * */
Route::get('blogs', [
		'uses' => 'blogsController@getAllBlogs'
]);

Route::get('blogs/{BlogId}', [
		'uses' => 'blogsController@getBlog'
]);

Route::get('blogs/query', [
		'uses' => 'blogsController@getByQuery'
]);

Route::post('blogs', [
		'uses' => 'blogsController@addBlog'
]);

Route::put('blogs/{BlogId}', [
		'uses' => 'blogsController@updateBlog'
]);

Route::delete('blogs/{BlogId}', [
		'uses' => 'blogsController@deleteBlog'
]);

/*
 * Routes; orderreferenceController
 * */
Route::get('customers/{CustomerUsername}/orderreferences', [
		'uses' => 'orderreferencesController@getAllCustomerOrderreferences'
]);

Route::get('customers/{CustomerUsername}/orderreferences/{OrderreferenceCode}', [
		'uses' => 'orderreferencesController@getCustomerOrderreference'
]);

Route::get('orderreferences/query', [
		'uses' => 'orderreferencesController@getByQuery'
]);

Route::post('customers/{CustomerUsername}/orderreferences', [
		'uses' => 'orderreferencesController@addOrderreference'
]);

Route::put('customers/{CustomerUsername}/orderreferences/{OrderreferenceCode}', [
		'uses' => 'orderreferencesController@updateOrderreference'	
]);

Route::delete('customers/{CustomerUsername}/orderreferences/{OrderreferenceCode}', [
		'uses' => 'orderreferencesController@deleteOrderreference'
]);

/*
 * Routes; reservationsController
 * */
Route::get('customers/{CustomerUsername}/reservations', [
		'uses' => 'reservationsController@getAllCustomerReservations'
]);

Route::get('customers/{CustomerUsername}/reservations/{ReservationCode}', [
		'uses' => 'reservationsController@getCustomerReservation'
]);

Route::get('reservations/query', [
		'uses' => 'reservationsController@getByQuery'	
]);

Route::post('customers/{CustomerUsername}/reservations', [
		'uses' => 'reservationsController@addReservation'	
]);

Route::put('customers/{CustomerUsername}/reservations/{ReservationCode}', [
		'uses' => 'reservationsController@updateReservation'
]);

Route::delete('customers/{CustomerUsername}/reservations/{ReservationCode}', [
		'uses' => 'reservationsController@deleteReservation'
]);

/*
 * Routes:: orderreferencesOrdersController
 * */
Route::post('orderreferences-orders', [
		'uses' => 'orderreferencesOrdersController@addOrderreferenceOrder'
]);

/*
 * Routes:: reservationsOrderreferencesOrdersController
 * */
Route::post('reservations-orderreferences-orders', [
		'uses' => 'reservationsOrderreferencesOrdersController@addReservationOrderreferenceOrder'
]);