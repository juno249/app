<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
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

class reservationsConstants{
	const reservationsTable = 'reservations';
	
	const dbReservationId = 'reservation_id';
	const dbReservationCode = 'reservation_code';
	const dbCustomerUsername = 'customer_username';
	const dbOrderreferenceCode = 'orderreference_code';
	const dbReservationDinersCount = 'reservation_diners_count';
	const dbReservationEta = 'reservation_eta';
	const dbReservationPaymentMode = 'reservation_payment_mode';
	const dbReservationServiceTime = 'reservation_service_time';
	const dbReservationStatus = 'reservation_status';
	const dbLastChangeTimestamp = 'last_change_timestamp';
	
	const reqReservationId = 'ReservationId';
	const reqReservationCode = 'ReservationCode';
	const reqCustomerUsername = 'CustomerUsername';
	const reqOrderreferenceCode = 'OrderreferenceCode';
	const reqReservationDinersCount = 'ReservationDinersCount';
	const reqReservationEta = 'ReservationEta';
	const reqReservationPaymentMode = 'ReservationPaymentMode';
	const reqReservationServiceTime = 'ReservationServiceTime';
	const reqReservationStatus = 'ReservationStatus';
	const reqLastChangeTimestamp = 'LastChangeTimestamp';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW RESERVATION RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING RESERVATION RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING RESERVATION RECORD';
	
	const inconsistencyValidationErr1 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME & TABLE_NUMBER & ORDERREFERENCE_CODE IS NON-EXISTING';
	const inconsistencyValidationErr2 = 'KEY-COMBINATION COMPANY_NAME & BRANCH_NAME & TABLE_NUMBER & ORDERREFERENCE_CODE & RESERVATION_CODE IS NON-EXISTING';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
	const carbonParseErr = 'UNPARSEABLE DATE';
}

class reservationsController extends Controller
{
	public function __construct(){	//$this->middleware('jwt.auth');
	}
	
