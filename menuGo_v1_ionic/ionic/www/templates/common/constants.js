angular
.module('starter')
.constant('APP_CONFIG', {
	'company_name':	"Max's", 
	'branch_name': 'Ermita'
})

.constant('API_BASE_URL', 'http://localhost/api')

.constant('MQTT_CONFIG', {
	host: 'localhost', 
	port: 1884, 
	topicWaiterRequest: 'topicWaiterRequest', 
	topicWaiterResponse: 'topicWaiterResponse', 
	topicOrderSentAck: 'topicOrderSentAck'
})

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

.constant('COMPANIES_DB_FIELDS', {
	0: 'company_name', 
	1: 'company_desc', 
	2: 'company_logo'
})

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

.constant('MENUITEMS_DB_FIELDS', {
	0: 'menuitem_id', 
	1: 'menuitem_code', 
	2: 'menu_id', 
	3: 'menuitem_name', 
	4: 'menuitem_desc', 
	5: 'menuitem_price', 
	6: 'menuitem_image'
})

.constant('MENUS_DB_FIELDS', {
	0: 'menu_id', 
	1: 'company_name', 
	2: 'menu_name', 
	3: 'menu_desc', 
	4: 'menu_image'
})

.constant('ORDERS_DB_FIELDS', {
	0: 'order_id', 
	1: 'customer_username', 
	2: 'menuitem_id', 
	3: 'table_id', 
	4: 'order_timestamp', 
	5: 'order_status'
})

.constant('TABLES_DB_FIELDS', {
	0: 'table_id', 
	1: 'branch_id', 
	2: 'table_number', 
	3: 'table_capacity', 
	4: 'table_status'
})

.constant('ORDER_STATUS', [
	'statusSent', 
	'statusAck', 
	'statusCooking', 
	'statusServed', 
	'statusHistory'
])

.constant('TABLE_STATUS', [
	'statusVacant', 
	'statusOccupied'
])

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

.constant('USER_ROLES', {
	admin: 'userAdmin', 
	customer: 'userCustomer', 
	waiter: 'userWaiter', 
	cook: 'userCook'
})

.constant('BROADCAST_MESSAGES', {
	reloadCustomerOrders: 'reloadCustomerOrders', 
	reloadOrders: 'reloadOrders'
});