<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "branchesController.php";
include_once "companiesController.php";

class tablesConstants{
	const tablesTable = 'tables';
	
	const dbTableId = 'table_id';
	const dbBranchId = 'branch_id';
	const dbTableNumber = 'table_number';
	const dbTableCapacity = 'table_capacity';
	const dbTableStatus = 'table_status';
	const dbTableStatusChangeTimestamp = 'table_status_change_timestamp';
	const dbLastChangeTimestamp = 'last_change_timestamp';
	
	const reqTableId = 'TableId';
	const reqBranchId = 'BranchId';
	const reqTableNumber = 'TableNumber';
	const reqTableCapacity = 'TableCapacity';
	const reqTableStatus = 'TableStatus';
	const reqTableStatusChangeTimestamp = 'TableStatusChangeTimestamp';
	const reqLastChangeTimestamp = 'LastChangeTimestamp';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW TABLE RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING TABLE RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING TABLE RECORD';
	
	const inconsistencyValidationErr1 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME IS NON-EXISTING';
	const inconsistencyValidationErr2 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME & TABLE_NUMBER IS NON-EXISTING';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
	const carbonParseErr = 'UNPARSEABLE DATE';
}

class tablesController extends Controller
{
	public function __construct(){	//$this->middleware('jwt.auth');
	}

