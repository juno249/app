<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "companiesController.php";

class advertisementsConstants{
	const advertisementsTable = 'advertisements';
	
	const dbAdvertisementId = 'advertisement_id';
	const dbCompanyName = 'company_name';
	const dbAdvertisementTitle = 'advertisement_title';
	const dbAdvertisementContent = 'advertisement_content';
	const dbAdvertisementPrice = 'advertisement_price';
	const dbAdvertisementImage = 'advertisement_image';
	const dbAdvertisementUrl = 'advertisement_url';
	
	const reqAdvertisementId = 'AdvertisementId';
	const reqCompanyName = 'CompanyName';
	const reqAdvertisementTitle = 'AdvertisementTitle';
	const reqAdvertisementContent = 'AdvertisementContent';
	const reqAdvertisementPrice = 'AdvertisementPrice';
	const reqAdvertisementImage = 'AdvertisementImage';
	const reqAdvertisementUrl = 'AdvertisementUrl';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW ADVERTISEMENT RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING ADVERTISEMENT RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING ADVERTISEMENT RECORD';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class advertisementsController extends Controller
{
	public function __construct(){
		//$this->middleware('jwt.auth');
	}
	
	public function getJoinCompanyAdvertisement($mySqlWhere){
		$companyAdvertisement = DB::table(advertisementsConstants::advertisementsTable)
		->join(
				companiesConstants::companiesTable, 
				advertisementsConstants::advertisementsTable . '.' . advertisementsConstants::dbCompanyName, 
				'=', 
				companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName
				)
				->where($mySqlWhere)
				->get();
				return $companyAdvertisement;
	}
	
	//URL-->>/advertisements
	public function getAllAdvertisements(){
		$mySqlWhere = array();
		
		$advertisementsResponse = new Response();
		try{
			$advertisements = $this->getJoinCompanyAdvertisement($mySqlWhere);
			if($advertisements->isEmpty()){
				$advertisementsResponse->setStatusCode(200, advertisementsConstants::emptyResultSetErr);
			} else {
				$advertisementsResponse->setContent(json_encode($advertisements));
			}
		} catch(\PDOException $e){
			$advertisementsResponse->setStatusCode(400, advertisementsConstants::dbReadCatchMsg);
		}
		return $advertisementsResponse;
	}
	
	//URL-->>/advertisements/{AdvertisementId}
	public function getAdvertisement($AdvertisementId){
		$mySqlWhere = array();
		array_push($mySqlWhere, [advertisementsConstants::advertisementsTable . '.' . advertisementsConstants::dbAdvertisementId, '=', $AdvertisementId]);
		
		$advertisementsResponse = new Response();
		try{
			$advertisement = $this->getJoinCompanyAdvertisement($mySqlWhere);
			if($advertisement->isEmpty()){
				$advertisementsResponse->setStatusCode(200, advertisementsConstants::emptyResultSetErr);
			} else {
				$advertisementsResponse->setContent(json_encode($advertisement));
			}
		} catch(\PDOException $e){
			$advertisementsResponse->setStatusCode(400, advertisementsConstants::dbReadCatchMsg);
		}
		return $advertisementsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/advertisements
	public function getCompanyAdvertisements($CompanyName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		
		$advertisementsResponse = new Response();
		try{
			$companyAdvertisements = $this->getJoinCompanyAdvertisement($mySqlWhere);
			if($companyAdvertisements->isEmpty()){
				$advertisementsResponse->setStatusCode(200, advertisementsConstants::emptyResultSetErr);
			} else {
				$advertisementsResponse->setContent(json_encode($companyAdvertisements));
			}
		} catch(\PDOException $e){
			$advertisementsResponse->setStatusCode(400, advertisementsConstants::dbReadCatchMsg);
		}
		return $advertisementsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/advertisements/{AdvertisementId}
	public function getCompanyAdvertisement($CompanyName, $AdvertisementId){
		$mySqlWhere = array();
		array_push($mySqlWhere, [companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [advertisementsConstants::advertisementsTable . '.' . advertisementsConstants::dbAdvertisementId, '=', $AdvertisementId]);
		
		$advertisementsResponse = new Response();
		try{
			$companyAdvertisement = $this->getJoinCompanyAdvertisement($mySqlWhere);
			if($companyAdvertisement->isEmpty()){
				$advertisementsResponse->setStatusCode(200, advertisementsConstants::emptyResultSetErr);
			} else {
				$advertisementsResponse->setContent(json_encode($companyAdvertisement));
			}
		} catch(\PDOException $e){
			$advertisementsResponse->setStatusCode(400, advertisementsConstants::dbReadCatchMsg);
		}
		return $advertisementsResponse;
	}
	
	//URL-->>/advertisements/query
	public function getByQuery(){
		$mySqlWhere = array();
		if(isset($_GET[advertisementsConstants::reqAdvertisementId])){
			array_push($mySqlWhere, [advertisementsConstants::dbAdvertisementId, '=', $_GET[advertisementsConstants::reqAdvertisementId]]);
		}
		if(isset($_GET[advertisementsConstants::reqCompanyName])){
			array_push($mySqlWhere, [advertisementsConstants::dbCompanyName, '=', $_GET[advertisementsConstants::reqCompanyName]]);
		}
		if(isset($_GET[advertisementsConstants::reqAdvertisementTitle])){
			array_push($mySqlWhere, [advertisementsConstants::dbAdvertisementTitle, 'LIKE', '%' . $_GET[advertisementsConstants::reqAdvertisementTitle] . '%']);
		}
		if(isset($_GET[advertisementsConstants::reqAdvertisementContent])){
			array_push($mySqlWhere, [advertisementsConstants::dbAdvertisementContent, 'LIKE', '%' . $_GET[advertisementsConstants::reqAdvertisementContent] . '%']);
		}
		if(isset($_GET[advertisementsConstants::reqAdvertisementPrice])){
			array_push($mySqlWhere, [advertisementsConstants::dbAdvertisementPrice, '=', $_GET[advertisementsConstants::reqAdvertisementPrice]]);
		}
		if(isset($_GET[advertisementsConstants::reqAdvertisementImage])){
			array_push($mySqlWhere, [advertisementsConstants::dbAdvertisementImage, 'LIKE', '%' . $_GET[advertisementsConstants::reqAdvertisementImage] . '%']);
		}
		if(isset($_GET[advertisementsConstants::reqAdvertisementUrl])){
			array_push($mySqlWhere, [advertisementsConstants::dbAdvertisementUrl, 'LIKE', '%' . $_GET[advertisementsConstants::reqAdvertisementUrl] . '%']);
		}
			
		$advertisementsResponse = new Response();
		try{
			$advertisements = DB::table(advertisementsConstants::advertisementsTable)->where($mySqlWhere)->get();
			if($advertisements->isEmpty()){
				$advertisementsResponse->setStatusCode(200, advertisementsConstants::emptyResultSetErr);
			} else {
				$advertisementsResponse->setContent(json_encode($advertisements));
			}
		} catch(\PDOException $e){
			$advertisementsResponse->setStatusCode(400, advertisementsConstants::dbReadCatchMsg);
		}
		return $advertisementsResponse;
	}
	
	public function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . advertisementsConstants::dbCompanyName => 'exists:companies,company_name|required|string|max:30', 
							'*.' . advertisementsConstants::dbAdvertisementTitle => 'required|string|max:100', 
							'*.' . advertisementsConstants::dbAdvertisementContent => 'required|string|max:1000', 
							'*.' . advertisementsConstants::dbAdvertisementPrice => 'required|numeric', 
							'*.' . advertisementsConstants::dbAdvertisementImage => 'required|string|max:500', 
							'*.' . advertisementsConstants::dbAdvertisementUrl => 'required|string|max:500'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . advertisementsConstants::dbCompanyName => 'exists:companies,company_name|sometimes|string|max:30', 
							'*.' . advertisementsConstants::dbAdvertisementTitle => 'sometimes|string|max:100', 
							'*.' . advertisementsConstants::dbAdvertisementContent => 'sometimes|string|max:1000', 
							'*.' . advertisementsConstants::dbAdvertisementPrice => 'sometimes|numeric', 
							'*.' . advertisementsConstants::dbAdvertisementImage => 'sometimes|string|max:500', 
							'*.' . advertisementsConstants::dbAdvertisementUrl => 'sometimes|string|max:500'
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
	
	//URL-->>/advertisements
	public function addAdvertisement(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
		
		$advertisementsResponse = new Response();
		$advertisementsResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				try{	DB::table(advertisementsConstants::advertisementsTable)->insert($jsonData[$i]);
				} catch(\PDOException $e){
					$advertisementsResponse->setStatusCode(400, advertisementsConstants::dbAddCatchMsg);
					return $advertisementsResponse;
				}
			}
		} else {
			$advertisementsResponse->setStatusCode(400, $errorMsg);
			return $advertisementsResponse;
		}
		return advertisementsConstants::dbAddSuccessMsg;
	}
	
	//URL-->>/advertisements/{AdvertisementId}
	public function updateAdvertisement(Request $jsonRequest, $AdvertisementId){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
		
		$advertisementsResponse = new Response();
		$advertisementsResponse->setStatusCode(400, null);
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$advertisementsResponse->setStatusCode(400, $errorMsg);
			return $advertisementsResponse;
		}
		
		try{
			array_push($mySqlWhere, [advertisementsConstants::dbAdvertisementId, '=', $AdvertisementId]);
			DB::table(advertisementsConstants::advertisementsTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOException $e){
			$advertisementsResponse->setStatusCode(400, advertisementsConstants::dbUpdateCatchMsg);
			return $advertisementsResponse;
		}
		return advertisementsConstants::dbUpdateSuccessMsg;
	}
	
	//URL-->>/advertisements/{AdvertisementId}
	public function deleteAdvertisement($AdvertisementId){
		$mySqlWhere = array();
		$errorMsg = '';
		
		$advertisementsResponse = new Response();
		$advertisementsResponse->setStatusCode(400, null);
		try{
			array_push($mySqlWhere , [advertisementsConstants::dbAdvertisementId, '=', $AdvertisementId]);
			DB::table(advertisementsConstants::advertisementsTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$advertisementsResponse->setStatusCode(400, advertisementsConstants::dbDeleteCatchMsg);
			return $advertisementsResponse;
		}
		return advertisementsConstants::dbDeleteSuccessMsg;
	}
}