	public function getJoinCompanyBranchTableOrderreferenceReservation(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode, 
			$ReservationCode
			){
		$companyBranchTableOrderreferenceReservation = DB::table(reservationsConstants::dbOrderreferenceCode)
		->join(
				orderreferencesConstants::orderreferencesTable, 
				reservationsConstants::reservationsTable . '.' . reservationsConstants::dbOrderreferenceCode, 
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
		
		return $companyBranchTableOrderreferenceReservation;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/reservations
	public function getCompanyBranchReservations(
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
		
		$reservationsResponse = new  Response();
		try{
			$companyBranchReservations = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($companyBranchReservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($companyBranchReservations));
			}
		} catch(\PDOException  $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/reservations/{ReservationCode}
	public function getCompanyBranchReservation(
			$CompanyName, 
			$BranchName, 
			$ReservationCode
			){
		$mySqlWhere = '';
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
						reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationCode, 
						'=', 
						$ReservationCode
				]
				);
		
		$reservationsResponse = new Response();
		try{
			$companyBranchReservation = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($companyBranchReservation->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($companyBranchReservation));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/reservations/{ReservationStatus}
	public function getCompanyBranchReservationsReservationStatus(
			$CompanyName, 
			$BranchName, 
			$ReservationStatus
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
						reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationStatus, 
						'=', 
						reservationsConstants::dbReservationStatus
				]
				);
		
		$reservationsResponse = new Response();
		try{
			$companyBranchReservations = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($companyBranchReservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($reservationsResponse));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/reservations/not/{ReservationStatus}
	public function getCompanyBranchReservationsNotReservationStatus(
			$CompanyName, 
			$BranchName, 
			$ReservationStatus
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
						reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationStatus, 
						'!=', 
						reservationsConstants::dbReservationStatus
				]
				);
		
		$reservationsResponse = new Response();
		try{
			$companyBranchReservations = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($companyBranchReservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($companyBranchReservations));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/reservations
	public function getCompanyBranchTableReservations(
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
		
		$reservationsResponse = new Reservations();
		try{
			$companyBranchTableReservations = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($companyBranchTableReservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($companyBranchTableReservations));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/reservations/{ReservationCode}
	public function getCompanyBranchTableReservation(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$ReservationCode
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
						reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationCode, 
						'=', 
						$ReservationCode
				]
				);
		
		$reservationsResponse = new Reservations();
		try{
			$companyBranchTableReservation = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($companyBranchTableReservation->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($companyBranchTableReservation));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/reservations/{ReservationStatus}
	public function getCompanyBranchTableReservationsReservationStatus(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$ReservationStatus
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
						reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationStatus, 
						'=', 
						$ReservationStatus
				]
				);
		
		$reservationsResponse = new Reservations();
		try{
			$companyBranchTableReservations = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($companyBranchTableReservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($companyBranchTableReservations));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/reservations/not/{ReservationStatus}
	public function getCompanyBranchTableReservationsNotReservationStatus(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$ReservationStatus
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
						reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationStatus, 
						'!=', 
						$ReservationStatus
				]
				);
		
		$reservationsResponse = new Reservations();
		try{
			$companyBranchTableReservations = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($companyBranchTableReservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($companyBranchTableReservations));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/reservations
	public function getCompanyBranchTableOrderreferenceReservations(
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
		
		$reservationsResponse = new Response();
		try{
			$companyBranchTableOrderreferenceReservations = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($companyBranchTableOrderreferenceReservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($companyBranchTableOrderreferenceReservations));
			}
		} catch(\PDOException  $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/reservations/{ReservationCode}
	public function getCompanyBranchTableOrderreferenceReservation(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$Orderreference, 
			$ReservationCode
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
						reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationCode, 
						'=', 
						$ReservationCode
				]
				);
		
		$reservationsResponse = new Response();
		try{
			$customerCompanyBranchTableOrderreferenceReservation = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($customerCompanyBranchTableOrderreferenceReservation->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($customerCompanyBranchTableOrderreferenceReservation));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/reservations/{ReservationStatus}
	public function getCompanyBranchTableOrderreferenceReservationsReservationStatus(
			$CompanyName, 
			$BrarnchName, 
			$TableNumber, 
			$OrderreferenceCode, 
			$ReservationStatus
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
						reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationStatus, 
						'=', 
						$ReservationStatus
				]
				);
		
		$reservationsResponse = new Response();
		try{
			$customerCompanyBranchTableOrderreferenceReservations = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($customerCompanyBranchTableOrderreferenceReservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($customerCompanyBranchTableOrderreferenceReservations));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/reservations/not/{ReservationStatus}
	public function getCompanyBranchTableOrderreferenceReservationsNotReservationStatus(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode, 
			$ReservationStatus
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
						reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationStatus, 
						'=', 
						$ReservationStatus
				]
				);
		
		$reservationsResponse = new Response();
		try{
			$customerCompanyBranchTableOrderreferenceReservations = $this->getJoinCompanyBranchTableOrderreferenceReservation($mySqlWhere);
			if($customerCompanyBranchTableOrderreferenceReservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservationsResponse->setContent(json_encode($customerCompanyBranchTableOrderreferenceReservations));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/reservations/query
	public function getByQuery(){
		$mySqlWhere = array();
		
		if(isset($_GET[reservationsConstants::reqReservationId])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::dbReservationId, 
						'=', 
						$_GET[reservationsConstants::reqReservationId]
				]
				);
		}
		if(isset($_GET[reservationsConstants::reqReservationCode])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::dbReservationCode, 
						'LIKE', 
						'%' . $_GET[reservationsConstants::reqReservationCode] . '%'
				]
				);
		}
		if(isset($_GET[reservationsConstants::reqCustomerUsername])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::dbCustomerUsername, 
						'LIKE', 
						'%' . $_GET[reservationsConstants::reqCustomerUsername] . '%'
				]
				);
		}
		if(isset($_GET[reservationsConstants::reqOrderreferenceCode])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::dbOrderreferenceCode, 
						'LIKE', 
						'%' . $_GET[reservationsConstants::reqOrderreferenceCode] . '%'
				]
				);
		}
		if(isset($_GET[reservationsConstants::reqReservationDinersCount])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::dbReservationDinersCount, 
						'=', 
						$_GET[reservationsConstants::reqReservationDinersCount]
				]
				);
		}
		if(isset($_GET[reservationsConstants::reqReservationEta])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::dbReservationEta, 
						'LIKE', 
						'%' . $_GET[reservationsConstants::reqReservationEta] . '%'
				]
				);
		}
		if(isset($_GET[reservationsConstants::reqReservationPaymentMode])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::dbReservationPaymentMode, 
						'LIKE', 
						'%' . $_GET[reservationsConstants::reqReservationPaymentMode] . '%'
				]
				);
		}
		if(isset($_GET[reservationsConstants::reqReservationServiceTime])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::dbReservationServiceTime, 
						'LIKE', 
						'%' . $_GET[reservationsConstants::reqReservationServiceTime] . '%'
				]
				);
		}
		if(isset($_GET[reservationsConstants::reqReservationStatus])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::dbReservationStatus, 
						'LIKE', 
						'%' . $_GET[reservationsConstants::reqReservationStatus] . '%'
				]
				);
		}
		if(isset($_GET[reservationsConstants::reqLastChangeTimestamp])){	array_push(
				$mySqlWhere, 
				[
						reservationsConstants::reqLastChangeTimestamp, 
						'LIKE', 
						'%' . $_GET[reservationsConstants::reqLastChangeTimestamp] . '%'
				]
				);
		}
		
		$reservationsResponse = new Response();
		try{
			$reservations = DB::table(reservationsConstants::reservationsTable)
			->where($mySqlWhere)
			->get();
			if($reservations->isEmpty()){	$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::emptyResultSetErr
					);
			} else {	$reservations->setContent(json_encode($reservations));
			}
		} catch(\PDOException $e){	$reservationsResponse->setStatusCode(
				400, 
				reservationsConstants::dbReadCatchMsg
				);
		}
		
		return $reservationsResponse;
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
							'*.' . reservationsConstants::dbReservationCode => 'unique:reservations,reservation_code|required|string|max:40', 
							'*.' . reservationsConstants::dbCustomerUsername => 'exists:customers,customer_usernrame|required|string|max:30', 
							'*.' . reservationsConstants::dbOrderreferenceCode => 'exists:orderreferences,orderreference_code|required|string|max:40', 
							'*.' . reservationsConstants::dbdbReservationDinersCount => 'required|numeric', 
							'*.' . reservationsConstants::dbReservationEta => 'required|date_format:Y-m-d H:i:s', 
							'*.' . reservationsConstants::dbReservationPaymentMode => 'required|string|max:30', 
							'*.' . reservationsConstants::dbReservationServiceTime => 'required|date_format:Y-m-d H:i:s', 
							'*.' . reservationsConstants::dbReservationStatus => 'required|string|max:30'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . reservationsConstants::dbReservationCode => 'unique:reservations,reservation_code|sometimes|string|max:40', 
							'*.' . reservationsConstants::dbCustomerUsername => 'exists:customers,customer_usernrame|sometimes|string|max:30', 
							'*.' . reservationsConstants::dbOrderreferenceCode => 'exists:orderreferences,orderreference_code|sometimes|string|max:40', 
							'*.' . reservationsConstants::dbdbReservationDinersCount => 'sometimes|numeric', 
							'*.' . reservationsConstants::dbReservationEta => 'sometimes|date_format:Y-m-d H:i:s', 
							'*.' . reservationsConstants::dbReservationPaymentMode => 'sometimes|string|max:30', 
							'*.' . reservationsConstants::dbReservationServiceTime => 'sometimes|date_format:Y-m-d H:i:s', 
							'*.' . reservationsConstants::dbReservationStatus => 'sometimes|string|max:30', 
							'*.' . reservationsConstants::dbLastChangeTimestamp => 'sometimes|date_format:Y-m-d H:i:s'
					]
					);
		}
		
		if($jsonValidation->fails()){
			$errorMsg = $jsonValidation->messages();
			
			return false;
		} else {	return true;
		}
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/reservations
	public function addReservation(
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
		
		$reservationsResponse = new Response();
		$reservationsResponse->setStatusCode(
				400, 
				null
				);
		$companyBranchTableOrderreference = json_decode(
				(new orderreferencesController())->getCompanyBranchTableOrderreference(
						$CompanyName, 
						$BranchName, 
						$TableNumber, 
						$OrderreferenceCode
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTableOrderreference) == 0){
			$reservationsResponse->setStatusCode(
					400, 
					reservationsConstants::inconsistencyValidationErr1
					);
			
			return $reservationsResponse;
		}
		
		$orderreferenceCode = $companyBranchTableOrderreference[0][reservationsConstants::dbOrderreferenceCode];
		
		for($i=0; $i<$jsonData; $i++){
			if(!(isset($jsonData[$i][reservationsConstants::dbOrderreferenceCode]))){	$jsonData[$i][reservationsConstants::dbOrderreferenceCode] = $orderreferenceCode;
			}
		}
		
		for($i=0; $i<$jsonData; $i++){
			if(isset($jsonData[$i][reservationsConstant::dbReservationEta])){
				try{
					$jsonData[$i][reservationsConstants::dbReservationEta] = Carbon::parse($jsonData[$i][reservationsConstants::dbReservationEta])
					->format('Y-m-d H:i:s');
				} catch(\Exception $e){
					$reservationsResponse->setStatusCode(
							400, 
							reservationsConstants::carbonParseErr
							);
					
					return $reservationsResponse;
				}
			}
			if(isset($jsonData[$i][reservationsConstants::dbReservationServiceTime])){
				try{
					$jsonData[$i][reservationsConstants::dbReservationServiceTime] = Carbon::parse($jsonData[$i][reservationsConstants::dbReservationServiceTime])
					->format('Y-m-d H:i:s');
				} catch(\Exception $e){
					$reservationsResponse->setStatusCode(
							400, 
							reservationsConstants::carbonParseErr
							);
					
					return $reservationsResponse;
				}
			}
		}
		
		if($this->isDataValid(
				$jsonData, 
				$errorMsg, 
				"ADD"
				)
				){
			for($i=0; $i<$jsonData; $i++){
				if($jsonData[$i][reservationsConstants::dbOrderreferenceCode] == $orderreferenceCode){
					try{
						DB::table(reservationsConstants::reservationsTable)
						->insert($jsonData[$i]);
					} catch(\PDOException $e){
						$reservationsResponse->setStatusCode(
								400, 
								reservationsConstants::dbAddCatchMsg
								);
						
						return reservationsResponse;
					}
				}
			}
		} else {	$reservationsResponse->setStatusCode(
				400, 
				$errorMsg
				);
			
			return $reservationsResponse;
		}
		
		return reservationsConstants::dbAddSuccessMsg;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/reservations/{ReservationCode}
	public function updateReservation(
			Request $jsonRequest, 
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$Orderreference, 
			$ReservationCode
			){
		$jsonData = json_decode(
				$jsonRequest->getContent(), 
				true
				);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
		
		$reservationsResponse = new Response();
		$reservationsResponse->setStatusCode(
				400, 
				null
				);
		if(isset($jsonData[0][reservationsConstants::dbReservationEta])){
			try{	$jsonData[0][reservationsConstants::dbReservationEta] = Carbon::parse($jsonData[0][reservationsConstants::dbReservationEta])
			->format('Y-m-d H:i:s');
			} catch(\Exception $e){
				$reservationsResponse->setStatusCode(
						400, 
						reservationsConstants::carbonParseErr
						);
				
				return $reservationsResponse;
			}
		}
		if(isset($jsonData[0][reservationsConstants::dbReservationServiceTime])){
			try{
				$jsonData[0][reservationsConstants::dbReservationServiceTime] = Carbon::parse($jsonData[0][reservationsConstants::dbReservationServiceTime])
				->format('Y-m-d H:i:s');
			} catch(\Exception $e){
				$reservationsResponse->setStatusCode(
						400, 
						reservationsConstants::carbonParseErr
						);
				
				return $reservationsResponse;
			}
		}
		if(isset($jsonData[0][reservationsConstants::dbLastChangeTimestamp])){
			try{
				$jsonData[0][reservationsConstants::dbLastChangeTimestamp] = Carbon::parse($jsonData[0][reservationsConstants::dbLastChangeTimestamp])
				->format('Y-m-d H:i:s');
			} catch(\Exception $e){
				$reservationsResponse->setStatusCode(
						400, 
						reservationsConstants::carbonParseErr
						);
				
				return $reservationsResponse;
			}
		}
		
		$companyBranchTableOrderreferenceReservation = json_decode(
				$this->getCompanyBranchTableOrderreferenceReservation(
						$CompanyName, 
						$BranchName, 
						$TableNumber, 
						$Orderreference, 
						$ReservationCode
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTableOrderreferenceReservation) == 0){
			$reservationsResponse->setStatusCode(
					400, 
					reservationsConstants::inconsistencyValidationErr2
					);
			
			return $reservationsResponse;
		}
		
		$reservationId = $companyBranchTableOrderreferenceReservation[0][reservationsConstants::dbReservationId];
		
		try{
			array_push(
					$mySqlWhere, 
					[
							reservationsConstants::dbReservationId, 
							'=', 
							$reservationId
					]
					);
			DB::table(reservationsConstants::reservationsTable)
			->where($mySqlWhere)
			->update($jsonData[0]);
		} catch(\PDOException $e){
			$reservationsResponse->setStatusCode(
					400, 
					reservationsConstants::dbUpdateCatchMsg
					);
			
			return $reservationsResponse;
		}
		
		return $reservationsResponse;
	}
	
	//URL-->>/companies/{CompanyName}/branches/{BranchName}/tables/{TableNumber}/orderreferences/{OrderreferenceCode}/reservations/{ReservationCode}
	public function deleteReservation(
			$CompanyName, 
			$BranchName, 
			$TableNumber, 
			$OrderreferenceCode, 
			$ReservationCode
			){
		$mySqlWhere = array();
		$errorMsg = '';
		
		$reservationsResponse = new Response();
		$reservationsResponse->setStatusCode(
				400, 
				null
				);
		$companyBranchTableOrderreferenceReservation = json_decode(
				$this->getCompanyBranchTableOrderreferenceReservation(
						$CompanyName, 
						$BranchName, 
						$TableNumber, 
						$OrderreferenceCode, 
						$ReservationCode
						)
				->getContent(), 
				true
				);
		if(sizeof($companyBranchTableOrderreferenceReservation) == 0){
			$reservationsResponse->setStatusCode(
					200, 
					reservationsConstants::inconsistencyValidationErr2
					);
			
			return $reservationsResponse;
		}
		
		$reservationId = $companyBranchTableOrderreferenceReservation[0][reservationsConstants::dbReservationId];
		
		try{
			array_push(
					$mySqlWhere, 
					[
							reservationsConstants::dbReservationId, 
							'=', 
							$reservationId
					]
					);
			DB::table(reservationsConstants::reservationsTable)
			->where($mySqlWhere)
			->delete();
		} catch(\PDOException $e){
			$reservationsResponse->setStatusCode(
					400, 
					reservationsConstants::dbDeleteCatchMsg
					);
			
			return $reservationsResponse;
		}
		
		return $reservationsResponse;
	}
}