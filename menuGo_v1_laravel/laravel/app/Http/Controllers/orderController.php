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
include_once "orderreferencesController.php";

class ordersConstants{
	const ordersTable = 'orders';
	
	const dbOrderId = 'order_id';
	const dbMenuitemId = 'menuitem_id';
	const dbOrderreferenceCode = 'orderreference_code';
	const dbOrderStatus = 'order_status';
	const dbOrderStatusChangeTimestamp = 'order_status_change_timestamp';
	const dbLastChangeTimestamp = 'last_change_timestamp';
	
	const reqOrderId = 'OrderId';
	const reqMenuitemId = 'MenuitemId';
	const reqOrderreferenceCode = 'OrderreferenceCode';
	const reqOrderStatus = 'OrderStatus';
	const reqOrderStatusChangeTimestamp = 'OrderStatusChangeTimestamp';
	const reqLastChangeTimestamp = 'LastChangeTimestamp';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW ORDER RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING ORDER RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING ORDER RECORD';
	
	const inconsistencyValidationErr1 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME & TABLE_NUMBER & ORDERREFERENCE_CODE IS NON-EXISTING';
	const inconsistencyValidationErr2 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME & TABLE_NUMBER & ORDERREFERENCE_CODE & ORDER IS NON-EXISTING';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
	const carbonParseErr = 'UNPARSEABLE DATE';
}

class ordersController extends Controller
{
	public function __construct(){	//$this->middleware('jwt.auth');
	}
	
