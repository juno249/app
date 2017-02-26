<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "branchesController.php";
include_once "companiesController.php";
include_once "customersController.php";
include_once "menuitemsController.php";
include_once "tablesController.php";

class ordersConstants{
	const ordersTable = 'orders';
	/*
	 * CONSTANTS w/c signify the column_name in orders table
	 * */
	const dbOrderId = 'order_id';
	const dbCustomerUsername = 'customer_username';
	const dbMenuitemId = 'menuitem_id';
	const dbTableId = 'table_id';
	const dbOrderTimestamp = 'order_timestamp';
	const dbOrderStatus = 'order_status';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqOrderId = 'OrderId';
	const reqCustomerUsername = 'CustomerUsername';
	const reqMenuitemId = 'MenuitemId';
	const reqTableId = 'TableId';
	const reqOrderTimestamp = 'OrderTimestamp';
	const reqOrderStatus = 'OrderStatus';
	/*
	 * CONSTANTS w/c signify the messages returned on failed DB operation
	 * */
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on successful DB operation
	 * */
	const dbAddSuccessMsg = 'DB UPDATED W/NEW ORDER RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING ORDER RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING ORDER RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const inconsistencyValidationErr1 = 'MENUITEM OWNER & TABLEID OWNER DO NOT MATCH';
	const inconsistencyValidationErr2 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME & TABLE_NUMBER & ORDER_ID IS NON-EXISTING';
	const inconsistencyValidationErr3 = 'KEY-COMBINATION CUSTOMER_USERNAME & ORDER_ID IS NON-EXISTING';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class ordersController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to ordersController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth');
	}

	/**
	 * getJoinCompanyBranchTableOrders: joins companies_table & branches_table & tables_table & orders_table w/a variable $mySqlWhere
	 * */
	public function getJoinCompanyBranchTableOrders($mySqlWhere){
		$companyBranchTableOrder = DB::table(ordersConstants::ordersTable)
		->join(
				tablesConstants::tablesTable,
				ordersConstants::ordersTable . '.' . ordersConstants::dbTableId,
				'=',
				tablesConstants::tablesTable . '.' . tablesConstants::dbTableId
				)
				->join(
						branchesConstants::branchesTable,
						tablesConstants::tablesTable . '.' . tablesConstants::dbBranchId,
						'=',
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchId
						)
						->join(
								companiesConstants::companiesTable,
								branchesConstants::branchesTable . '.' . branchesConstants::dbCompanyName,
								'=',
								companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName
								)
								->where($mySqlWhere)
								->get();
								return $companyBranchTableOrder;
	}

	/**
	 * getJoinCompanyMenuMenuitemOrders: joins companies_table & menus_table & menuitems_table & orders_table w/a variable $mySqlWhere
	 * */
	public function getJoinCompanyMenuMenuitemOrders($mySqlWhere){
		$companyMenuMenuitemOrder = DB::table(ordersConstants::ordersTable)
		->join(
				menuitemsConstants::menuitemsTable,
				ordersConstants::ordersTable . '.' . ordersConstants::dbMenuitemId,
				'=',
				menuitemsConstants::menuitemsTable . '.' . menuitemsConstants::dbMenuitemId
				)
				->join(
						menusConstants::menusTable,
						menuitemsConstants::menuitemsTable . '.' . menuitemsConstants::dbMenuId,
						'=',
						menusConstants::menusTable . '.' . menusConstants::dbMenuId
						)
						->join(
								companiesConstants::companiesTable,
								menusConstants::menusTable . '.' . menusConstants::dbCompanyName,
								'=',
								companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName
								)
								->where($mySqlWhere)
								->get();
								return $companyMenuMenuitemOrder;
	}

	/**
	 * getJoinCustomerOrders: joins customers_table & orders_table w/a variable $mySqlWhere
	 * */
	public function getJoinCustomerOrders($mySqlWhere){
		$customerOrder = DB::table(ordersConstants::ordersTable)
		->join(
				customersConstants::customersTable,
				ordersConstants::ordersTable . '.' . ordersConstants::dbCustomerUsername,
				'=',
				customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername
				)
				->where($mySqlWhere)
				->get();
				return $customerOrder;
	}

	/**
	 * GET method getCompanyBranchOrders
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/orders
	 **/
	public function getCompanyBranchOrders($CompanyName, $BranchName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);

		$ordersResponse = new Response();
		try{
			$companyBranchOrders = $this->getJoinCompanyBranchTableOrders($mySqlWhere);
			if($companyBranchOrders->isEmpty()){
				$ordersResponse->setStatusCode(400, ordersConstants::emptyResultSetErr);
			} else {
				$ordersResponse->setContent(json_encode($companyBranchOrders));
			}
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(400, ordersConstants::dbReadCatchMsg);
		}
		return $ordersResponse;
	}
	
	/**
	 * GET method getCompanyBranchOrdersOrderStatus
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/orders/{OrderStatus}
	 **/
	public function getCompanyBranchOrdersOrderStatus($CompanyName, $BranchName, $OrderStatus){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);
		array_push($mySqlWhere, [ordersConstants::ordersTable . '.' . ordersConstants::dbOrderStatus, '=', $OrderStatus]);
		
		$ordersResponse = new Response();
		try{
			$companyBranchOrders = $this->getJoinCompanyBranchTableOrders($mySqlWhere);
			if($companyBranchOrders->isEmpty()){
				$ordersResponse->setStatusCode(400, ordersConstants::emptyResultSetErr);
			} else {
				$ordersResponse->setContent(json_encode($companyBranchOrders));
			}
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(400, ordersConstants::dbReadCatchMsg);
		}
		return $ordersResponse;
	}

	/**
	 * GET method getCompanyBranchTableOrders
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders
	 **/
	public function getCompanyBranchTableOrders($CompanyName, $BranchName, $TableNumber){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);
		array_push($mySqlWhere, [tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, '=', $TableNumber]);
	
		$ordersResponse = new Response();
		try{
			$companyBranchTableOrders = $this->getJoinCompanyBranchTableOrders($mySqlWhere);
			if($companyBranchTableOrders->isEmpty()){
				$ordersResponse->setStatusCode(400, ordersConstants::emptyResultSetErr);
			} else {
				$ordersResponse->setContent(json_encode($companyBranchTableOrders));
			} 
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(400, ordersConstants::dbReadCatchMsg);
		}
		return $ordersResponse;
	}
	
	/**
	 * GET method getCustomerOrders
	 * URL-->/customers/{CustomerUsername}/orders
	 **/
	public function getCustomerOrders($CustomerUsername){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
	
		$ordersResponse = new Response();
		try{
			$customerOrders = $this->getJoinCustomerOrders($mySqlWhere);
			if($customerOrders->isEmpty()){
				$ordersResponse->setStatusCode(400, ordersConstants::emptyResultSetErr);
			} else {
				$ordersResponse->setContent(json_encode($customerOrders));
			}
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(400, ordersConstants::dbReadCatchMsg);
		}
		return $ordersResponse;
	}
	
	/**
	 * GET method getCustomerOrdersWIP
	 * URL-->/customers/{CustomerUsername}/orders/WIP
	 **/
	public function getCustomerOrdersWIP($CustomerUsername){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
		array_push($mySqlWhere, [ordersConstants::ordersTable . '.' . ordersConstants::dbOrderStatus, '!=', 'statusHistory']);
		
		$ordersResponse = new Response();
		try{
			$customerOrdersWIP = $this->getJoinCustomerOrders($mySqlWhere);
			if($customerOrdersWIP->isEmpty()){
				$ordersResponse->setStatusCode(400, ordersConstants::emptyResultSetErr);
			} else {
				$ordersResponse->setContent(json_encode($customerOrdersWIP));
			}
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(400, ordersConstants::dbReadCatchMsg);
		}
		return $ordersResponse;
	}

	/**
	 * GET method getByQuery
	 * URL-->/orders/query
	 **/
	public function getByQuery(){
		$mySqlWhere = array();

		if(isset($_GET[ordersConstants::reqOrderId])){
			array_push($mySqlWhere, [ordersConstants::dbOrderId, '=', $_GET[ordersConstants::reqOrderId]]);
		}
		if(isset($_GET[ordersConstants::reqCustomerUsername])){
			array_push($mySqlWhere, [ordersConstants::dbCustomerUsername, 'LIKE', '%' . $_GET[ordersConstants::reqCustomerUsername] . '%']);
		}
		if(isset($_GET[ordersConstants::reqMenuitemId])){
			array_push($mySqlWhere, [ordersConstants::dbMenuitemId, '=', $_GET[ordersConstants::reqMenuitemId]]);
		}
		if(isset($_GET[ordersConstants::reqTableId])){
			array_push($mySqlWhere, [ordersConstants::dbTableId, '=', $_GET[ordersConstants::reqTableId]]);
		}
		if(isset($_GET[ordersConstants::reqOrderTimestamp])){
			array_push($mySqlWhere, [ordersConstants::dbOrderTimestamp, 'LIKE', '%' . $_GET[ordersConstants::reqOrderTimestamp] . '%']);
		}
		if(isset($_GET[ordersConstants::reqOrderStatus])){
			array_push($mySqlWhere, [ordersConstants::dbOrderStatus, 'LIKE', '%' . $_GET[ordersConstants::reqOrderStatus] . '%']);
		}
		
		$ordersResponse = new Response();
		try{
			$orders = DB::table(ordersConstants::ordersTable)->where($mySqlWhere)->get();
			if($orders->isEmpty()){
				$ordersResponse->setStatusCode(400, ordersConstants::emptyResultSetErr);
			} else {
				$ordersResponse->setContent(json_encode($orders));
			}
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(400, ordersConstants::dbReadCatchMsg);
		}
		return $ordersResponse;
	}

	/**
	 * Do basic Laravel validation
	 * */
	private function isDataValid(Request $jsonRequest, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonRequest->all(),
					[
							'*.' . ordersConstants::dbCustomerUsername => 'exists:customers,customer_username|required|string|max:30',
							'*.' . ordersConstants::dbMenuitemId => 'exists:menuitems,menuitem_id|required|numeric',
							'*.' . ordersConstants::dbTableId => 'exists:tables,table_id|required|numeric',
							'*.' . ordersConstants::dbOrderStatus => 'required|string|max:30',
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonRequest->all(),
					[
							'*.' . ordersConstants::dbCustomerUsername => 'exists:customers,customer_username|sometimes|string|max:30',
							'*.' . ordersConstants::dbMenuitemId => 'exists:menuitems,menuitem_id|sometimes|numeric',
							'*.' . ordersConstants::dbTableId => 'exists:tables,table_id|sometimes|numeric',
							'*.' . ordersConstants::dbOrderStatus => 'sometimes|string|max:30',
					]
					);
		}
		if($jsonValidation->fails()){
			$errorMsg = $jsonValidation->messages();
			return false;
		} else {
			return true;
		}
	}

	/**
	 * POST method addOrder
	 * URL-->/customers/{CustomerUsername}/orders
	 **/
	public function addOrder(Request $jsonRequest, $CustomerUsername){
		$jsonData = ((array)json_decode($jsonRequest->getContent()));
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere_1 = array();
		$mySqlWhere_2 = array();
		$errorMsg = '';
	
		$ordersResponse = new Response();
		$ordersResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonRequest, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				$menuitemId = $jsonData[$i]->menuitem_id;
				$tableId = $jsonData[$i]->table_id;
				$mySqlWhere_1 = array();
				$mySqlWhere_2 = array();
	
				array_push($mySqlWhere_1, [menuitemsConstants::menuitemsTable . '.' . menuitemsConstants::dbMenuitemId, '=', $menuitemId]);
				$companyName_1 = (new menuitemsController())->getJoinCompanyMenuMenuitems($mySqlWhere_1)[0]->company_name;
				array_push($mySqlWhere_2, [tablesConstants::tablesTable . '.' . tablesConstants::dbTableId, '=', $tableId]);
				$companyName_2 = (new tablesController())->getJoinCompanyBranchTable($mySqlWhere_2)[0]->company_name;
	
				if(!($companyName_1 == $companyName_2)){
					$ordersResponse->setStatusCode(400, ordersConstants::inconsistencyValidationErr1);
					return $ordersResponse;
				}
	
				try{		DB::table(ordersConstants::ordersTable)->insert((array)$jsonData[$i]);
				} catch(\PDOException $e){
					$ordersResponse->setStatusCode(400, ordersConstants::dbAddCatchMsg);
					return $ordersResponse;
				}
			}
		} else {
			$ordersResponse->setStatusCode(400, $errorMsg);
			return $ordersResponse;
		}
		return ordersConstants::dbAddSuccessMsg;
	}

	/**
	 * POST method updateOrder
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders/{OrderId}
	 **/
	public function updateOrder(Request $jsonRequest, $CompanyName, $BranchName, $TableNumber, $OrderId){
		$jsonData = ((array)json_decode($jsonRequest->getContent()));
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
	
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);
		array_push($mySqlWhere, [tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, '=', $TableNumber]);
		array_push($mySqlWhere, [ordersConstants::ordersTable . '.' . ordersConstants::dbOrderId, '=', $OrderId]);
	
		$ordersResponse = new Response();
		$ordersResponse->setStatusCode(400, null);
		$companyBranchTableOrder = (array)json_decode($this->getJoinCompanyBranchTableOrders($mySqlWhere));
		if(sizeof($companyBranchTableOrder) == 0){
			$ordersResponse->setStatusCode(400, ordersConstants::inconsistencyValidationErr2);
			return $ordersResponse;
		}
	
		if(!($this->isDataValid($jsonRequest, $errorMsg, "UPDATE"))){
			$ordersResponse->setStatusCode(400, $errorMsg);
			return $ordersResponse;
		}
	
		try{
			$mySqlWhere = array();
			array_push($mySqlWhere, [ordersConstants::ordersTable . '.' . ordersConstants::dbOrderId, '=', $OrderId]);
			DB::table(ordersConstants::ordersTable)->where($mySqlWhere)->update((array)$jsonData[0]);
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(400, ordersConstants::dbUpdateCatchMsg);
			return $ordersResponse;
		}
		return ordersConstants::dbUpdateSuccessMsg;
	}

	/**
	 * POST method deleteOrderCompanyDirective
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders/{OrderId}
	 **/
	public function deleteOrderCompanyDirective($CompanyName, $BranchName, $TableNumber, $OrderId){
		$mySqlWhere = array();
		$errorMsg = '';
	
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);
		array_push($mySqlWhere, [tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, '=', $TableNumber]);
		array_push($mySqlWhere, [ordersConstants::ordersTable . '.' . ordersConstants::dbOrderId, '=', $OrderId]);
	
		$ordersResponse = new Response();
		$ordersResponse->setStatusCode(400, null);
		$companyBranchTableOrder = (array)json_decode($this->getJoinCompanyBranchTableOrders($mySqlWhere));
		if(sizeof($companyBranchTableOrder) == 0){
			$ordersResponse->setStatusCode(400, ordersConstants::inconsistencyValidationErr2);
			return $ordersResponse;
		}
	
		try{
			$mySqlWhere = array();
			array_push($mySqlWhere, [ordersConstants::ordersTable . '.' . ordersConstants::dbOrderId, '=', $OrderId]);
			DB::table(ordersConstants::ordersTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(400, ordersConstants::dbDeleteCatchMsg);
			return $ordersResponse;
		}
		return ordersConstants::dbDeleteSuccessMsg;
	}

	/**
	 * POST method deleteOrderCustomerDirective
	 * URL-->/customers/{CustomerUsername}/orders/{OrderId}
	 **/
	public function deleteOrderCustomerDirective($CustomerUsername, $OrderId){
		$mySqlWhere = array();
		$errorMsg = '';
	
		array_push($mySqlWhere, [customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
		array_push($mySqlWhere, [ordersConstants::ordersTable . '.' . ordersConstants::dbOrderId, '=', $OrderId]);
	
		$ordersResponse = new Response();
		$ordersResponse->setStatusCode(400, null);
		$customerOrder = (array)json_decode($this->getJoinCustomerOrders($mySqlWhere));
		if(sizeof($customerOrder) == 0){
			$ordersResponse->setStatusCode(400, ordersConstants::inconsistencyValidationErr3);
			return $ordersResponse;
		}
	
		try{
			$mySqlWhere = array();
			array_push($mySqlWhere, [ordersConstants::ordersTable . '.' . ordersConstants::dbOrderId, '=', $OrderId]);
			DB::table(ordersConstants::ordersTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(400, ordersConstants::dbDeleteCatchMsg);
			return $ordersResponse;
		}
		return ordersConstants::dbDeleteSuccessMsg;
	}
}
