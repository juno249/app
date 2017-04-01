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

class orderreferencesConstants{
	const orderreferencesTable = 'orderreferences';
	
	const dbOrderreferenceCode = 'orderreference_code';
	const dbCustomerUsername = 'customer_username';
	const dbTableId = 'table_id';
	const dbOrderreferenceStatus = 'orderreference_status';
	const dbOrderreferenceStatusChangeTimestamp = 'orderreference_status_change_timestamp';
	const dbLastChangeTimestamp = 'last_change_timestamp';
	
	const reqOrderreferenceCode = 'OrderreferenceCode';
	const reqCustomerUsername = 'CustomerUsername';
	const reqTableId = 'TableId';
	const reqOrderreferenceStatus = 'OrderreferenceStatus';
	const reqOrderreferenceStatusChangeTimestamp = 'OrderreferenceStatusChangeTimestamp';
	const reqLastChangeTimestamp = 'LastChangeTimestamp';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW ORDER REFERENCE RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING ORDER REFERENCE RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING ORDER REFERENCE RECORD';
	
	const inconsistencyValidationErr1 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME & TABLE_NUMBER IS NON-EXISTING';
	const inconsistencyValidationErr2 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME & TABLE_NUMBER & ORDERREFERENCE_CODE IS NON-EXISTING';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class orderreferencesController extends Controller
{
	public function __construct(){	//$this->middleware('jwt.auth');
	}
	
	public function getJoinCompanyBranchTableOrderreferences($mySqlWhere){
		$companyBranchTableOrderreference = DB::table(orderreferencesConstants::orderreferencesTable)
		->join(
				tablesConstants::tablesTable, 
				orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbTableId, 
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
		
		return $companyBranchTableOrderreference;
	}
	
	public function getJoinCustomerOrderreferences($mySqlWhere){
		$customerOrderreference = DB::table(orderreferencesConstants::orderreferencesTable)
		->join(
				customersConstants::customersTable, 
				orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbCustomerUsername, 
				'=', 
				customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername
				)
				->where($mySqlWhere)
		->get();
		
		return $customerOrderreference;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/orderreferences
	public function getCompanyBranchOrderreferences(
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
		
		$orderreferencesResponse = new Response();
		try{
			$companyBranchOrderreferences = $this->getJoinCompanyBranchTableOrderreferences($mySqlWhere);
			if($companyBranchOrderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($companyBranchOrderreferences));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/orderreferences/{OrderreferenceCode}
	public function getCompanyBranchOrderreference(
			$CompanyName, 
			$BranchName, 
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
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceCode, 
						'=', 
						$OrderreferenceCode
				]
				);
		
		$orderreferencesResponse = new Response();
		try{
			$companyBranchOrderreference = $this->getJoinCompanyBranchTableOrderreferences($mySqlWhere);
			if($companyBranchOrderreference->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($companyBranchOrderreference));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/orderreferences/{OrderreferenceStatus}
	public function getCompanyBranchOrderreferencesOrderreferenceStatus(
			$CompanyName, 
			$BranchName, 
			$OrderreferenceStatus
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
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceStatus, 
						'=', 
						$OrderreferenceStatus
				]
				);
		
		$orderreferencesResponse = new Response();
		try{
			$companyBranchOrderreferences = $this->getJoinCompanyBranchTableOrderreferences($mySqlWhere);
			if($companyBranchOrderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($companyBranchOrderreferences));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/orderreferences/not/{OrderreferenceStatus}
	public function getCompanyBranchOrderreferencesNotOrderreferenceStatus(
			$CompanyName, 
			$BranchName, 
			$OrderreferenceStatus
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
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceStatus, 
						'!=', 
						$OrderreferenceStatus
				]
				);
		
		$orderreferencesResponse = new Response();
		try{
			$companyBranchOrderreferences = $this->getJoinCompanyBranchTableOrderreferences($mySqlWhere);
			if($companyBranchOrderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($companyBranchOrderreferences));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				200, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences
	public function getCompanyBranchTableOrderreferences(
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
		
		$orderreferencesResponse = new Response();
		try{
			$companyBranchTableOrderreferences = $this->getJoinCompanyBranchTableOrderreferences($mySqlWhere);
			if($companyBranchTableOrderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($companyBranchTableOrderreferences));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}
	public function getCompanyBranchTableOrderreference(
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
		
		$orderreferencesResponse = new Response();
		try{
			$companyBranchTableOrderreference = $this->getJoinCompanyBranchTableOrderreferences($mySqlWhere);
			if($companyBranchTableOrderreference->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$companyBranchTableOrderreference->setContent(json_encode($companyBranchTableOrderreference));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceStatus}
	public function getCompanyBranchTableOrderreferencesOrderreferenceStatus(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceStatus
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
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceStatus, 
						'=', 
						$OrderreferenceStatus
				]
				);
		
		$orderreferencesResponse = new Response();
		try{
			$companyBranchTableOrderreferences = $this->getJoinCompanyBranchTableOrderreferences($mySqlWhere);
			if($companyBranchTableOrderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($companyBranchTableOrderreferences));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/not/{OrderreferenceStatus}
	public function getCompanyBranchTableOrderreferencesNotOrderreferenceStatus(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceStatus
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
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceStatus, 
						'!=', 
						$OrderreferenceStatus
				]
				);
		
		$orderreferencesResponse = new Response();
		try{
			$companyBranchTableOrderreferences = $this->getJoinCompanyBranchTableOrderreferences($mySqlWhere);
			if($companyBranchTableOrderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($companyBranchTableOrderreferences));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/customers/{CustomerUsername}/orderreferences
	public function getCustomerOrderreferences($CustomerUsername){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, 
						'=', 
						$CustomerUsername
				]
				);
		
		$orderreferencesResponse = new Response();
		try{
			$customerOrderreferences = $this->getJoinCustomerOrderreferences($mySqlWhere);
			if($customerOrderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($customerOrderreferences));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/customers/{CustomerUsername}/orderreferences/{OrderreferenceCode}
	public function getCustomerOrderreference(
			$CustomerUsername, 
			$OrderreferenceCode
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, 
						'=', 
						$CustomerUsername
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
		
		$orderreferencesResponse = new Response();
		try{
			$customerOrderreference = $this->getJoinCustomerOrderreferences($mySqlWhere);
			if($customerOrderreference->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($customerOrderreference));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/customers/{CustomerUsername}/orderreferences/{OrderreferenceStatus}
	public function getCustomerOrderreferencesOrderreferenceStatus(
			$CustomerUsername, 
			$OrderreferenceStatus
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, 
						'=', 
						$CustomerUsername
				]
				);
		array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceStatus, 
						'=', 
						$OrderreferenceStatus
				]
				);
		
		$orderreferencesResponse = new Response();
		try{
			$customerOrderreferences = $this->getJoinCustomerOrderreferences($mySqlWhere);
			if($customerOrderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($customerOrderreferences));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/customers/{CustomerUsername}/orderreferences/not/{OrderreferenceStatus}
	public function getCustomerOrderreferencesNotOrderreferenceStatus(
			$CustomerUsername, 
			$OrderreferenceStatus
			){
		$mySqlWhere = array();
		array_push(
				$mySqlWhere, 
				[
						customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, 
						'=', 
						$CustomerUsername
				]
				);
		array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceStatus, 
						'!=', 
						$OrderreferenceStatus
				]
				);
		
		$orderreferencesResponse = new Response();
		try{
			$customerOrderreferences = $this->getJoinCustomerOrderreferences($mySqlWhere);
			if($customerOrderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($customerOrderreferences));
			}
		} catch(\PDOException  $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/orderreferences/query
	public function getByQuery(){
		$mySqlWhere = array();
		
		if(isset($_GET[orderreferencesConstants::reqOrderreferenceCode])){	array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::dbOrderreferenceCode, 
						'LIKE', 
						'%' . $_GET[orderreferencesConstants::reqOrderreferenceCode] . '%'
				]
				);
		}
		if(isset($_GET[orderreferencesConstants::reqCustomerUsername])){	array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::dbCustomerUsername, 
						'LIKE', 
						'%' . $_GET[orderreferencesConstants::reqCustomerUsername] . '%'
				]
				);
		}
		if(isset($_GET[orderreferencesConstants::reqTableId])){	array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::dbTableId, 
						'=', 
						$_GET[orderreferencesConstants::reqTableId]
				]
				);
		}
		if(isset($_GET[orderreferencesConstants::reqOrderreferenceStatus])){	array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::dbOrderreferenceStatus, 
						'LIKE', 
						'%' . $_GET[orderreferencesConstants::reqOrderreferenceStatus] . '%'
						
				]
				);
		}
		if(isset($_GET[orderreferencesConstants::reqOrderreferenceStatusChangeTimestamp])){	array_push(
				$mySqlWhere, 
				[
						orderreferencesConstants::dbOrderreferenceStatusChangeTimestamp, 
						'LIKE', 
						'%' . $_GET[orderreferencesConstants::reqOrderreferenceStatusChangeTimestamp] . '%'
				]
				);
		}
		if(isset($_GET[orderreferencesConstants::reqLastChangeTimestamp])){
			array_push(
					$mySqlWhere, 
					[
							orderreferencesConstants::dbLastChangeTimestamp, 
							'LIKE', 
							'%' . $_GET[orderreferencesConstants::reqLastChangeTimestamp] . '%'
					]
					);
		}
		