	public function getJoinCompanyBranchTable($mySqlWhere){
		$companyBranchTable = DB::table(tablesConstants::tablesTable)
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
		
		return $companyBranchTable;
	}

	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables
	public function getAllCompanyBranchTables(
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

		$tablesResponse = new Response();
		try{
			$companyBranchTables = $this->getJoinCompanyBranchTable($mySqlWhere);
			if($companyBranchTables->isEmpty()){	$tablesResponse->setStatusCode(
					200, 
					tablesConstants::emptyResultSetErr
					);
			} else {	$tablesResponse->setContent(json_encode($companyBranchTables));
			}
		} catch(\PDOException $e){	$tablesResponse->setStatusCode(
				400, 
				tablesConstants::dbReadCatchMsg
				);
		}
		
		return $tablesResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber} 
	public function getCompanyBranchTable(
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
				[branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
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
	
		$tablesResponse = new Response();
		try{
			$companyBranchTable = $this->getJoinCompanyBranchTable($mySqlWhere);
			if($companyBranchTable->isEmpty()){	$tablesResponse->setStatusCode(
					200, 
					tablesConstants::emptyResultSetErr
					);
			} else {	$tablesResponse->setContent(json_encode($companyBranchTable));
			}
		} catch(\PDOException $e){	$tablesResponse->setStatusCode(
				400, 
				tablesConstants::dbReadCatchMsg
				);
		}
		
		return $tablesResponse;
	}
	
	//URL-->>/tables/query
	public function getByQuery(){
		$mySqlWhere = array();

		if(isset($_GET[tablesConstants::reqTableId])){	array_push(
				$mySqlWhere, 
				[
						tablesConstants::dbTableId, 
						'=', 
						$_GET[tablesConstants::reqTableId]
				]
				);
		}
		if(isset($_GET[tablesConstants::reqTableNumber])){	array_push(
				$mySqlWhere,
				[
						tablesConstants::dbTableNumber,
						'=',
						$_GET[tablesConstants::reqTableNumber]
				]
				);
		}
		if(isset($_GET[tablesConstants::reqBranchId])){	array_push(
				$mySqlWhere, 
				[
						tablesConstants::dbBranchId, 
						'=', 
						$_GET[tablesConstants::reqBranchId]
				]
				);
		}
		if(isset($_GET[tablesConstants::reqTableCapacity])){	array_push(
				$mySqlWhere, 
				[
						tablesConstants::dbTableCapacity, 
						'=', 
						$_GET[tablesConstants::reqTableCapacity]
				]
				);
		}
		if(isset($_GET[tablesConstants::reqTableStatus])){	array_push(
				$mySqlWhere, 
				[
						tablesConstants::dbTableStatus, 
						'LIKE', 
						'%' . $_GET[tablesConstants::reqTableStatus] . '%'
				]
				);
		}
		if(isset($_GET[tablesConstants::reqTableStatusChangeTimestamp])){	array_push(
				$mySqlWhere, 
				[
						tablesConstants::dbTableStatusChangeTimestamp, 
						'LIKE', 
						'%' . $_GET[tablesConstants::reqTableStatusChangeTimestamp] . '%'
				]
				);
		}
		if(isset($_GET[tablesConstants::reqLastChangeTimestamp])){	array_push(
				$mySqlWhere, 
				[
						tablesConstants::dbLastChangeTimestamp, 
						'LIKE', 
						'%' . $_GET[tablesConstants::reqLastChangeTimestamp] . '%'
				]
				);
		}
		
		$tablesResponse = new Response();
		try{
			$tables = DB::table(tablesConstants::tablesTable)
			->where($mySqlWhere)
			->get();
			if($tables->isEmpty()){	$tablesResponse->setStatusCode(
					200, 
					tablesConstants::emptyResultSetErr
					);
			} else {	$tablesResponse->setContent(json_encode($tables));
			}
		} catch(\PDOException $e){	$tablesResponse->setStatusCode(
				400, 
				tablesConstants::dbReadCatchMsg
				);
		}
		
		return $tablesResponse;
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
							'*.' . tablesConstants::dbTableNumber => 'required|numeric', 
							'*.' . tablesConstants::dbBranchId => 'exists:branches,branch_id|numeric', 
							'*.' . tablesConstants::dbTableCapacity => 'required|numeric', 
							'*.' . tablesConstants::dbTableStatus => 'required|string|max:30', 
							'*.' . tablesConstants::dbTableStatusChangeTimestamp => 'required|date_format:Y-m-d H:i:s'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . tablesConstants::dbTableNumber => 'sometimes|numeric', 
							'*.' . tablesConstants::dbBranchId => 'exists:branches,branch_id|sometimes|numeric', 
							'*.' . tablesConstants::dbTableCapacity => 'sometimes|numeric', 
							'*.' . tablesConstants::dbTableStatus => 'sometimes|string|max:30', 
							'*.' . tablesConstants::dbTableStatusChangeTimestamp => 'sometimes|date_format:Y-m-d H:i:s', 
							'*.' . tablesConstants::dbLastChangeTimestamp => 'required|date_format:Y-m-d H:i:s'
					]
					);
		}
		
		if($jsonValidation->fails()){
			$errorMsg = $jsonValidation->messages();
			
			return false;
		} else {	return true;
		}
	}

	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/
	public function addTable(
			Request $jsonRequest, 
			$CompanyName, 
			$BranchName
			){
		$jsonData = json_decode(
				$jsonRequest->getContent(), 
				true
				);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$tablesResponse = new Response();
		$tablesResponse->setStatusCode(
				400, 
				null
				);
		$companyBranch = json_decode(
				(new branchesController())->getCompanyBranch(
						$CompanyName, 
						$BranchName
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranch) == 0){
			$tablesResponse->setStatusCode(
					400, 
					tablesConstants::inconsistencyValidationErr1
					);
			
			return $tablesResponse;
		}
		
		$branchId = $companyBranch[0][branchesConstants::dbBranchId];
	
		for($i=0; $i<$jsonDataSize; $i++){
			if(!(isset($jsonData[$i][tablesConstants::dbBranchId]))){	$jsonData[$i][tablesConstants::dbBranchId] = $branchId;
			}
		}
		
		for($i=0; $i<$jsonDataSize; $i++){
			if(isset($jsonData[$i][tablesConstants::dbTableStatusChangeTimestsamp])){
				try{	$jsonData[$i][tablesConstantss::dbTableStatusChangeTimestsamp] = Carbon::parse($jsonData[$i][tablesConstantss::dbTableStatusChangeTimestsamp])
				->format('Y-m-d H:i:s');
				} catch(\Exception $e){
					$tablesResponse->setStatusCode(
							400, 
							tablesConstants::carbonParseErr
							);
					
					return $tablesResponse;
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
				if($jsonData[$i][tablesConstants::dbBranchId] == $branchId){
					try{		DB::table(tablesConstants::tablesTable)
					->insert($jsonData[$i]);
					} catch(\PDOException $e){	$tablesResponse->setStatusCode(
							400, 
							tablesConstants::dbAddCatchMsg
							);
					
						return $tablesResponse;
					}
				}
			}
		} else {
			$tablesResponse->setStatusCode(
					400, 
					$errorMsg
					);
			
			return $tablesResponse;
		}
		
		return tablesConstants::dbAddSuccessMsg;
	}

	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}
	public function updateTable(
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
		$mySqlWhere = array();
		$errorMsg = '';
	
		$tablesResponse = new Response();
		$tablesResponse->setStatusCode(
				400, 
				null
				);
		if(isset($jsonData[0][tablesConstants::dbTableStatusChangeTimestamp])){
			try{	$jsonData[0][tablesConstants::dbTableStatusChangeTimestamp] = Carbon::parse($jsonData[0][tablesConstants::dbTableStatusChangeTimestamp])
				->format('Y-m-d H:i:s');
			} catch(\Exception $e){
				$tablesResponse->setStatusCode(
						400, 
						tablesConstants::carbonParseErr
						);
				
				return $tablesResponse;
			}
		}
		if(isset($jsonData[0][tablesConstants::dbLastChangeTimestamp])){
			try{	$jsonData[0][tablesConstants::dbLastChangeTimestamp] = Carbon::parse($jsonData[0][tablesConstants::dbLastChangeTimestamp])
			->format('Y-m-d H:i:s');
			} catch(\Exception $e){
				$tablesResponse->setStatusCode(
						400, 
						tablesConstants::carbonParseErr
						);
				
				return tablesConstants::carbonParseErr;
			}
		}
		
		$companyBranchTable = json_decode(
				$this->getCompanyBranchTable(
						$CompanyName, 
						$BranchName, 
						$TableNumber
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTable) == 0){
			$tablesResponse->setStatusCode(
					400, 
					tablesConstants::inconsistencyValidationErr2
					);
			
			return $tablesResponse;
		}
		
		$tableId = $companyBranchTable[0][tablesConstants::dbTableId];
	
		if(!$this->isDataValid(
				$jsonData, 
				$errorMsg, 
				"UPDATE"
				)
				){
			$tablesResponse->setStatusCode(
					400, 
					$errorMsg
					);
			
			return $tablesResponse;
		}
	
		try{
			array_push(
					$mySqlWhere, 
					[
							tablesConstants::dbTableId, 
							'=', 
							$tableId
					]
					);
			DB::table(tablesConstants::tablesTable)
			->where($mySqlWhere)
			->update($jsonData[0]);
		} catch(\PDOException $e){
			$tablesResponse->setStatusCode(
					400, 
					tablesConstants::dbUpdateCatchMsg
					);
			
			return $tablesResponse;
		}
		
		return tablesConstants::dbUpdateSuccessMsg;
	}

	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}
	public function deleteTable(
			$CompanyName, 
			$BranchName, 
			$TableNumber
			){
		$mySqlWhere = array();
		$errorMsg = '';
	
		$tablesResponse = new Response();
		$tablesResponse->setStatusCode(
				400, 
				null
				);
		$companyBranchTable = json_decode(
				$this->getCompanyBranchTable(
						$CompanyName, 
						$BranchName, 
						$TableNumber
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTable) == 0){
			$tablesResponse->setStatusCode(
					400, 
					tablesConstants::inconsistencyValidationErr2
					);
			
			return $tablesResponse;
		}
		$tableId = $companyBranchTable[0][tablesConstants::dbTableId];
	
		try{
			array_push(
					$mySqlWhere, 
					[
							tablesConstants::dbTableId, 
							'=', 
							$tableId
					]
					);
			DB::table(tablesConstants::tablesTable)
			->where($mySqlWhere)
			->delete();
		} catch(\PDOException $e){
			$tablesResponse->setStatusCode(
					400, 
					tablesConstants::dbDeleteCatchMsg
					);
			
			return $tablesResponse;
		}
		
		return tablesConstants::dbDeleteSuccessMsg;
	}
}