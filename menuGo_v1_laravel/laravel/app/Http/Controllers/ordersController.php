<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "orderreferencesController.php";
include_once "menuitemsController.php";

class ordersConstants{
	const ordersTable = 'orders';
	
	const dbOrderId = 'order_id';
	const dbCustomerUsername = 'customer_username';
	const dbMenuitemId = 'menuitem_id';
	const dbOrderreferenceCode = 'orderreference_code';
	const dbOrderStatus = 'order_status';
	const dbOrderStatusChangeTimestamp = 'order_status_change_timestamp';
	
	const reqOrderId = 'OrderId';
	const reqCustomerUsername = 'CustomerUsername';
	const reqMenuitemId = 'MenuitemId';
	const reqOrderreferenceCode = 'OrderreferenceCode';
	const reqOrderStatus = 'OrderStatus';
	const reqOrderStatusChangeTimestamp = 'OrderStatusChangeTimestamp';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW ORDER RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING ORDER RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING ORDER RECORD';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class ordersController extends Controller
{
	public function __construct(){
		//$this->middleware('jwt.auth');
	}
}