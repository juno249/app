<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "customersCompaniesBranchesController.php";

class companiesConstants{
	const companiesTable = 'companies';
	/*
	 * CONSTANTS w/c signify the column_name in companies table
	 * */
	const dbCompanyName = 'company_name';
	const dbCompanyDesc = 'company_desc';
	const dbCompanyLogo = 'company_logo';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqCompanyName = 'CompanyName';
	const reqCompanyDesc = 'CompanyDesc';
	const reqCompanyLogo = 'CompanyLogo';
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
	const dbAddSuccessMsg = 'DB UPDATED W/NEW COMPANY RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING COMPANY RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING COMPANY RECORD';
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

class companiesController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to companiesController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth');
	}

	/**
	 * getJoinCompanyCustomerCompanyBranch: joins companies_table & customers_companies_branches table w/a variable $mySqlWhere
	 * */
	public function getJoinCompanyCustomerCompanyBranch($mySqlWhere){
		$companyCustomerCompanyBranch = DB::table(companiesConstants::companiesTable)
		->join(
				customersCompaniesBranchesConstants::customersCompaniesBranchesTable, 
				companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
				'=', 
				customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCompanyName
				)
				->where($mySqlWhere)
				->get();
				return $companyCustomerCompanyBranch;
	}
	
	/**
	 * GET method getAllCompaniesAdministrator
	 * URL--> /companies/customers/{CustomerUsername}
	 * */
	public function getAllCompaniesAdministrator($CustomerUsername){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCustomerUsername, '=', $CustomerUsername]);
		
		$companiesResponse = new Response();
		try{
			$companies = $this->getJoinCompanyCustomerCompanyBranch($mySqlWhere);
			if($companies->isEmpty()){
				$companiesResponse->setStatusCode(200, companiesConstants::emptyResultSetErr);
			} else {
				$companiesResponse->setContent(json_encode($companies));
			}
		} catch(\PDOException $e){
			$companiesResponse->setStatusCode(400, dbReadCatchMsg);
		}
		return $companiesResponse;
	}
	
	/**
	 * GET method getAllCompanies
	 * URL-->/companies/
	 **/
	public function getAllCompanies(){
		$companiesResponse = new Response();
		try{
			$companies = DB::table(companiesConstants::companiesTable)->get();
			if($companies->isEmpty()){
				$companiesResponse->setStatusCode(200, companiesConstants::emptyResultSetErr);
			} else {
				$companiesResponse->setContent(json_encode($companies));
			}
		} catch(\PDOException $e){
			$customersResponse.setStatusCode(400, customersConstants::dbReadCatchMsg);
		}
		return $companiesResponse;
	}

	/**
	 * GET method getCompany
	 * URL-->/companies/{CompanyName}
	 * */
	public function getCompany($CompanyName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
			
		$companiesResponse = new Response();
		try{
			$company = DB::table(companiesConstants::companiesTable)->where($mySqlWhere)->get();
			if($company->isEmpty()){
				$companiesResponse->setStatusCode(200, companiesConstants::emptyResultSetErr);
			} else {
				$companiesResponse->setContent(json_encode($company));
			}
		} catch(\PDOException $e){
			$customersResponse.setStatusCode(400, customersConstants::dbReadCatchMsg);
		}
		return $companiesResponse;
	}

	/**
	 * GET method getByQuery
	 * URL-->/companies/query
	 * */
	public function getByQuery(){
		$mySqlWhere = array();
			
		if(isset($_GET[companiesConstants::reqCompanyName])){
			array_push($mySqlWhere, [companiesConstants::dbCompanyName, 'LIKE', '%' . $_GET[companiesConstants::reqCompanyName] . '%']);
		}
		if(isset($_GET[companiesConstants::reqCompanyDesc])){
			array_push($mySqlWhere, [companiesConstants::dbCompanyDesc, 'LIKE', '%' . $_GET[companiesConstants::reqCompanyDesc] . '%']);
		}
		if(isset($_GET[companiesConstants::reqCompanyLogo])){
			array_push($mySqlWhere, [companiesConstants::dbCompanyLogo, 'LIKE', '%' . $_GET[companiesConstants::reqCompanyLogo] . '%']);
		}
			
		$companiesResponse = new Response();
		try{
			$companies = DB::table(companiesConstants::companiesTable)->where($mySqlWhere)->get();
			if($companies->isEmpty()){
				$companiesResponse->setStatusCode(200, companiesConstants::emptyResultSetErr);
			} else {
				$companiesResponse->setContent(json_encode($companies));
			}
		} catch(\PDOException $e){
			$customersResponse.setStatusCode(400, customersConstants::dbReadCatchMsg);
		}
		return $companiesResponse;
	}

	/**
	 * Do basic Laravel validation
	 * */
	public function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . companiesConstants::dbCompanyName => 'unique:companies,company_name|required|string|max:30',
							'*.' . companiesConstants::dbCompanyDesc => 'required|string|max:500',
							'*.' . companiesConstants::dbCompanyLogo => 'required|string|max:500'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . companiesConstants::dbCompanyName => 'unique:companies,company_name|sometimes|string|max:30',
							'*.' . companiesConstants::dbCompanyDesc => 'sometimes|string|max:500',
							'*.' . companiesConstants::dbCompanyLogo => 'sometimes|string|max:500'
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
	 * POST method addCompanyValidate
	 * URL-->/companies/validate
	 * */
	public function addCompanyValidate(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$companiesResponse = new Response();
		$companiesResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			return companiesConstants::dbAddValidateSuccessMsg;
		} else {
			$companiesResponse->setStatusCode(400, $errorMsg);
			return $companiesResponse;
		}
	}
	
	/**
	 * POST method addCompany
	 * URL-->/companies/
	 * */
	public function addCompany(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
			
		$companiesResponse = new Response();
		$companiesResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				try{		DB::table(companiesConstants::companiesTable)->insert($jsonData[$i]);
				} catch(\PDOException $e){
					$companiesResponse->setStatusCode(400, companiesConstants::dbAddCatchMsg);
					return $companiesResponse;
				}
			}
		} else {
			$companiesResponse->setStatusCode(400, $errorMsg);
			return $companiesResponse;
		}
		return companiesConstants::dbAddSuccessMsg;
	}

	/**
	 * POST method updateCompanyValidate
	 * URL-->/companies/{CompanyName}/validate
	 * */
	public function updateCompanyValidate(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$companiesResponse = new Response();
		$companiesResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			return companiesConstants::dbUpdateValidateSuccessMsg;
		} else {
			$companiesResponse->setStatusCode(400, $errorMsg);
			return $companiesResponse;
		}
	}
	
	/**
	 * PUT method updateCompany
	 * URL-->/companies/{CompanyName}
	 * */
	public function updateCompany(Request $jsonRequest, $CompanyName){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
			
		$companiesResponse = new Response();
		$companiesResponse->setStatusCode(400, null);
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$companiesResponse->setStatusCode(400, $errorMsg);
			return $companiesResponse;
		}
	
		try{
			array_push($mySqlWhere, [companiesConstants::dbCompanyName, '=', $CompanyName]);
			DB::table(companiesConstants::companiesTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOException $e){
			$companiesResponse->setStatusCode(400, companiesConstants::dbUpdateCatchMsg);
			return $companiesResponse;
		}
		return companiesConstants::dbUpdateSuccessMsg;
	}

	/**
	 * DELETE method deleteCompany
	 * URL-->/companies/{CompanyName}
	 * */
	public function deleteCompany($CompanyName){
		$mySqlWhere = array();
		$errorMsg = '';

		$companiesResponse = new Response();
		$companiesResponse->setStatusCode(400, null);
		try{
			array_push($mySqlWhere, [companiesConstants::dbCompanyName, '=', $CompanyName]);
			DB::table(companiesConstants::companiesTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$companiesResponse->setStatusCode(400, companiesConstants::dbDeleteCatchMsg);
			return $companiesResponse;
		}
		return companiesConstants::dbDeleteSuccessMsg;
	}
}
