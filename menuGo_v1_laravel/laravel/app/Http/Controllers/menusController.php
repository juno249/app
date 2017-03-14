<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "companiesController.php";

class menusConstants{
	const menusTable = 'menus';
	/*
	 * CONSTANTS w/c signify the column_name in menus table
	 * */
	const dbMenuId = 'menu_id';
	const dbCompanyName = 'company_name';
	const dbMenuName = 'menu_name';
	const dbMenuDesc = 'menu_desc';
	const dbMenuImage = 'menu_image';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqMenuId = 'MenuId';
	const reqCompanyName = 'CompanyName';
	const reqMenuName = 'MenuName';
	const reqMenuDesc = 'MenuDesc';
	const reqMenuImage = 'MenuImage';
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
	const dbAddSuccessMsg = 'DB UPDATED W/NEW MENU RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING MENU RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING MENU RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class menusController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to menusController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth');
	}

	/**
	 * getJoinCompanyMenu: joins companies_table & menus_table w/a variable $mySqlWhere
	 * */
	public function getJoinCompanyMenu($mySqlWhere){
		$companyMenu = DB::table(menusConstants::menusTable)
		->join(
				companiesConstants::companiesTable,
				menusConstants::menusTable . '.' . menusConstants::dbCompanyName,
				'=',
				companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName
				)
				->where($mySqlWhere)
				->get();
				return $companyMenu;
	}

	/**
	 * GET method getAllCompanyMenus
	 * URL-->/companies/{CompanyName}/menus
	 **/
	public function getAllCompanyMenus($CompanyName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		
		$menusResponse = new Response();
		try{
			$companyMenus = $this->getJoinCompanyMenu($mySqlWhere); 
			if($companyMenus->isEmpty()){
				$menusResponse->setStatusCode(200, menusConstants::emptyResultSetErr);
			} else {
				$menusResponse->setContent(json_encode($companyMenus));
			}
		} catch(\PDOException $e){
			$menusResponse->setStatusCode(400, menusConstants::dbReadCatchMsg);
		}
		return $menusResponse;
	}

	/**
	 * GET method getCompanyMenu
	 * URL-->/companies/{CompanyName}/menus/{MenuName}
	 **/
	public function getCompanyMenu($CompanyName, $MenuName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [menusConstants::menusTable . '.' . menusConstants::dbMenuName, '=', $MenuName]);
		
		$menusResponse = new Response();
		try{
			$companyMenu = $this->getJoinCompanyMenu($mySqlWhere);
			if($companyMenu->isEmpty()){
				$menusResponse->setStatusCode(200, menusConstants::emptyResultSetErr);
			} else {
				$menusResponse->setContent(json_encode($companyMenu));
			}
		} catch(\PDOException $e){
			$menusResponse->setStatusCode(400, menusConstants::dbReadCatchMsg);
		}
		return $menusResponse;
	}

	/**
	 * GET method getByQuery
	 * URL-->/menus/query
	 **/
	public function getByQuery(){
		$mySqlWhere = array();

		if(isset($_GET[menusConstants::reqMenuId])){
			array_push($mySqlWhere, [menusConstants::dbMenuId, '=', $_GET[menusConstants::reqMenuId]]);
		}
		if(isset($_GET[menusConstants::reqCompanyName])){
			array_push($mySqlWhere, [menusConstants::dbCompanyName, 'LIKE', '%' . $_GET[menusConstants::reqCompanyName] . '%']);
		}
		if(isset($_GET[menusConstants::reqMenuName])){
			array_push($mySqlWhere, [menusConstants::dbMenuName, 'LIKE', '%' . $_GET[menusConstants::reqMenuName] . '%']);
		}
		if(isset($_GET[menusConstants::reqMenuDesc])){
			array_push($mySqlWhere, [menusConstants::dbMenuDesc, 'LIKE', '%' . $_GET[menusConstants::reqMenuDesc] . '%']);
		}
		if(isset($_GET[menusConstants::reqMenuImage])){
			array_push($mySqlWhere, [menusConstants::dbMenuImage, 'LIKE', '%' . $_GET[menusConstants::reqMenuImage] . '%']);
		}

		$menusResponse = new Response();
		try{
			$companyMenus = DB::table(menusConstants::menusTable)->where($mySqlWhere)->get();
			if($companyMenus->isEmpty()){
				$menusResponse->setStatusCode(200, menusConstants::emptyResultSetErr);
			} else {
				$menusResponse->setContent(json_encode($companyMenus));
			}
		} catch(\PDOException $e){
			$menusResponse->setStatusCode(400, menusConstants::dbReadCatchMsg);
		}
		return $menusResponse;
	}

	/**
	 * Do basic Laravel validation
	 * */
	private function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . menusConstants::dbMenuName => 'required|string|max:30',
							'*.' . menusConstants::dbCompanyName => 'exists:companies,company_name|required|string|max:30',
							'*.' . menusConstants::dbMenuDesc => 'required|string|max:500',
							'*.' . menusConstants::dbMenuImage => 'required|string|max:1000'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . menusConstants::dbMenuName => 'sometimes|string|max:30',
							'*.' . menusConstants::dbCompanyName => 'exists:companies,company_name|sometimes|string|max:30',
							'*.' . menusConstants::dbMenuDesc => 'sometimes|string|max:500',
							'*.' . menusConstants::dbMenuImage => 'sometimes|string|max:1000'
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
	 * POST method addMenu
	 * URL-->/companies/{CompanyName}/menus
	 **/
	public function addMenu(Request $jsonRequest, $CompanyName){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$menusResponse = new Response();
		$menusResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				if($jsonData[$i]['company_name'] == $CompanyName){
					try{		DB::table(menusConstants::menusTable)->insert($jsonData[$i]);
					} catch(\PDOException $e){
						$menusResponse->setStatusCode(400, menusConstants::dbAddCatchMsg);
						return $menusResponse;
					}
				}
			}
		} else {
			$menusResponse->setStatusCode(400, $errorMsg);
			return $menusResponse;
		}
		return menusConstants::dbAddSuccessMsg;
	}

	/**
	 * PUT method updateMenu
	 * URL-->/companies/{CompanyName}/menus/{MenuName}
	 **/
	public function updateMenu(Request $jsonRequest, $CompanyName, $MenuName){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
	
		$menusResponse = new Response();
		$menusResponse->setStatusCode(400, null);
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$menusResponse->setStatusCode(400, $errorMsg);
			return $menusResponse;
		}
	
		try{
			array_push($mySqlWhere, [menusConstants::dbCompanyName, '=', $CompanyName]);
			array_push($mySqlWhere, [menusConstants::dbMenuName, '=', $MenuName]);
			DB::table(menusConstants::menusTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOException $e){
			$menusResponse->setStatusCode(400, menusConstants::dbUpdateCatchMsg);
			return $menusResponse;
		}
		return menusConstants::dbUpdateSuccessMsg;
	}

	/**
	 * DELETE method deleteMenu
	 * URL-->/companies/{CompanyName}/menus/{MenuName}
	 **/
	public function deleteMenu($CompanyName, $MenuName){
		$mySqlWhere = array();
		$errorMsg = '';
		
		$menusResponse = new Response();
		$menusResponse->setStatusCode(400, null);
		try{
			array_push($mySqlWhere, [menusConstants::dbCompanyName, '=', $CompanyName]);
			array_push($mySqlWhere, [menusConstants::dbMenuName, '=', $MenuName]);
			DB::table(menusConstants::menusTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$menusResponse->setStatusCode(400, menusConstants::dbDeleteCatchMsg);
			return $menusResponse;
		}
		return menusConstants::dbDeleteSuccessMsg;
	}
}