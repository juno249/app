<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "companiesController.php";
include_once "branchesController.php";

class tablesConstants{
	const tablesTable = 'tables';
	/*
	 * CONSTANTS w/c signify the column_name in tables table
	 * */
	const dbTableId = 'table_id';
	const dbBranchId = 'branch_id';
	const dbTableNumber = 'table_number';
	const dbTableCapacity = 'table_capacity';
	const dbTableStatus = 'table_status';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqTableId = 'TableId';
	const reqBranchId = 'BranchId';
	const reqTableNumber = 'TableNumber';
	const reqTableCapacity = 'TableCapacity';
	const reqTableStatus = 'TableStatus';
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
	const dbAddSuccessMsg = 'DB UPDATED W/NEW TABLE RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING TABLE RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING TABLE RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const inconsistencyValidationErr1 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME IS NON-EXISTING';
	const inconsistencyValidationErr2 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME & TABLE_NUMBER IS NON-EXISTING';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class tablesController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to tablesController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth');
	}

	/**
	 * getJoinCompanyBranchTable: joins companies_table & branches_table & tables_table w/a variable $mySqlWhere
	 * */
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

	/**
	 * GET method getAllCompanyBranchTables
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/tables
	 **/
	public function getAllCompanyBranchTables($CompanyName, $BranchName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);

		$tablesResponse = new Response();
		try{
			$companyBranchTables = $this->getJoinCompanyBranchTable($mySqlWhere);
			if($companyBranchTables->isEmpty()){
				$tablesResponse->setStatusCode(400, tablesConstants::emptyResultSetErr);
			} else {
				$tablesResponse->setContent(json_encode($companyBranchTables));
			}
		} catch(\PDOException $e){
			$tablesResponse->setStatusCode(400, tablesConstants::dbReadCatchMsg);
		}
		return $tablesResponse;
	}

	/**
	 * GET method getCompanyBranchTable
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}
	 **/
	public function getCompanyBranchTable($CompanyName, $BranchName, $TableNumber){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);
		array_push($mySqlWhere, [tablesConstants::tablesTable . '.' . tablesConstants::dbTableNumber, '=', $TableNumber]);
	
		$tablesResponse = new Response();
		try{
			$companyBranchTable = $this->getJoinCompanyBranchTable($mySqlWhere);
			if($companyBranchTable->isEmpty()){
				$tablesResponse->setStatusCode(400, tablesConstants::emptyResultSetErr);
			} else {
				$tablesResponse->setContent(json_encode($companyBranchTable));
			}
		} catch(\PDOException $e){
			$tablesResponse->setStatusCode(400, tablesConstants::dbReadCatchMsg);
		}
		return $tablesResponse;
	}

	/**
	 * GET method getByQuery
	 * URL-->/tables/query
	 **/
	public function getByQuery(){
		$mySqlWhere = array();

		if(isset($_GET[tablesConstants::reqTableId])){
			array_push($mySqlWhere, [tablesConstants::dbTableId, '=', $_GET[tablesConstants::reqTableId]]);
		}
		if(isset($_GET[tablesConstants::reqBranchId])){
			array_push($mySqlWhere, [tablesConstants::dbBranchId, '=', $_GET[tablesConstants::reqBranchId]]);
		}
		if(isset($_GET[tablesConstants::reqTableNumber])){
			array_push($mySqlWhere, [tablesConstants::dbTableNumber, '=', $_GET[tablesConstants::reqTableNumber]]);
		}
		if(isset($_GET[tablesConstants::reqTableCapacity])){
			array_push($mySqlWhere, [tablesConstants::dbTableCapacity, '=', $_GET[tablesConstants::reqTableCapacity]]);
		}
		if(isset($_GET[tablesConstants::reqTableStatus])){
			array_push($mySqlWhere, [tablesConstants::dbTableStatus, 'LIKE', '%' . $_GET[tablesConstants::reqTableStatus] . '%']);
		}
		
		$tablesResponse = new Response();
		try{
			$tables = DB::table(tablesConstants::tablesTable)->where($mySqlWhere)->get();
			if($tables->isEmpty()){
				$tablesResponse->setStatusCode(400, tablesConstants::emptyResultSetErr);
			} else {
				$tablesResponse->setContent(json_encode($tables));
			}
		} catch(\PDOException $e){
			$tablesResponse->setStatusCode(400, tablesConstants::dbReadCatchMsg);
		}
		return $tablesResponse;
	}

	/**
	 * Do basic Laravel validation
	 * */
	private function isDataValid(Request $jsonRequest, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonRequest->all(),
					[
							'*.' . tablesConstants::dbTableNumber => 'required|numeric',
							'*.' . tablesConstants::dbBranchId => 'exists:branches,branch_id|numeric',
							'*.' . tablesConstants::dbTableCapacity => 'required|numeric',
							'*.' . tablesConstants::dbTableStatus => 'required|string|max:30'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonRequest->all(),
					[
							'*.' . tablesConstants::dbTableNumber => 'sometimes|numeric',
							'*.' . tablesConstants::dbBranchId => 'exists:branches,branch_id|sometimes|numeric',
							'*.' . tablesConstants::dbTableCapacity => 'sometimes|numeric',
							'*.' . tablesConstants::dbTableStatus => 'sometimes|string|max:30'
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
	 * POST method addTable
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/tables/
	 **/
	public function addTable(Request $jsonRequest, $CompanyName, $BranchName){
		$jsonData = ((array)json_decode($jsonRequest->getContent()));
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$tablesResponse = new Response();
		$tablesResponse->setStatusCode(400, null);
		$companyBranch = (array)json_decode((new branchesController())->getCompanyBranch($CompanyName, $BranchName)->getContent());
		if(sizeof($companyBranch) == 0){
			$tablesResponse->setStatusCode(400, tablesConstants::inconsistencyValidationErr1);
			return $tablesResponse;
		}
		$branchId = $companyBranch[0]->branch_id;
		
		for($i=0; $i<$jsonDataSize; $i++){
			if(!(isset($jsonData[$i]->branch_id))){
				$jsonData[$i]->branch_id = $branchId;
			}
		}
		
		if($this->isDataValid($jsonRequest, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				if($jsonData[$i]->branch_id == $branchId){
					try{		DB::table(tablesConstants::tablesTable)->insert((array)$jsonData[$i]);
					} catch(\PDOException $e){
						$tablesResponse->setStatusCode(400, tablesConstants::dbAddCatchMsg);
						return $tablesResponse;
					}
				}
			}
		} else {
			$tablesResponse->setStatusCode(400, $errorMsg);
			return $tablesResponse;
		}
		return tablesConstants::dbAddSuccessMsg;
	}

	/**
	 * PUT method updateTable
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}
	 **/
	public function updateTable(Request $jsonRequest, $CompanyName, $BranchName, $TableNumber){
		$jsonData = ((array)json_decode($jsonRequest->getContent()));
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
	
		$tablesResponse = new Response();
		$tablesResponse->setStatusCode(400, null);
		$companyBranchTable = (array)json_decode($this->getCompanyBranchTable($CompanyName, $BranchName, $TableNumber)->getContent());
		if(sizeof($companyBranchTable) == 0){
			$tablesResponse->setStatusCode(400, tablesConstants::inconsistencyValidationErr2);
			return $tablesResponse;
		}
		$tableId = $companyBranchTable[0]->table_id;
	
		if(!$this->isDataValid($jsonRequest, $errorMsg, "UPDATE")){
			$tablesResponse->setStatusCode(400, $errorMsg);
			return $tablesResponse;
		}
	
		try{
			array_push($mySqlWhere, [tablesConstants::dbTableId, '=', $tableId]);
			DB::table(tablesConstants::tablesTable)->where($mySqlWhere)->update((array)$jsonData[0]);
		} catch(\PDOException $e){
			$tablesResponse->setStatusCode(400, tablesConstants::dbUpdateCatchMsg);
			return $tablesResponse;
		}
		return tablesConstants::dbUpdateSuccessMsg;
	}

	/**
	 * DELETE method deleteTable
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}
	 **/
	public function deleteTable($CompanyName, $BranchName, $TableNumber){
		$mySqlWhere = array();
		$errorMsg = '';
	
		$tablesResponse = new Response();
		$tablesResponse->setStatusCode(400, null);
		$companyBranchTable = (array)json_decode($this->getCompanyBranchTable($CompanyName, $BranchName, $TableNumber)->getContent());
		if(sizeof($companyBranchTable) == 0){
			$tablesResponse->setStatusCode(400, tablesConstants::inconsistencyValidationErr2);
			return $tablesResponse;
		}
		$tableId = $companyBranchTable[0]->table_id;
	
		try{
			array_push($mySqlWhere, [tablesConstants::dbTableId, '=', $tableId]);
			DB::table(tablesConstants::tablesTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$tablesResponse->setStatusCode(400, tablesConstants::dbDeleteCatchMsg);
			return $tablesResponse;
		}
		return tablesConstants::dbDeleteSuccessMsg;
	}
}
