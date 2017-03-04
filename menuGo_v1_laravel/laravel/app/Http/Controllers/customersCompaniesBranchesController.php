<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

include_once "customersController.php";
include_once "companiesController.php";
include_once "branchesController.php";

class customersCompaniesBranchesConstants{
	const customersCompaniesBranchesTable = 'customers_companies_branches';
	/*
	 * CONSTANTS w/c signify the column_name in tables table
	 * */
	const dbCustomerUsername = 'customer_username';
	const dbCompanyName = 'company_name';
	const dbBranchName = 'branch_name';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqCustomerUsername = 'customerUsername';
	const reqCompanyName = 'companyName';
	const reqBranchName = 'branchName';
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
	const dbAddSuccessMsg = 'DB UPDATED W/NEW CUSTOMER RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING CUSTOMER RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING CUSTOMER RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}
		
class customersCompaniesBranchesController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to customersController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth', ['except' => ['addCustomerCompanyBranch']]);
	}
	
	/**
	 * getJoinCustomerCompanyBranch: joins customers_table & companies_table & branches_table w/a variable $mySqlWhere
	 * */
	public function getJoinCustomerCompanyBranch($mySqlWhere){
		$customerCompanyBranch = DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)
		->join(
				customersConstants::customersTable, 
				customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCustomerUsername, 
				'=', 
				customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername
				)
				->join(
						companiesConstants::companiesTable, 
						customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCompanyName, 
						'=', 
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName
						)
						->join(
								branchesConstants::branchesTable, 
								companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
								'=', 
								branchesConstants::branchesTable . '.' . branchesConstants::dbCompanyName
								)
								->where($mySqlWhere)
								->get();
								return $customerCompanyBranch;
	}
	
	/**
	 * GET method getAllCustomersCompaniesBranches
	 * URL-->/customers-companies-branches
	 **/
	public function getAllCustomersCompaniesBranches(){
		$mySqlWhere = array();
		
		$customersCompaniesBranchesResponse = new Response();
		try{
			$customersCompaniesBranches = $this->getJoinCustomerCompanyBranch($mySqlWhere);
			if($customersCompaniesBranches->isEmpty()){
				$customersCompaniesBranchesResponse->setStatusCode(200, customersCompaniesBranchesConstants::emptyResultSetErr);
			} else {
				$customersCompaniesBranchesResponse->setContent(json_encode($customersCompaniesBranches));
			}
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(400, customersCompaniesBranchesConstants::dbReadCatchMsg);
		}
		return $customersCompaniesBranchesResponse;
	}
	
	/**
	 * GET method getCustomerCompanyBranch
	 * URL-->/customers-companies-branches/{CustomerUsername}/{CompanyName}/{BranchName}
	 **/
	public function getCustomerCompanyBranch($CustomerUsername, $CompanyName, $BranchName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCustomerUsername, '=', $CustomerUsername]);
		array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);
		
		$customersCompaniesBranchesResponse = new Response();
		try{
			$customerCompanyBranch = $this->getJoinCustomerCompanyBranch($mySqlWhere);
			if($customerCompanyBranch->isEmpty()){
				$customersCompaniesBranchesResponse->setStatusCode(200, customersCompaniesBranchesConstants::emptyResultSetErr);
			} else {
				$customersCompaniesBranchesResponse->setContent(json_encode($customerCompanyBranch));
			}
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(400, customersCompaniesBranchesConstants::dbReadCatchMsg);
		}
		return $customersCompaniesBranchesResponse;
	}
	
	/**
	 * GET method getByQuery
	 * URL-->/customers-companies-branches/query
	 **/
	public function getByQuery(){
		$mySqlWhere = array();
		
		if(isset($_GET[customersCompaniesBranchesConstants::reqCustomerUsername])){
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::dbCustomerUsername, '=', $_GET[customersCompaniesBranchesConstants::reqCustomerUsername]]);
		}
		if(isset($_GET[customersCompaniesBranchesConstants::reqCompanyName])){
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::dbCompanyName, 'LIKE', '%' . $_GET[customersCompaniesBranchesConstants::reqCompanyName] . '%']);
		}
		if(isset($_GET[customersCompaniesBranchesConstants::reqBranchName])){
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::dbBranchName, 'LIKE', '%' . $_GET[customersCompaniesBranchesConstants::reqBranchName] . '%']);
		}
		
		$customersCompaniesBranchesResponse = new Response();
		try{
			$customersCompaniesBranches = DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)->where($mySqlWhere)->get();
			if($customersCompaniesBranches->isEmpty()){
				$customersCompaniesBranchesResponse->setStatusCode(200, customersCompaniesBranchesConstants::emptyResultSetErr);
			} else {
				$customersCompaniesBranchesResponse->setContent(json_encode($customersCompaniesBranches));
			}
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse.setStatusCode(400, customersCompaniesBranchesConstants::dbReadCatchMessage);
		}
		return $customersCompaniesBranchesResponse;
	}
	
	/**
	 * Do basic Laravel validation
	 * */
	private function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . customersCompaniesBranchesConstants::dbCustomerUsername => 'exists:customers,customer_username|required|string|max:30', 
							'*.' . customersCompaniesBranchesConstants::dbCompanyName => 'exists:companies,company_name|required|string|max:30', 
							'*.' . customersCompaniesBranchesConstants::dbBranchName => 'exists:branches,branch_name|required|string|max:30'
					]
					);	
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . customersCompaniesBranchesConstants::dbCustomerUsername => 'exists:customers,customer_username|sometimes|string|max:30',
							'*.' . customersCompaniesBranchesConstants::dbCompanyName => 'exists:companies,company_name|sometimes|string|max:30',
							'*.' . customersCompaniesBranchesConstants::dbBranchName => 'exists:branches,branch_name|sometimes|string|max:30'
					]
					);
		}
		if($jsonValidation->fails()){
			$errorMsg .= $jsonValidation->messages();
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * Do basic Laravel validation (transaction)
	 * */
	private function isDataValidTransaction($jsonData, &$errorMsg, $dbOperation){
		$customersController = new customersController();
		$companiesController = new companiesController();
		
		$customer = $jsonData['customer'];
		$company = $jsonData['company'];
		
		if(!(null == $customer)){
			if(!($customersController->isDataValid([$customer], $errorMsg, $dbOperation))){
				return false;
			}
		}
		if(!(null == $company)){
			if(!($companiesController->isDataValid([$company], $errorMsg, $dbOperation))){
				return false;
			}
		}
		return true;
	}
	
	/**
	 * POST method addCustomerCompanyBranch
	 * URL-->/customers-companies-branches/
	 * */
	public function addCustomerCompanyBranch(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$customersCompaniesBranchesResponse = new Response();
		$customersCompaniesBranchesResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				try{		DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)->insert($jsonData[$i]);
				} catch(\PDOException $e){
					$customersCompaniesBranchesResponse->setStatusCode(400, customersCompaniesBranchesConstants::dbAddCatchMsg);
					return $customersCompaniesBranchesResponse;
				}
			}
		} else {
			$customersCompaniesBranchesResponse->setStatusCode(400, $errorMsg);
			return $customersCompaniesBranchesResponse;
		}
		return customersCompaniesBranchesConstants::dbAddSuccessMsg;
	}
	
	/**
	 * POST method addCustomerCompanyBranchTransaction
	 * URL-->/customers-companies-branches-transaction/
	 * */
	public function addCustomerCompanyBranchTransaction(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
		
		$customersCompaniesBranchesResponse = new Response();
		$customersCompaniesBranchesResponse->setStatusCode(400, null);
		for($i=0; $i<$jsonDataSize; $i++){
			$customerCompanyBranchRunner = $jsonData[$i];
			$customer = $customerCompanyBranchRunner['customer'];
			$company = $customerCompanyBranchRunner['company'];
			$branch = $customerCompanyBranchRunner['branch'];
			$customerCompanyBranch = $customerCompanyBranchRunner['customerCompanyBranch'];
			
			if(!($this->isDataValidTransaction($customerCompanyBranchRunner, $errorMsg, "ADD"))){
				$customersCompaniesBranchesResponse->setStatusCode(400, $errorMsg);
				return $customersCompaniesBranchesResponse;
			}
			
			DB::beginTransaction();
			try{
				$pwHashed = Hash::make($customer['customer_password']);
				if(!(null == $customer)){
					$customer['customer_password'] = $pwHashed;
					DB::table(customersConstants::customersTable)->insert($customer);
				}
				if(!(null == $company)){
					DB::table(companiesConstants::companiesTable)->insert($company);
				}
				if(!(null == $branch)){
					DB::table(branchesConstants::branchesTable)->insert($branch);
				}
				if(!(null == $customerCompanyBranch)){
					DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)->insert($customerCompanyBranch);
				}
				
				DB::commit();
			} catch(\PDOException $e){
				DB::rollback();
				$customersCompaniesBranchesResponse->setStatusCode(400, customersCompaniesBranchesConstants::dbAddCatchMsg);
			}
		}
		return customersCompaniesBranchesConstants::dbAddSuccessMsg;
	}
	
	/**
	 * PUT method updateCustomerCompanyBranch
	 * URL-->/customers-companies-branch/{CustomerUsername}/{CompanyName}/{BranchName}
	 **/
	public function updateCustomerCompanyBranch(Request $jsonRequest, $CustomerUsername, $CompanyName, $BranchName){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
	
		$customersCompaniesBranchesResponse = new Response();
		$customersCompaniesBranchesResponse->setStatusCode(400, null);
	
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$customersCompaniesBranchesResponse->setStatusCode(400, $errorMsg);
			return $customersCompaniesBranchesResponse;
		}
	
		try{
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCustomerUsername, '=', $CustomerUsername]);
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCompanyName, '=', $CompanyName]);
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbBranchName, '=', $BranchName]);
			DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(400, customersCompaniesBranchesConstants::dbUpdateCatchMessage);
			return $customersCompaniesBranchesResponse;
		}
		return customersCompaniesBranchesConstants::dbUpdateSuccessMsg;
	}
	
	/**
	 * DELETE method deleteCustomerCompanyBranch
	 * URL-->/customers-companies-branch/{CustomerUsername}/{CompanyName}/{BranchName}
	 **/
	public function deleteCustomerCompanyBranch($CustomerUsername, $CompanyName, $BranchName){
		$mySqlWhere = array();
		$errorMsg = '';
	
		$customersCompaniesBranchesResponse = new Response();
		$customersCompaniesBranchesResponse->setStatusCode(400, null);
		try{
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCustomerUsername, '=', $CustomerUsername]);
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCompanyName, '=', $CompanyName]);
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbBranchName, '=', $BranchName]);
			DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(400, customersCompaniesBranchesConstants::dbDeleteCatchMsg);
			return $customersCompaniesBranchesResponse;
		}
		return customersCompaniesBranchesConstants::dbDeleteSuccessMsg;
	}
}
