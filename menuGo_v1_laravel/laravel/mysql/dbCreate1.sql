/*
 * DROP DB/SCHEMA IF EXISTS
 */
DROP DATABASE IF EXISTS ziplogic;

/*
 * CREATE DB/SCHEMA ziplogic
 */
CREATE DATABASE IF NOT EXISTS ziplogic;

/*
 * CREATE ziplogic.customers
 */
CREATE TABLE IF NOT EXISTS ziplogic.customers(
 	customer_username VARCHAR(30) NOT NULL, 
 	customer_password VARCHAR(100) NOT NULL, 
 	customer_name_fname VARCHAR(30) NOT NULL, 
 	customer_name_mname VARCHAR(30) NOT NULL, 
 	customer_name_lname VARCHAR(30) NOT NULL, 
 	customer_role varchar(30) NOT NULL, 
 	customer_gender VARCHAR(10), 
 	customer_address_house_building VARCHAR(30), 
 	customer_address_street VARCHAR(30), 
 	customer_address_district VARCHAR(30), 
 	customer_address_city VARCHAR(30), 
 	customer_address_postalcode VARCHAR(30), 
 	customer_address_country VARCHAR(30), 
 	customer_mobile VARCHAR(30), 
 	customer_email VARCHAR(30), 
 	customer_birthday_month VARCHAR(10), 
 	customer_birthday_date INT, 
 	customer_birthday_year INT, 
 	PRIMARY KEY(customer_username)
 );
 
 /*
  * CREATE ziplogic.companies
  */
 CREATE TABLE IF NOT EXISTS ziplogic.companies(
 	company_name VARCHAR(30) NOT NULL, 
 	company_desc VARCHAR(500) NOT NULL, 
 	company_category VARCHAR(30) NOT NULL, 
 	company_logo VARCHAR(500) NOT NULL, 
 	PRIMARY KEY(company_name)
 );
 
 /*
  * CREATE ziplogic.branches
  */
 CREATE TABLE IF NOT EXISTS ziplogic.branches(
 	branch_id INT NOT NULL AUTO_INCREMENT, 
 	branch_name VARCHAR(30) NOT NULL, 
 	company_name VARCHAR(30) NOT NULL, 
 	branch_address_house_building VARCHAR(30) NOT NULL, 
 	branch_address_street VARCHAR(30) NOT NULL, 
 	branch_address_district VARCHAR(30) NOT NULL, 
 	branch_address_city VARCHAR(30) NOT NULL, 
 	branch_address_postalcode VARCHAR(30) NOT NULL, 
 	branch_address_country VARCHAR(30) NOT NULL, 
 	branch_hotline VARCHAR(10) NOT NULL, 
 	PRIMARY KEY(branch_id), 
 	UNIQUE(branch_name, company_name), 
 	FOREIGN KEY(company_name) REFERENCES ziplogic.companies(company_name)
 );
 
 /*
  * CREATE ziplogic.tables
  * */
 CREATE TABLE IF NOT EXISTS ziplogic.tables(
 	table_id INT NOT NULL AUTO_INCREMENT,  
 	table_number INT NOT NULL, 
 	branch_id INT NOT NULL, 
 	table_capacity INT NOT NULL, 
 	table_status VARCHAR(30), 
 	PRIMARY KEY(table_id), 
 	UNIQUE(table_number, branch_id), 
 	FOREIGN KEY(branch_id) REFERENCES ziplogic.branches(branch_id)
 );
 
 /*
  * CREATE ziplogic.menus
  */
 CREATE TABLE IF NOT EXISTS ziplogic.menus(
 	menu_id INT NOT NULL AUTO_INCREMENT, 
 	menu_name VARCHAR(30) NOT NULL, 
 	company_name VARCHAR(30) NOT NULL, 
 	menu_desc VARCHAR(500) NOT NULL, 
 	menu_image VARCHAR(1000) NOT NULL, 
 	PRIMARY KEY(menu_id), 
 	UNIQUE(menu_name, company_name), 
 	FOREIGN KEY(company_name) REFERENCES ziplogic.companies(company_name)
 );
 
 /*
  * CREATE ziplogic.menuitems
  */
 CREATE TABLE IF NOT EXISTS ziplogic.menuitems(
 	menuitem_id INT NOT NULL AUTO_INCREMENT,
 	menuitem_code VARCHAR(10) NOT NULL, 
 	menu_id INT NOT NULL, 
 	menuitem_name VARCHAR(30) NOT NULL, 
 	menuitem_desc VARCHAR(500) NOT NULL,
 	menuitem_price DOUBLE NOT NULL, 
 	menuitem_image VARCHAR(500) NOT NULL, 
 	PRIMARY KEY(menuitem_id), 
 	UNIQUE(menuitem_code, menu_id), 
 	FOREIGN KEY(menu_id) REFERENCES ziplogic.menus(menu_id)
 );
 
 /*
  * CREATE ziplogic.orders
  * */
 CREATE TABLE IF NOT EXISTS ziplogic.orders(
	order_id INT NOT NULL AUTO_INCREMENT, 
	customer_username VARCHAR(30) NOT NULL, 
	menuitem_id INT NOT NULL, 
	table_id INT NOT NULL, 
	order_timestamp DATETIME NOT NULL DEFAULT NOW(), 
	order_status VARCHAR(30) NOT NULL, 
	PRIMARY KEY(order_id), 
	FOREIGN KEY(customer_username) REFERENCES ziplogic.customers(customer_username), 
	FOREIGN KEY(menuitem_id) REFERENCES ziplogic.menuitems(menuitem_id), 
	FOREIGN KEY(table_id) REFERENCES ziplogic.tables(table_id)
 );
 
 /*
  * CREATE ziplogic.customers_companies_branches
  * */
 CREATE TABLE IF NOT EXISTS ziplogic.customers_companies_branches(
 	customer_username VARCHAR(30) NOT NULL, 
 	company_name VARCHAR(30) NOT NULL, 
 	branch_name VARCHAR(30) NOT NULL, 
 	PRIMARY KEY(customer_username), 
 	FOREIGN KEY(customer_username) REFERENCES ziplogic.customers(customer_username), 
 	FOREIGN KEY(company_name) REFERENCES ziplogic.companies(company_name), 
 	FOREIGN KEY(branch_name) REFERENCES ziplogic.branches(branch_name)
 );