	public function getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere){
		$companyBranchTableOrderreferenceOrders = DB::table(ordersConstants::ordersTable)
		->join(
				orderreferencesConstants::orderreferencesTable, 
				ordersConstants::ordersTable . '.' . ordersConstants::dbOrderreferenceCode, 
				'=', 
				orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceCode
				)
				->join(
						tablesConstants::tablesTable, 
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbTableId, 
						'=', 
						tablesConstants::tablesTable . '.' . tablesConstants::dbTableId
						)
						->join(
								branchesConstants::branchesTable, 
								tablesConstants::ordersTable . '.' . tablesConstants::dbBranchId, 
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
		
		return $companyBranchTableOrderreferenceOrders;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/orders
	public function getCompanyBranchOrders(
			$CompanyName, 
			$BranchName
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchOrders = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchOrders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchOrders));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/orders/{OrderId}
	public function getCompanyBranchOrder(
			$CompanyName, 
			$BranchName, 
			$OrderId
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						ordersConstants::ordersTable . '.' . ordersConstants::dbOrderId, 
						'=', 
						$OrderId
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchOrder = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchOrder->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchOrder));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/orders/{OrderStatus}
	public function getCompanyBranchOrdersOrderStatus(
			$CompanyName, 
			$BranchName, 
			$OrderStatus
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						ordersConstants::ordersTable . '.' . ordersConstants::dbOrderStatus, 
						'=', 
						$OrderStatus
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchOrders = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchOrders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchOrders));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/orders/not/{OrderStatus}
	public function getCompanyBranchOrdersNotOrderStatus(
			$CompanyName, 
			$BranchName, 
			$OrderStatus
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						ordersConstants::ordersTable . '.' . ordersConstants::dbOrderStatus, 
						'!=', 
						$OrderStatus
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchOrders = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchOrders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchOrders));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders
	public function getCompanyBranchTableOrders(
			$CompanyName, 
			$BranchName, 
			$TableNumber
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, 
						'=', 
						$TableNumber
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchTableOrders = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchTableOrders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchTableOrders));
			}
		} catch(\PDOException  $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders/{OrderId}
	public function getCompanyBranchTableOrder(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderId
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, 
						'=', 
						$TableNumber
				]
				);
		array_push(
				$mySqlWhere, 
				[
						ordersConstants::ordersTable . '.' . ordersConstants::dbOrderId, 
						'=', 
						$OrderId
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchTableOrder = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchTableOrder->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchTableOrder));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders/{OrderStatus}
	public function getCompanyBranchTableOrdersOrderStatus(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderStatus
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, 
						'=', 
						$TableNumber
				]
				);
		array_push(
				$mySqlWhere, 
				[
						ordersConstants::ordersTable . '.' . ordersConstants::dbOrderStatus, 
						'=', 
						$OrderStatus
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchTableOrders = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchTableOrders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchTableOrders));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orders/not/{OrderStatus}
	public function getCompanyBranchTableOrdersNotOrderStatus(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderStatus
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, 
						'=', 
						$TableNumber
				]
				);
		array_push(
				$mySqlWhere, 
				[
						ordersConstants::ordersTable . '.' . ordersConstants::dbOrderStatus, 
						'!=', 
						$OrderStatus
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchTableOrders = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchTableOrders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchTableOrders));
			}
		} catch(\PDOException  $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/orders
	public function getCompanyBranchTableOrderreferenceOrders(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, 
						'=', 
						$TableNumber
				]
				);
		array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceCode, 
						'=', 
						$OrderreferenceCode
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchTableOrderreferenceOrders = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchTableOrderreferenceOrders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchTableOrderreferenceOrders));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/orders/{OrderId}
	public function getCompanyBranchTableOrderreferenceOrder(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode, 
			$OrderId
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, 
						'=', 
						$TableNumber
				]
				);
		array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceCode, 
						'=', 
						$OrderreferenceCode
				]
				);
		array_push(
				$mySqlWhere, 
				[
						ordersConstants::ordersTable . '.' . ordersConstants::dbOrderId, 
						'=', 
						$OrderId
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchTableOrderreferenceOrder = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchTableOrderreferenceOrder->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchTableOrderreferenceOrder));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/orders/{OrderStatus}
	public function getCompanyBranchTableOrderreferenceOrdersOrderStatus(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode, 
			$OrderStatus
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, 
						'=', 
						$TableNumber
				]
				);
		array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceCode, 
						'=', 
						$OrderreferenceCode
				]
				);
		array_push(
				$mySqlWhere, 
				[
						ordersConstants::ordersTable . '.' . ordersConstants::dbOrderStatus, 
						'=', 
						$OrderStatus
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchTableOrderreferenceOrders = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchTableOrderreferenceOrders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($companyBranchTableOrderreferenceOrders));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/orders/not/{OrderStatus}
	public function getCompanyBranchTableOrderreferenceOrdersNotOrderStatus(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode, 
			$OrderStatus
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, 
						'=', 
						$TableNumber
				]
				);
		array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceCode, 
						'=', 
						$OrderreferenceCode
				]
				);
		array_push(
				$mySqlWhere, 
				[
						ordersConstants::ordersTable . '.' . ordersConstants::dbOrderStatus, 
						'!=', 
						$OrderStatus
				]
				);
		
		$ordersResponse = new Response();
		try{
			$companyBranchTableOrderreferenceOrders = $this->getJoinCompanyBranchTableOrderreferenceOrder($mySqlWhere);
			if($companyBranchTableOrderreferenceOrders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($ordersResponse));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/orderreferences/query
	public function getByQuery(){
		$mySqlWhere = array();
		
		if(isset($_GET[ordersConstants::reqOrderId])){	array_push(
				$mySqlWhere, 
				[
						ordersConstants::dbOrderId, 
						'=', 
						$_GET[ordersConstants::reqOrderId]
				]
				);
		}
		if(isset($_GET[ordersConstants::reqMenuitemId])){	array_push(
				$mySqlWhere, 
				[
						ordersConstants::dbMenuitemId, 
						'=', 
						$_GET[ordersConstants::reqMenuitemId]
				]
				);
		}
		if(isset($_GET[ordersConstants::reqOrderreferenceCode])){	array_push(
				$mySqlWhere, 
				[
						ordersConstants::dbOrderreferenceCode, 
						'LIKE', 
						'%' . $_GET[ordersConstants::reqOrderreferenceCode] . '%'
				]
				);
		}
		if(isset($_GET[ordersConstants::reqOrderStatus])){	array_push(
				$mySqlWhere, 
				[
						ordersConstants::dbOrderStatus, 
						'LIKE', 
						'%' . $_GET[ordersConstants::reqOrderStatus] . '%'
				]
				);
		}
		if(isset($_GET[ordersConstants::reqOrderStatusChangeTimestamp])){	array_push(
				$mySqlWhere, 
				[
						ordersConstants::dbOrderStatusChangeTimestamp, 
						'LIKE', 
						'%' . $_GET[ordersConstants::reqOrderStatusChangeTimestamp] . '%'
				]
				);
		}
		if(isset($_GET[ordersConstants::reqLastChangeTimestamp])){	array_push(
				$mySqlWhere, 
				[
						ordersConstants::dbLastChangeTimestamp, 
						'LIKE', 
						'%' . $_GET[ordersConstants::reqLastChangeTimestamp] . '%'
				]
				);
		}
		
		$ordersResponse = new Response();
		try{
			$orders = DB::table(ordersConstants::ordersTable)
			->where($mySqlWhere)
			->get();
			if($orders->isEmpty()){	$ordersResponse->setStatusCode(
					200, 
					ordersConstants::emptyResultSetErr
					);
			} else {	$ordersResponse->setContent(json_encode($orders));
			}
		} catch(\PDOException $e){	$ordersResponse->setStatusCode(
				400, 
				ordersConstants::dbReadCatchMsg
				);
		}
		
		return $ordersResponse;
	}
	
	private function isDataValid(
			$jsonData, 
			&$errorMsg, 
			$dbOperation
			){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . ordersConstants::dbMenuitemId => 'exists:menuitems,menuitem_id|required|numeric', 
							'*.' . ordersConstants::dbOrderreferenceCode => 'exists::orderreferences,orderreference_code|required|string|max:40', 
							'*.' . ordersConstants::dbOrderStatus => 'required|string|max:30', 
							'*.' . ordersConstants::dbOrderStatusChangeTimestamp => 'required|date_format:Y-m-d H:i:s'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . ordersConstants::dbMenuitemId => 'exists:menuitems,menuitem_id|sometimes|numeric', 
							'*.' . ordersConstants::dbOrderreferenceCode => 'exists::orderreferences,orderreference_code|sometimes|string|max:40', 
							'*.' . ordersConstants::dbOrderStatus => 'sometimes|string|max:30', 
							'*.' . ordersConstants::dbOrderStatusChangeTimestamp => 'sometimes|date_format:Y-m-d H:i:s', 
							'*.' . ordersConstants::dbLastChangeTimestamp => 'required|date_format:Y-m-d H:i:s'
					]
					);
		}
		
		if($jsonValidation->fails()){
			$errorMsg = $jsonValidation->messages();
			
			return false;
		} else {	return true;
		}
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/orders
	public function addOrder(
			Request $jsonRequest, 
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode
			){
		$jsonData = json_decode(
				$jsonRequest->getContent(), 
				true
				);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
		
		$ordersResponse = new Response();
		$ordersResponse->setStatusCode(
				400, 
				null
				);
		$companyBranchTableOrderreference = json_decode(
				(new orderreferencesConroller())->getCompanyBranchTableOrderreference(
						$CompanyName, 
						$BranchName, 
						$TableNumber, 
						$OrderreferenceCode
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTableOrderreference == 0)){
			$ordersResponse->setStatusCode(
					400, 
					ordersConstants::inconsistencyValidationErr1
					);
			
			return $ordersResponse;
		}
		
		$orderreferenceCode = $companyBranchTableOrderreference[0][ordersConstants::dbOrderreferenceCode];
		
		for($i=0; $i<$jsonData; $i++){
			if(!(isset($jsonData[$i][ordersConstants::dbOrderreferenceCode]))){	$jsonData[$i][ordersConstants::dbOrderreferenceCode] = $orderreferenceCode;
			}
		}
		
		for($i=0; $i<$jsonData; $i++){
			if(isset($jsonData[$i][ordersConstants::dbOrderStatusChangeTimestamp])){
				try{	$jsonData[$i][ordersConstants::dbOrderStatusChangeTimestamp] = Carbon::parse($jsonData[$i][ordersConstants::dbOrderStatusChangeTimestamp])
				->format('Y-m-d H:i:s');
				} catch(\Exception $e){
					$ordersResponse->setStatusCode(
							400, 
							orderreferencesConstants::carbonParseErr
							);
					
					return $ordersResponse;
				}
			}
		}
		
		if($this->isDataValid(
				$jsonData, 
				$errorMsg, 
				"ADD"
				)
				){
			for($i=0; $i<$jsonDataSize; $i++){
				if($jsonData[$i][ordersConstants::dbOrderreferenceCode] == $orderreferenceCode){
					try{	DB::table(ordersConstants::ordersTable)
					->insert($jsonData[$i]);
					} catch(\PDOException $e){
						$ordersResponse->setStatusCode(
								400, 
								ordersConstants::dbAddCatchMsg
								);
						
						return $ordersResponse;
					}
				}
			}
		} else {
			$ordersResponse->setStatusCode(
					400, 
					$errorMsg
					);
			
			return $ordersResponse;
		}
		
		return ordersConstants::dbAddSuccessMsg;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/orders/{OrderId}
	public function updateOrder(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$Orderreference, 
			$OrderId
			){
		$jsonData = json_decode(
				$jsonRequest->getContent(), 
				true
				);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
		
		$ordersResponse = new Response();
		$ordersResponse->setStatusCode(
				400, 
				null
				);
		if(isset($jsonData[0][ordersConstants::dbOrderStatusChangeTimestamp])){
			try{	$jsonData[0][ordersConstants::dbOrderStatusChangeTimestamp] = Carbon::parse($jsonData[0][ordersConstants::dbOrderStatusChangeTimestamp])
			->format('Y-m-d H:i:s');
			} catch(\Exception $e){
				$ordersResponse->setStatusCode(
						400, 
						ordersConstants::carbonParseErr
						);
				
				return $ordersResponse;
			}
		}
		if(isset($jsonData[0][ordersConstants::dbLastChangeTimestamp])){
			try{	$jsonData[0][ordersConstants::dbLastChangeTimeStamp] = Carbon::parse($jsonData[0][ordersConstants::dbLastChangeTimeStamp])
			->format('Y-m-d H:i:s');
			} catch(\Exception $e){
				$ordersResponse->setStatusCode(
						400, 
						ordersConstants::carbonParseErr
						);
				
				return $ordersResponse;
			}
		}
		
		$companyBranchTableOrderreferenceOrder = json_decode(
				$this->getCompanyBranchTableOrderreferenceOrder(
						$CompanyName, 
						$BranchName, 
						$TableNumber, 
						$Orderreference, 
						$OrderId
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTableOrderreferenceOrder) == 0){
			$ordersResponse->setStatusCode(
					400, 
					ordersConstants::inconsistencyValidationErr2
					);
			
			return $ordersResponse;
		}
		
		$orderId = $companyBranchTableOrderreferenceOrder[0][ordersConstants::dbOrderId];
		
		try{
			array_push(
					$mySqlWhere, 
					[
							ordersConstants::dbOrderId, 
							'=', 
							$orderId
					]
					);
			DB::table(ordersConstants::ordersTable)
			->where($mySqlWhere)
			->update($jsonData[0]);
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(
					400, 
					ordersConstants::dbUpdateCatchMsg
					);
			
			return $ordersResponse;
		}
		
		return $ordersResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/orders/{OrderId}
	public function deleteOrder(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode, 
			$OrderId
			){
		$mySqlWhere = array();
		$errorMsg = '';
		
		$ordersResponse = new Response();
		$ordersResponse->setStatusCode(
				400, 
				null
				);
		$companyBranchTableOrderreferenceOrder = json_decode(
				$this->getCompanyBranchTableOrderreferenceOrder(
						$CompanyName, 
						$BranchName, 
						$TableNumber, 
						$OrderreferenceCode, 
						$OrderId
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTableOrderreferenceOrder) == 0){
			$ordersResponse->setStatusCode(
					200, 
					ordersConstants::inconsistencyValidationErr2
					);
			
			return $ordersResponse;
		}
		
		$orderId = $companyBranchTableOrderreferenceOrder[0][ordersConstants::dbOrderId];
		
		try{
			array_push(
					$mySqlWhere, 
					[
							ordersConstants::dbOrderId, 
							'=', 
							$orderId
					]
					);
			DB::table(ordersConstants::ordersTable)
			->where($mySqlWhere)
			->delete();
		} catch(\PDOException $e){
			$ordersResponse->setStatusCode(
					400, 
					ordersConstants::dbDeleteCatchMsg
					);
			
			return $ordersResponse;
		}
		
		return $ordersResponse;
	}
}