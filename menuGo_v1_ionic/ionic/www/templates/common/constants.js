angular
.module('starter')

/* ******************************
 * Constants: API_BASE_URL
 * purpose: identifies URL of API
 * ****************************** */
.constant('API_BASE_URL', 'http://localhost/api')

/* ******************************
 * Constants: MQTT_CONFIG
 * purpose: identifies & lists MQTT configurations
 * ****************************** */
.constant('MQTT_CONFIG', {
	host: 'localhost', 
	port: 1884, 
	topicWaiterRequest: 'topicWaiterRequest', 
	topicWaiterResponse: 'topicWaiterResponse', 
	topicOrderSentAck: 'topicOrderSentAck'
})

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
	1: 'company_name', 
	2: 'menu_name', 
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
	1: 'branch_id', 
	2: 'table_number', 
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
	6: 'menuitem_image'
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
 * Constants: TABLE_STATUS
 * purpose: lists table status
 * ****************************** */
.constant('TABLE_STATUS', {
	vacant: 'vacant', 
	occupied: 'occupied'
})

/* ******************************
 * Constants: ORDER_STATUS
 * purpose: lists order status
 * ****************************** */
.constant('ORDER_STATUS', [
	'sent', 
	'acknowledged', 
	'cooking', 
	'served', 
	'history'
])

/* ******************************
 * Constants: LOADING_MESSAGES
 * purpose: lists loading messages
 * ****************************** */
.constant('LOADING_MESSAGES', {
	login: 'logging in', 
	fetchCustomer: 'getting Customer', 
	fetchCompanies: 'getting Companies', 
	fetchBranches: 'getting Branches', 
	fetchTables: 'getting Tables', 
	fetchMenus: 'getting Menus', 
	fetchMenuitems: 'getting Menuitems', 
	addOrder: 'adding order', 
	reloadTableOrders: 'reloading table orders', 
	reloadOrders: 'reloading orders', 
	reloadCompanyBranchOrders: 'relaoding company branch orders', 
	doConnect: 'connecting to MQTT service', 
	doCallWaiter: 'calling waiter', 
	updateTable: 'updating table'
})

/* ******************************
 * Constants: BROADCAST_MESSAGES
 * purpose: lists broadcast messages
 * ****************************** */
.constant('BROADCAST_MESSAGES', {
	reloadCustomerOrders: 'reloadCustomerOrders', 
	reloadOrders: 'reloadOrders'
});