angular
.module('starter')

/* ******************************
 * Constants: API_BASE_URL
 * purpose: identifies URL of API
 * ****************************** */
.constant('API_BASE_URL', 'http://localhost/api')

/* ******************************
 * Constants: COMPANIES_DB_FIELDS
 * purpose: lists db fields along w/ their
 * 				corresponding column index
 * ****************************** */
.constant('COMPANIES_DB_FIELDS', {
	0: 'company_name', 
	1: 'company_desc', 
	2: 'company_category', 
	3: 'company_logo'
})

/* ******************************
 * Constants: CUSTOMERS_DB_FIELDS
 * purpose: lists db fields along w/ their
 * 				corresponding column index
 * ****************************** */
.constant('CUSTOMERS_DB_FIELDS', {
	0: 'customer_username', 
	1: 'customer_password', 
	2: 'customer_name_fname', 
	3: 'customer_name_mname', 
	4: 'customer_name_lname', 
	5: 'customer_role', 
	6: 'customer_gender', 
	7: 'customer_address_house_building', 
	8: 'customer_address_street', 
	9: 'customer_address_district', 
	10: 'customer_address_city', 
	11: 'customer_address_postalcode', 
	12: 'customer_address_country', 
	13: 'customer_mobile', 
	14: 'customer_email', 
	15: 'customer_birthday_month', 
	16: 'customer_birthday_date', 
	17: 'customer_birthday_year'
})

/* ******************************
 * Constants: BRANCHES_DB_FIELDS
 * purpose: lists db fields along w/ their
 * 				corresponding column index
 * ****************************** */
.constant('BRANCHES_DB_FIELDS', {
	0: 'branch_id', 
	1: 'branch_name', 
	2: 'company_name', 
	3: 'branch_address_house_building', 
	4: 'branch_address_street', 
	5: 'branch_address_district', 
	6: 'branch_address_city', 
	7: 'branch_address_postalcode', 
	8: 'branch_address_country', 
	9: 'branch_hotline'
})

/* ******************************
 * Constants: MENUS_DB_FIELDS
 * purpose: lists db fields along w/ their
 * 				corresponding column index
 * ****************************** */
.constant('MENUS_DB_FIELDS', {
	0: 'menu_id', 
	1: 'menu_name', 
	2: 'company_name', 
	3: 'menu_desc', 
	4: 'menu_image'
})

/* ******************************
 * Constants: TABLES_DB_FIELDS
 * purpose: lists db fields along w/ their
 * 				corresponding column index
 * ****************************** */
.constant('TABLES_DB_FIELDS', {
	0: 'table_id', 
	1: 'table_number', 
	2: 'branch_id', 
	3: 'table_capacity', 
	4: 'table_status'
})

/* ******************************
 * Constants: MENUITEMS_DB_FIELDS
 * purpose: lists db fields along w/ their
 * 				corresponding column index
 * ****************************** */
.constant('MENUITEMS_DB_FIELDS', {
	0: 'menuitem_id', 
	1: 'menuitem_code', 
	2: 'menu_id', 
	3: 'menuitem_name', 
	4: 'menuitem_desc', 
	5: 'menuitem_price', 
	6: 'menuitem_featured', 
	7: 'menuitem_image'
})

/* ******************************
 * Constants: ORDERS_DB_FIELDS
 * purpose: lists db fields along w/ their
 * 				corresponding column index
 * ****************************** */
.constant('ORDERS_DB_FIELDS', {
	0: 'order_id', 
	1: 'customer_username', 
	2: 'menuitem_id', 
	3: 'table_id', 
	4: 'order_timestamp', 
	5: 'order_status'
})

/* ******************************
 * Constants: CUSTOMERCOMPANYBRANCH_DB_FIELDS
 * purpose: lists db fields along w/ their
 * 				corresponding column index
 * ****************************** */
.constant('CUSTOMERCOMPANYBRANCH_DB_FIELDS', {
	0: 'customer_username', 
	1: 'company_name', 
	2: 'branch_name'
})

/* ******************************
 * Constants: USER_ROLES
 * purpose: lists users roles/authority
 * ****************************** */
.constant('USER_ROLES', {
	administrator: 'administrator', 
	manager: 'manager', 
	cook: 'cook', 
	customer: 'customer', 
	waiter: 'waiter'
})

/* ******************************
 * Constants: USER_GENDERS
 * purpose: lists users gender
 * ****************************** */
.constant('USER_GENDERS', {
	male: 'male', 
	female: 'female'
})

/* ******************************
 * Constants: TABLE_STATUS
 * purpose: lists table status
 * ****************************** */
.constant('TABLE_STATUS', {
	vacant: 'vacant', 
	occupied: 'occupied'
})

/* ******************************
 * Constants: FEATURED_VALUES
 * purpose: lists table status
 * ****************************** */
.constant('FEATURED_VALUES', {
	1: 'Y', 
	0: 'N'
})

/* ******************************
 * Constants: BROADCAST_MESSAGE
 * purpose: lists broadcast messages
 * ****************************** */
.constant('BROADCAST_MESSAGE', {
	addCompany: 'addCompany', 
	addCustomer: 'addCustomer', 
	addBranch: 'addBranch', 
	addMenu: 'addMenu', 
	addTable: 'addTable', 
	addOrder: 'addOrder', 
	addMenuitem: 'addMenuitem', 
	updateCompany: 'updateCompany', 
	updateCustomer: 'updateCustomer', 
	updateBranch: 'updateBranch', 
	updateMenu: 'updateMenu', 
	updateTable: 'updateTable', 
	updateMenuitem: 'updateMenuitem', 
	updateOrder: 'updateOrder', 
	deleteCompany: 'deleteCompany', 
	deleteCustomer: 'deleteCustomer', 
	deleteBranch: 'deleteBranch', 
	deleteMenu: 'deleteMenu', 
	deleteTable: 'deleteTable', 
	deleteMenuitem: 'deleteMenuitem', 
	deleteOrder: 'deleteOrder', 
	toggleBranch: 'toggleBranch', 
	toggleMenu: 'toggleMenu', 
	toggleTable: 'toggleTable', 
	toggleMenuitem: 'toggleMenuitem', 
	authAuthenticated: 'authAuthenticated'
});