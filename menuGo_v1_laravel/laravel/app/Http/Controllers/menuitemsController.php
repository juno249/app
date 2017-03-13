<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "companiesController.php";
include_once "menusController.php";

class menuitemsConstants{
	const menuitemsTable = 'menuitems';
	/*
	 * CONSTANTS w/c signify the column_name in menuitems table
	 * */
	const dbMenuitemId = 'menuitem_id';
	const dbMenuitemCode = 'menuitem_code';
	const dbMenuId = 'menu_id';
	const dbMenuitemName = 'menuitem_name';
	const dbMenuitemDesc = 'menuitem_desc';
	const dbMenuitemPrice = 'menuitem_price';
	const dbMenuitemFeatured = 'menuitem_featured';
	const dbMenuitemImage = 'menuitem_image';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqMenuitemId = 'MenuitemId';
	const reqMenuId = 'MenuId';
	const reqMenuitemCode = 'MenuitemCode';
	const reqMenuitemName = 'MenuitemName';
	const reqMenuitemDesc = 'MenuitemDesc';
	const reqMenuitemPrice = 'MenuitemPrice';
	const reqMenuitemFeatured = 'MenuitemFeatured';
	const reqMenuitemImage = 'MenuitemImage';
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
	const dbAddSuccessMsg = 'DB UPDATED W/NEW MENUITEM RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING MENUITEM RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING MENUITEM RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const inconsistencyValidationErr1 = 'KEY-COMBINATION COMPANY_NAME & MENU_NAME IS NON-EXISTING';
	const inconsistencyValidationErr2 = 'KEY-COMBINATION COMPANY_NAME & MENU_NAME & MENUITEM_CODE IS NON-EXISTING';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class menuitemsController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to menuitemsController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth');
	}

	/**
	 * getJoinCompanyMenuMenuitems: joins companies_table & menus_table & menuitems_table w/a variable $mySqlWhere
	 * */
	public function getJoinCompanyMenuMenuitems($mySqlWhere){
		$companyMenuMenuitem = DB::table(menuitemsConstants::menuitemsTable)
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
						return $companyMenuMenuitem;
	}

	/**
	 * GET method getAllCompanyMenuMenuitems
	 * URL-->/companies/{CompanyName}/menus/{MenuName}/menuitems
	 **/
	public function getAllCompanyMenuMenuitems($CompanyName, $MenuName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [menusConstants::menusTable . '.' . menusConstants::dbMenuName, '=', $MenuName]);
		
		$menuitemsResponse = new Response();
		try{
			$companyMenuMenuitems = $this->getJoinCompanyMenuMenuitems($mySqlWhere);
			if($companyMenuMenuitems->isEmpty()){
				$menuitemsResponse->setStatusCode(200, menuitemsConstants::emptyResultSetErr);
			} else {
				$menuitemsResponse->setContent(json_encode($companyMenuMenuitems));
			}
		} catch(\PDOException $e){
			$menuitemsResponse->setStatusCode(400, menuitemsConstants::dbReadCatchMsg);
		}
		return $menuitemsResponse;
	}

	/**
	 * GET method getCompanyMenuMenuitem
	 * URL-->/companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}
	 **/
	public function getCompanyMenuMenuitem($CompanyName, $MenuName, $MenuitemCode){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [menusConstants::menusTable . '.' . menusConstants::dbMenuName, '=', $MenuName]);
		array_push($mySqlWhere, [menuitemsConstants::menuitemsTable . '.' . menuitemsConstants::dbMenuitemCode, '=', $MenuitemCode]);
	
		$menuitemsResponse = new Response();
		try{
			$companyMenuMenuitem = $this->getJoinCompanyMenuMenuitems($mySqlWhere);
			if($companyMenuMenuitem->isEmpty()){
				$menuitemsResponse->setStatusCode(200, menuitemsConstants::emptyResultSetErr);
			} else {
				$menuitemsResponse->setContent(json_encode($companyMenuMenuitem));
			}
		} catch(\PDOException $e){
			$menuitemsResponse->setStatusCode(400, menuitemsConstants::dbReadCatchMsg);
		}
		return $menuitemsResponse;
	}

	/**
	 * GET method getByQuery
	 * URL-->/menuitems/query
	 **/
	public function getByQuery(){
		$mySqlWhere = array();

		if(isset($_GET[menuitemsConstants::reqMenuitemId])){
			array_push($mySqlWhere, [menuitemsConstants::dbMenuitemId, '=', $_GET[menuitemsConstants::reqMenuitemId]]);
		}
		if(isset($_GET[menuitemsConstants::reqMenuId])){
			array_push($mySqlWhere, [menuitemsConstants::dbMenuId, '=', $_GET[menuitemsConstants::reqMenuId]]);
		}
		if(isset($_GET[menuitemsConstants::reqMenuitemCode])){
			array_push($mySqlWhere, [menuitemsConstants::dbMenuitemCode, 'LIKE', '%' . $_GET[menuitemsConstants::reqMenuitemCode] . '%']);
		}
		if(isset($_GET[menuitemsConstants::reqMenuitemName])){
			array_push($mySqlWhere, [menuitemsConstants::dbMenuitemName, 'LIKE', '%' . $_GET[menuitemsConstants::reqMenuitemName] . '%']);
		}
		if(isset($_GET[menuitemsConstants::reqMenuitemDesc])){
			array_push($mySqlWhere, [menuitemsConstants::dbMenuitemDesc, 'LIKE', '%' . $_GET[menuitemsConstants::reqMenuitemDesc] . '%']);
		}
		if(isset($_GET[menuitemsConstants::reqMenuitemPrice])){
			array_push($mySqlWhere, [menuitemsConstants::dbMenuitemPrice, '=',  $_GET[menuitemsConstants::reqMenuitemPrice]]);
		}
		if(isset($_GET[menuitemsConstants::reqMenuitemFeatured])){
			array_push($mySqlWhere, [menuitemsConstants::dbMenuitemFeatured, '=',  $_GET[menuitemsConstants::reqMenuitemFeatured]]);
		}
		if(isset($_GET[menuitemsConstants::reqMenuitemImage])){
			array_push($mySqlWhere, [menuitemsConstants::dbMenuitemImage, 'LIKE', '%' . $_GET[menuitemsConstants::reqMenuitemImage] . '%']);
		}
	
		$menuitemsResponse = new Response();
		try{
			$menuitems = DB::table(menuitemsConstants::menuitemsTable)->where($mySqlWhere)->get();
			if($menuitems->isEmpty()){
				$menuitemsResponse->setStatusCode(200, menuitemsConstants::emptyResultSetErr);
			} else {
				$menuitemsResponse->setContent(json_encode($menuitems));
			}
		} catch(\PDOException $e){
			$menuitemsResponse->setStatusCode(400, menuitemsConstants::dbReadCatchMsg);
		}
		return $menuitemsResponse;
	}

	/**
	 * Do basic Laravel validation
	 * */
	private function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . menuitemsConstants::dbMenuitemCode => 'required|string|max:10',
							'*.' . menuitemsConstants::dbMenuId => 'exists:menus,menu_id|numeric',
							'*.' . menuitemsConstants::dbMenuitemName => 'required|string|max:30',
							'*.' . menuitemsConstants::dbMenuitemDesc => 'required|string|max:500',
							'*.' . menuitemsConstants::dbMenuitemPrice => 'required|numeric',
							'*.' . menuitemsConstants::dbMenuitemFeatured => 'required|numeric',
							'*.' . menuitemsConstants::dbMenuitemImage => 'required|string|max:500'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . menuitemsConstants::dbMenuitemCode => 'sometimes|string|max:10',
							'*.' . menuitemsConstants::dbMenuId => 'exists:menus,menu_id|sometimes|numeric',
							'*.' . menuitemsConstants::dbMenuitemName => 'sometimes|string|max:30',
							'*.' . menuitemsConstants::dbMenuitemDesc => 'sometimes|string|max:500',
							'*.' . menuitemsConstants::dbMenuitemPrice => 'sometimes|numeric',
							'*.' . menuitemsConstants::dbMenuitemFeatured => 'sometimes|numeric',
							'*.' . menuitemsConstants::dbMenuitemImage => 'sometimes|string|max:500'
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
	 * POST method addMenuitem
	 * URL-->/companies/{CompanyName}/menus/{MenuName}/menuitems/
	 **/
	public function addMenuitem(Request $jsonRequest, $CompanyName, $MenuName){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$menuitemsResponse = new Response();
		$menuitemsResponse->setStatusCode(400, null);
		$companyMenu = json_decode((new menusController())->getCompanyMenu($CompanyName, $MenuName)->getContent(), true);
		if(sizeof($companyMenu) == 0){
			$menuitemsResponse->setStatusCode(400, menuitemsConstants::inconsistencyValidationErr1);
			return $menuitemsResponse;
		}
		$menuId = $companyMenu[0]['menu_id'];
	
		for($i=0; $i<$jsonDataSize; $i++){
			if(!(isset($jsonData[$i]['menu_id']))){
				$jsonData[$i]['menu_id'] = $menuId;
			}
		}
	
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				if($jsonData[$i]['menu_id'] == $menuId){
					try{		DB::table(menuitemsConstants::menuitemsTable)->insert($jsonData[$i]);
					} catch(\PDOException $e){
						$menuitemsResponse->setStatusCode(400, menuitemsConstants::dbAddCatchMsg);
						return $menuitemsResponse;
					}
				}
			}
		} else{
			$menuitemsResponse->setStatusCode(400, $errorMsg);
			return $menuitemsResponse;
		}
		return menuitemsConstants::dbAddSuccessMsg;
	}

	/**
	 * POST method updateMenuitem
	 * URL-->/companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}
	 **/
	public function updateMenuitem(Request $jsonRequest, $CompanyName, $MenuName, $MenuitemCode){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
	
		$menuitemsResponse = new Response();
		$menuitemsResponse->setStatusCode(400, null);
		$companyMenuMenuitem = json_decode($this->getCompanyMenuMenuitem($CompanyName, $MenuName, $MenuitemCode)->getContent(), true);
		if(sizeof($companyMenuMenuitem) == 0){
			$menuitemsResponse->setStatusCode(400, menuitemsConstants::inconsistencyValidationErr2);
			return $menuitemsResponse;
		}
		$menuitemId = $companyMenuMenuitem[0]['menuitem_id'];
	
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$menuitemsResponse->setStatusCode(400, $errorMsg);
			return $menuitemsResponse;
		}
	
		try{
			array_push($mySqlWhere, [menuitemsConstants::dbMenuitemId, '=', $menuitemId]);
			DB::table(menuitemsConstants::menuitemsTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOException $e){
			$menuitemsResponse->setStatusCode(400, menuitemsConstants::dbUpdateCatchMsg);
			return $menuitemsResponse;
		}
		return menuitemsConstants::dbUpdateSuccessMsg;
	}

	/**
	 * POST method deleteMenuitem
	 * URL-->/companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemCode}
	 **/
	public function deleteMenuitem($CompanyName, $MenuName, $MenuitemCode){
		$mySqlWhere = array();
		$errorMsg = '';
	
		$menuitemsResponse = new Response();
		$menuitemsResponse->setStatusCode(400, null);
		$companyMenuMenuitem = json_decode($this->getCompanyMenuMenuitem($CompanyName, $MenuName, $MenuitemCode)->getContent(), true);
		if(sizeof($companyMenuMenuitem) == 0){
			$menuitemsResponse->setStatusCode(400, menuitemsConstants::inconsistencyValidationErr2);
			return $menuitemsResponse;
		}
		$menuitemId = $companyMenuMenuitem[0]['menuitem_id'];
	
		try{
			array_push($mySqlWhere, [menuitemsConstants::dbMenuitemId, '=', $menuitemId]);
			DB::table(menuitemsConstants::menuitemsTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$menuitemsResponse->setStatusCode(400, menuitemsConstants::dbDeleteCatchMsg);
			return $menuitemsResponse;
		}
		return menuitemsConstants::dbDeleteSuccessMsg;
	}
}