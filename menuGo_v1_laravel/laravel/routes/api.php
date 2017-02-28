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

Route::get('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemName}/menuitemImage', [
		'uses' => 'filesController@getCompanyMenuMenuitemImage'
]);

Route::post('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemName}/menuitemImage', [
		'uses' => 'filesController@uploadCompanyMenuMenuitemImage'
]);

Route::delete('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemName}/menuitemImage', [
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

Route::post('companies', [
		'uses' => 'companiesController@addCompany'
]);

Route::post('companies/validate', [
		'uses' => 'companiesController@addCompanyValidate'
]);

Route::put('companies/{CompanyName}', [
		'uses' => 'companiesController@updateCompany'
]);

Route::put('companies/{CompanyName}/validate', [
		'uses' => 'companiesController@updateCompanyValidate'
]);

Route::delete('companies/{CompanyName}', [
		'uses' => 'companiesController@deleteCompany'
]);

/*
 * Route::branchesController
 * */
Route::get('companies/{CompanyName}/branches', [
		'uses' => 'branchesController@getAllCompanyBranches'
]);

Route::get('branches/query', [
		'uses' => 'branchesController@getByQuery'
]);

Route::get('companies/{CompanyName}/branches/{BranchName}', [
		'uses' => 'branchesController@getCompanyBranch'
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

Route::get('menus/query', [
		'uses' => 'menusController@getByQuery'
]);

Route::get('companies/{CompanyName}/menus/{MenuName}', [
		'uses' => 'menusController@getCompanyMenu'
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
 * Routes::customersController
 * */

Route::get('customers/companies/{CompanyName}', [
		'uses' => 'customersController@getAllCustomersAdmin'	
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

Route::post('customers', [
		'uses' => 'customersController@addCustomer'
]);

Route::post('customers/validate', [
		'uses' => 'customersController@addCustomerValidate'	
]);

Route::put('customers/{CustomerUsername}', [
		'uses' => 'customersController@updateCustomer'
]);

Route::put('customers/{CustomerUsername}/validate', [
		'uses' => 'customersController@updateCustomerValidate'	
]);

Route::delete('customers/{CustomerUsername}', [
		'uses' => 'customersController@deleteCustomer'
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

Route::get('menuitems/query', [
		'uses' => 'menuitemsController@getByQuery'
]);

Route::get('companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}', [
		'uses' => 'menuitemsController@getCompanyMenuMenuitem'
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

Route::get('companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders', [
		'uses' => 'ordersController@getCompanyBranchTableOrders'
]);

Route::get('customers/{CustomerUsername}/orders', [
		'uses' => 'ordersController@getCustomerOrders'
]);

Route::get('customers/{CustomerUsername}/orders/WIP', [
		'uses' => 'ordersController@getCustomerOrdersWIP'
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
		'uses' => 'ordersController@deleteOrderCompanyDirective'
]);

Route::delete('customers/{CustomerUsername}/orders/{OrderId}', [
		'uses' => 'ordersController@deleteOrderCustomerDirective'
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

Route::post('customers-companies-branches-transaction', [
		'uses' => 'customersCompaniesBranchesController@addCustomerCompanyBranchTransaction'
]);

Route::put('customers-companies-branches/{CustomerUsername}/{CompanyName}/{BranchName}', [
		'uses' => 'customersCompaniesBranchesController@updateCustomerCompanyBranch'
]);

Route::delete('customers-companies-branches/{CustomerUsername}/{CompanyName}/{BranchName}', [
		'uses' => 'customersCompaniesBranchesController@deleteCustomerCompanyBranch'
]);