		$orderreferencesResponse = new Response();
		try{
			$orderreferences = DB::table(orderreferencesConstants::orderreferencesTable)
			->where($mySqlWhere)
			->get();
			if($orderreferences->isEmpty()){	$orderreferencesResponse->setStatusCode(
					200, 
					orderreferencesConstants::emptyResultSetErr
					);
			} else {	$orderreferencesResponse->setContent(json_encode($orderreferences));
			}
		} catch(\PDOException $e){	$orderreferencesResponse->setStatusCode(
				400, 
				orderreferencesConstants::dbReadCatchMsg
				);
		}
		
		return $orderreferencesResponse;
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
							'*.' . orderreferencesConstants::dbOrderreferenceCode => 'unique:orderreferences,orderreference_code|required|string|max:40', 
							'*.' . orderreferencesConstants::dbCustomerUsername => 'exists:customers,customer_username|required|string|max:30', 
							'*.' . orderreferencesConstants::dbTableId => 'exists:tables,table_id|required|numeric', 
							'*.' . orderreferencesConstants::dbOrderreferenceStatus => 'required|string|max:30', 
							'*.' . orderreferencesConstants::dbOrderreferenceStatusChangeTimestamp => 'required|date_format:Y-m-d H:i:s'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . orderreferencesConstants::dbOrderreferenceCode => 'unique:orderreferences,orderreferenc_code|sometimes|string|max:40', 
							'*.' . orderreferencesConstants::dbCustomerUsername => 'exists:customers,customer_username|sometimes|string|max:30', 
							'*.' . orderreferencesConstants::dbTableId => 'exists:tables,table_id|sometimes|numeric', 
							'*.' . orderreferencesConstants::dbOrderreferenceStatus => 'sometimes|string|max:30', 
							'*.' . orderreferencesConstants::dbOrderreferenceStatusChangeTimestamp => 'sometimes|date_format:Y-m-d H:i:s', 
							'*.' . orderreferencesConstants::dbLastChangeTimestamp => 'required|date_format:Y-m-d H:i:s'
					]
					);
		}
		
		if($jsonValidation->fails()){
			$errorMsg = $jsonValidation->messages();
			
			return false;
		} else {	return true;
		}
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences
	public function addOrderreference(
			Request $jsonRequest, 
			$CompanyName, 
			$BranchName, 
			$TableNumber
			){
		$jsonData = json_decode(
				$jsonRequest->getContent(), 
				true
				);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
		
		$orderreferencesResponse = new Response();
		$orderreferencesResponse->setStatusCode(
				400, 
				null
				);
		$companyBranchTable = json_decode(
				(new tablesController())->getCompanyBranchTable(
						$CompanyName, 
						$BranchName, 
						$TableNumber
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTable) == 0){
			$orderreferencesResponse->setStatusCode(
					400, 
					orderreferencesConstants::inconsistencyValidationErr1
					);
			
			return $orderreferencesResponse;
		}
		
		$tableId = $companyBranchTable[0][tablesConstants::dbTableId];
		
		for($i=0; $i<$jsonDataSize; $i++){
			if(!(isset(jsonData[$i][orderreferencesConstants::dbTableId]))){	$jsonData[$i][orderreferencesConstants::dbTableId] = $tableId;
			}
		}
		
		if($this->isDataValid(
				$jsonData, 
				$errorMsg, 
				"ADD"
				)
				){
			for($i=0; $i<$jsonDataSize; $i++){
				if($jsonData[$i][orderreferencesConstants::dbTableId] == $tableId){
					try{	DB::table(orderreferencesConstants::orderreferencesTable)
						->insert($jsonData[$i]);
					} catch(\PDOException $e){
						$orderreferencesResponse->setStatusCode(
								400, 
								orderreferencesConstants::dbAddCatchMsg
								);
						
						return $orderreferencesResponse;
					}
				}
			}
		} else {
			$orderreferencesResponse->setStatusCode(
					400, 
					$errorMsg
					);
			
			return $orderreferencesResponse;
		}
		
		return orderreferencesConstants::dbAddSuccessMsg;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}
	public function updateOrderreference(
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
		$mySqlWhere = array();
		$errorMsg = '';
		
		$orderreferencesResponse = new Response();
		$orderreferencesResponse->setStatusCode(
				400, 
				null
				);
		$companyBranchTableOrderreference = json_decode(
				$this-getCompanyBranchTableOrderreference(
						$CompanyName, 
						$BranchName, 
						$TableNumber, 
						$OrderreferenceCode
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTableOrderreference) == 0){
			$orderreferencesResponse->setStatusCode(
					400, 
					orderreferencesConstants::inconsistencyValidationErr2
					);
			
			return $orderreferencesResponse;
		}
		
		$orderreferenceCode = $companyBranchTableOrderreference[orderreferencesConstants::dbOrderreferenceCode];
		
		if(!$this->isDataValid(
				$jsonData, 
				$errorMsg, 
				"UPDATE"
				)
				){
			$orderreferencesResponse->setStatusCode(
					400, 
					$errorMsg
					);
			
			return $orderreferencesResponse;
		}
		
		try{
			array_push(
					$mySqlWhere, 
					[
							orderreferencesConstants::dbOrderreferenceCode, 
							'=', 
							$orderreferenceCode
					]
					);
			DB::table(orderreferencesConstants::orderreferencesTable)
			->where($mySqlWhere)
			->update($jsonData[0]);
		} catch(\PDOException $e){
			$orderreferencesResponse->setStatusCode(
					400, 
					orderreferencesConstants::dbUpdateCatchMsg
					);
			
			return $orderreferencesResponse;
		}
		
		return $orderreferencesResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}
	public function deleteOrderreference(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode
			){
		$mySqlWhere = array();
		$errorMsg = '';
		
		$orderreferencesResponse = new Response();
		$orderreferencesResponse->setStatusCode(
				400, 
				null
				);
		$companyBranchTableOrderreference = json_decode(
				$this->getCompanyBranchTableOrderreference(
						$CompanyName, 
						$BranchName, 
						$TableNumber, 
						$OrderreferenceCode
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTableOrderreference) == 0){
			$orderreferencesResponse->setStatusCode(
					400, 
					orderreferencesConstants::inconsistencyValidationErr2
					);
			
			return $orderreferencesResponse;
		}
		
		$orderreferenceCode = $companyBranchTableOrderreference[0][orderreferencesConstants::dbOrderreferenceCode];
		
		try{
			array_push(
					$mySqlWhere, 
					[
							orderreferencesConstants::dbOrderreferenceCode, 
							'=', 
							$orderreferenceCode
					]
					);
			DB::table(orderreferencesConstants::orderreferencesTable)
			->where($mySqlWhere)
			->delete();
		} catch(\PDOException $e){
			$orderreferencesResponse->setStatusCode(
					400, 
					orderreferencesConstants::dbDeleteCatchMsg
					);
			
			return $orderreferencesResponse;
		}
		
		return $orderreferencesResponse;
	}
}