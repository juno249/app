<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "companiesController.php";

class branchesConstants{
	const branchesTable = 'branches';
	/*
	 * CONSTANTS w/c signify the column_name in branches table
	 * */
	const dbBranchId = 'branch_id';
	const dbBranchName = 'branch_name';
	const dbCompanyName = 'company_name';
	const dbBranchAddressHouseBuilding = 'branch_address_house_building';
	const dbBranchAddressStreet = 'branch_address_street';
	const dbBranchAddressDistrict = 'branch_address_district';
	const dbBranchAddressCity = 'branch_address_city';
	const dbBranchAddressPostalcode = 'branch_address_postalcode';
	const dbBranchAddressCountry = 'branch_address_country';
	const dbBranchHotline = 'branch_hotline';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqBranchId = 'BranchId';
	const reqBranchName = 'BranchName';
	const reqCompanyName = 'CompanyName';
	const reqBranchAddressHouseBuilding = 'BranchAddressHouseBuilding';
	const reqBranchAddressStreet = 'BranchAddressStreet';
	const reqBranchAddressDistrict = 'BranchAddressDistrict';
	const reqBranchAddressCity = 'BranchAddressCity';
	const reqBranchAddressPostalcode = 'BranchAddressPostalcode';
	const reqBranchAddressCountry = 'BranchAddressCountry';
	const reqBranchHotline = 'BranchHotline';
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
	const dbAddSuccessMsg = 'DB UPDATED W/NEW BRANCH RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING BRANCH RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING BRANCH RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on validation
	 * */
	const dbAddValidateSuccessMsg = 'DATA IS VALID FOR DB ADD OPERATION';
	const dbUpdateValidateSuccessMsg = 'DATA IS VALID FOR DB UPDATE OPERATION';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class branchesController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to branchesController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth');
	}

	/**
	 * getJoinCompanyBranch: joins companies_table & branches_table w/a variable $mySqlWhere
	 * */
	public function getJoinCompanyBranch($mySqlWhere){
		$companyBranch = DB::table(branchesConstants::branchesTable)
		->join(
				companiesConstants::companiesTable,
				branchesConstants::branchesTable . '.' . branchesConstants::dbCompanyName,
				'=',
				companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName
				)
				->where($mySqlWhere)
				->get();
				return $companyBranch;
	}

	/**
	 * GET method getAllCompanyBranches
	 * URL-->/companies/{CompanyName}/branches
	 **/
	public function getAllCompanyBranches($CompanyName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);

		$branchesResponse = new Response();
		try{
			$companyBranches = $this->getJoinCompanyBranch($mySqlWhere);
			if($companyBranches->isEmpty()){
				$branchesResponse->setStatusCode(200, branchesConstants::emptyResultSetErr);
			} else {
				$branchesResponse->setContent(json_encode($companyBranches));
			}
		} catch(\PDOException $e){
			$branchesResponse->setStatusCode(400, branchesConstants::dbReadCatchMsg);
		}
		return $branchesResponse;
	}

	/**
	 * GET method getCompanyBranch
	 * URL-->/companies/{CompanyName}/branches/{BranchName}
	 **/
	public function getCompanyBranch($CompanyName, $BranchName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);

		$branchesResponse = new Response();
		try{
			$companyBranch = $this->getJoinCompanyBranch($mySqlWhere);
			if($companyBranch->isEmpty()){
				$branchesResponse->setStatusCode(200, branchesConstants::emptyResultSetErr);
			} else {
				$branchesResponse->setContent(json_encode($companyBranch));
			}
		} catch(\PDOException $e){
			$branchesResponse.setStatusCode(400, branchesConstants::dbReadCatchMsg);
		}
		return $branchesResponse;
	}

	/**
	 * GET method getByQuery
	 * URL-->/branches/query
	 **/
	public function getByQuery(){
		$mySqlWhere = array();

		if(isset($_GET[branchesConstants::reqBranchId])){
			array_push($mySqlWhere, [branchesConstants::dbBranchId, '=', $_GET[branchesConstants::reqBranchId]]);
		}
		if(isset($_GET[branchesConstants::reqBranchName])){
			array_push($mySqlWhere, [branchesConstants::dbBranchName, 'LIKE', '%' . $_GET[branchesConstants::reqBranchName] . '%']);
		}
		if(isset($_GET[branchesConstants::reqCompanyName])){
			array_push($mySqlWhere, [branchesConstants::dbCompanyName, 'LIKE', '%' . $_GET[branchesConstants::reqCompanyName] . '%']);
		}
		if(isset($_GET[branchesConstants::reqBranchAddressHouseBuilding])){
			array_push($mySqlWhere, [branchesConstants::dbBranchAddressHouseBuilding, 'LIKE', '%' . $_GET[branchesConstants::reqBranchAddressHouseBuilding] . '%']);
		}
		if(isset($_GET[branchesConstants::reqBranchAddressStreet])){
			array_push($mySqlWhere, [branchesConstants::dbBranchAddressStreet, 'LIKE', '%' . $_GET[branchesConstants::reqBranchAddressStreet] . '%']);
		}
		if(isset($_GET[branchesConstants::reqBranchAddressDistrict])){
			array_push($mySqlWhere, [branchesConstants::dbBranchAddressDistrict, 'LIKE', '%' . $_GET[branchesConstants::reqBranchAddressDistrict] . '%']);
		}
		if(isset($_GET[branchesConstants::reqBranchAddressCity])){
			array_push($mySqlWhere, [branchesConstants::dbBranchAddressCity, 'LIKE', '%' . $_GET[branchesConstants::reqBranchAddressCity] . '%']);
		}
		if(isset($_GET[branchesConstants::reqBranchAddressPostalcode])){
			array_push($mySqlWhere, [branchesConstants::dbBranchAddressPostalcode, 'LIKE', '%' . $_GET[branchesConstants::reqBranchAddressPostalcode] . '%']);
		}
		if(isset($_GET[branchesConstants::reqBranchAddressCountry])){
			array_push($mySqlWhere, [branchesConstants::dbBranchAddressCountry, 'LIKE', '%' . $_GET[branchesConstants::reqBranchAddressCountry] . '%']);
		}
		if(isset($_GET[branchesConstants::reqBranchHotline])){
			array_push($mySqlWhere, [branchesConstants::dbBranchHotline, 'LIKE', '%' . $_GET[branchesConstants::reqBranchHotline] . '%']);
		}

		$branchesResponse = new Response();
		try{
			$companyBranches  = DB::table(branchesConstants::branchesTable)->where($mySqlWhere)->get();
			if($companyBranches->isEmpty()){
				$branchesResponse->setStatusCode(200, branchesConstants::emptyResultSetErr);
			} else {
				$branchesResponse->setContent(json_encode($companyBranches));
			}
		} catch(\PDOException $e){
			$branchesResponse.setStatusCode(400, branchesConstants::dbReadCatchMsg);
		}
		return $branchesResponse;
	}

	/**
	 * Do basic Laravel validation
	 * */
	public function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . branchesConstants::dbBranchName => 'required|string|max:30',
							'*.' . branchesConstants::dbCompanyName => 'exists:companies,company_name|required|string|max:30',
							'*.' . branchesConstants::dbBranchAddressHouseBuilding => 'required|string|max:30',
							'*.' . branchesConstants::dbBranchAddressStreet => 'required|string|max:30',
							'*.' . branchesConstants::dbBranchAddressDistrict => 'required|string|max:30',
							'*.' . branchesConstants::dbBranchAddressCity => 'required|string|max:30',
							'*.' . branchesConstants::dbBranchAddressPostalcode => 'required|string|max:30',
							'*.' . branchesConstants::dbBranchAddressCountry => 'required|string|max:30',
							'*.' . branchesConstants::dbBranchHotline => 'required|string|max:10'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . branchesConstants::dbBranchName => 'sometimes|string|max:30',
							'*.' . branchesConstants::dbCompanyName => 'exists:companies,company_name|sometimes|string|max:30',
							'*.' . branchesConstants::dbBranchAddressHouseBuilding => 'sometimes|string|max:30',
							'*.' . branchesConstants::dbBranchAddressStreet => 'sometimes|string|max:30',
							'*.' . branchesConstants::dbBranchAddressDistrict => 'sometimes|string|max:30',
							'*.' . branchesConstants::dbBranchAddressCity => 'sometimes|string|max:30',
							'*.' . branchesConstants::dbBranchAddressPostalcode => 'sometimes|string|max:30',
							'*.' . branchesConstants::dbBranchAddressCountry => 'sometimes|string|max:30',
							'*.' . branchesConstants::dbBranchHotline => 'sometimes|string|max:10'
					]
					);
		}
		if($jsonValidation->fails()){
			$errorMsg .=  $jsonValidation->messages();
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * POST method addBranchValidate
	 * URL-->/companies/{CompanyName}/branches/validate
	 **/
	public function addBranchValidate(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$branchesResponse = new Response();
		$branchesResponse->setStatusCodee(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			return branchesConstants::dbAddValidateSuccessMsg;
		} else {
			$branchesResponse->setStatusCode(400, $errorMsg);
			return $branchesResponse;
		}
	}
	
	/**
	 * POST method addBranch
	 * URL-->/companies/{CompanyName}/branches
	 **/
	public function addBranch(Request $jsonRequest, $CompanyName){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$branchesResponse = new Response();
		$branchesResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				if($jsonData[$i]['company_name'] == $CompanyName){
					try{		DB::table(branchesConstants::branchesTable)->insert($jsonData[$i]);
					} catch(\PDOException $e){
						$branchesResponse->setStatusCode(400, branchesConstants::dbAddCatchMsg);
						return $branchesResponse;
					}
				}
			}
		} else {
			$branchesResponse->setStatusCode(400, $errorMsg);
			return $branchesResponse;
		}
		return branchesConstants::dbAddSuccessMsg;
	}

	/**
	 * POST method updateBranchValidate
	 * URL-->/companies/{CompanyName}/branches/{BranchName}/validate
	 **/
	public function updateBranchValidate(Request $jsonRequest, $CompanyName, $BranchName){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$branchesResponse = new Response();
		$branchesResponse->setStatusCodee(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			return branchesConstants::dbUpdateValidateSuccessMsg;
		} else {
			$branchesResponse->setStatusCode(400, $errorMsg);
			return $branchesResponse;
		}
	}
	
	/**
	 * PUT method updateBranch
	 * URL-->/companies/{CompanyName}/branches/{BranchName}
	 **/
	public function updateBranch(Request $jsonRequest, $CompanyName, $BranchName){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
	
		$branchesResponse = new Response();
		$branchesResponse->setStatusCode(400, null);
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$branchesResponse->setStatusCode(400, $errorMsg);
			return $branchesResponse;
		}
	
		try{
			array_push($mySqlWhere, [branchesConstants::dbCompanyName, '=', $CompanyName]);
			array_push($mySqlWhere, [branchesConstants::dbBranchName, '=', $BranchName]);
			DB::table(branchesConstants::branchesTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOException $e){
			$branchesResponse->setStatusCode(400, branchesConstants::dbUpdateCatchMsg);
			return $branchesResponse;
		}
		return branchesConstants::dbUpdateSuccessMsg;
	}

	/**
	 * DELETE method deleteBranch
	 * URL-->/companies/{CompanyName}/branches/{BranchName}
	 **/
	public function deleteBranch($CompanyName, $BranchName){
		$mySqlWhere = array();
		$errorMsg = '';

		$branchesResponse = new Response();
		$branchesResponse->setStatusCode(400, null);
		try{
			array_push($mySqlWhere, [branchesConstants::dbCompanyName, '=', $CompanyName]);
			array_push($mySqlWhere, [branchesConstants::dbBranchName, '=', $BranchName]);
			DB::table(branchesConstants::branchesTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$branchesResponse->setStatusCode(400, branchesConstants::dbDeleteCatchMsg);
			return $branchesResponse;
		}
		return branchesConstants::dbDeleteSuccessMsg;
	}
}
