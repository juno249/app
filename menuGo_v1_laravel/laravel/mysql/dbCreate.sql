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
 
USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @customer_username = "johnvlim";
SET @customer_password = "XxabcxX";
SET @customer_name_fname = "John Victor";
SET @customer_name_mname = "M";
SET @customer_name_lname = "Lim";
SET @customer_role = "administrator";
SET @customer_gender = "male";
SET @customer_address_house_building = "Unit 202, 2F, GKK Building";
SET @customer_address_street = "Sto. Sepulcro St.";
SET @customer_address_district = "Paco";
SET @customer_address_city = "Manila";
SET @customer_address_postalcode = "1007";
SET @customer_address_country = "Philippines";
SET @customer_mobile = "09499200458";
SET @customer_email = "johnvictorlim01@gmail.com";
SET @customer_birthday_month = "October";
SET @customer_birthday_date = 12;
SET @customer_birthday_year = 1992;

INSERT INTO customers(
	customer_username, 
	customer_password, 
	customer_name_fname, 
	customer_name_mname, 
	customer_name_lname, 
	customer_role, 
	customer_gender, 
	customer_address_house_building, 
	customer_address_street, 
	customer_address_district, 
	customer_address_city, 
	customer_address_postalcode, 
	customer_address_country, 
	customer_mobile, 
	customer_email, 
	customer_birthday_month, 
	customer_birthday_date, 
	customer_birthday_year
)
VALUES(
	@customer_username, 
	@customer_password, 
	@customer_name_fname, 
	@customer_name_mname, 
	@customer_name_lname, 
	@customer_role, 
	@customer_gender, 
	@customer_address_house_building, 
	@customer_address_street, 
	@customer_address_district, 
	@customer_address_city, 
	@customer_address_postalcode, 
	@customer_address_country, 
	@customer_mobile, 
	@customer_email, 
	@customer_birthday_month, 
	@customer_birthday_date, 
	@customer_birthday_year
);

# ==========
# RECORD 2
# ==========
SET @customer_username = "XxabcxX";
SET @customer_password = "johnvlim";
SET @customer_name_fname = "John Victor";
SET @customer_name_mname = "M";
SET @customer_name_lname = "Lim";
SET @customer_role = "customer";
SET @customer_gender = null;
SET @customer_address_house_building = null;
SET @customer_address_street = null;
SET @customer_address_district = null;
SET @customer_address_city = null;
SET @customer_address_postalcode = null;
SET @customer_address_country = null;
SET @customer_mobile = null;
SET @customer_email = null;
SET @customer_birthday_month = null;
SET @customer_birthday_date = null;
SET @customer_birthday_year = null;

INSERT INTO customers(
	customer_username, 
	customer_password, 
	customer_name_fname, 
	customer_name_mname, 
	customer_name_lname, 
	customer_role, 
	customer_gender, 
	customer_address_house_building, 
	customer_address_street, 
	customer_address_district, 
	customer_address_city, 
	customer_address_postalcode, 
	customer_address_country, 
	customer_mobile, 
	customer_email, 
	customer_birthday_month, 
	customer_birthday_date, 
	customer_birthday_year
)
VALUES(
	@customer_username, 
	@customer_password, 
	@customer_name_fname, 
	@customer_name_mname, 
	@customer_name_lname, 
	@customer_role, 
	@customer_gender, 
	@customer_address_house_building, 
	@customer_address_street, 
	@customer_address_district, 
	@customer_address_city, 
	@customer_address_postalcode, 
	@customer_address_country, 
	@customer_mobile, 
	@customer_email, 
	@customer_birthday_month, 
	@customer_birthday_date, 
	@customer_birthday_year
);

USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @company_name = "Max's";
SET @company_desc = "Max's Restaurant";
SET @company_category = "Fine Dining"; 
SET @company_logo = "https://upload.wikimedia.org/wikipedia/en/d/de/Max's_Restaurant_logo.jpeg";

INSERT  INTO companies(
		company_name, 
		company_desc, 
		company_category, 
		company_logo
)	
VALUES(
	@company_name, 
	@company_desc, 
	@company_category, 
	@company_logo
);

USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @branch_name = "Ermita";
SET @company_name = "Max's";
SET @branch_address_house_building = "4/F Robinsons Place Manila";
SET @branch_address_street = "Adriatico St.";
SET @branch_address_district = "Ermita";
SET @branch_address_city = "Manila";
SET @branch_address_postalcode = "1007";
SET @branch_address_country = "Philippines";
SET @branch_hotline = "632-0970";

INSERT  INTO branches( 
		branch_name, 
		company_name, 
		branch_address_house_building, 
		branch_address_street, 
		branch_address_district, 
		branch_address_city, 
		branch_address_postalcode, 
		branch_address_country, 
		branch_hotline
)	
VALUES(
	@branch_name, 
	@company_name, 
	@branch_address_house_building, 
	@branch_address_street, 
	@branch_address_district, 
	@branch_address_city,
	@branch_address_postalcode, 
	@branch_address_country, 
	@branch_hotline
);
USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @menu_name = "Max's Fried Chicken";
SET @company_name = "Max's";
SET @menu_desc = "Max's Fried Chicken";
SET @menu_image = "http://sa.kapamilya.com/absnews/abscbnnews/media/news-special1/lifestyle/7/28/maxs.jpg";

INSERT INTO menus(
	menu_name, 
	company_name, 
	menu_desc, 
	menu_image
)
VALUES(
	@menu_name, 
	@company_name, 
	@menu_desc, 
	@menu_image
);

# ==========
# RECORD 2
# ==========
SET @menu_name = "Per Table Set Menus";
SET @company_name = "Max's";
SET @menu_desc = "Per Table Set Menus";
SET @menu_image = "http://2.bp.blogspot.com/-WdZwjXc0BhA/TfMylruaXuI/AAAAAAAABDM/u7YQ0eL6Cic/s1600/248279_10150206508333071_42321613070_7072803_7272085_n.jpg";

INSERT INTO menus(
	menu_name, 
	company_name, 
	menu_desc, 
	menu_image
)
VALUES(
	@menu_name, 
	@company_name, 
	@menu_desc, 
	@menu_image
);

# ==========
# RECORD 3
# ==========
SET @menu_name = "Holiday Promo";
SET @company_name = "Max's";
SET @menu_desc = "Holiday Promo";
SET @menu_image = "http://outoftownblog.com/wp-content/uploads/2013/12/JPEG02.jpg";

INSERT INTO menus(
	menu_name, 
	company_name, 
	menu_desc, 
	menu_image
)
VALUES(
	@menu_name, 
	@company_name, 
	@menu_desc, 
	@menu_image
);

# ==========
# RECORD 4
# ==========
SET @menu_name = "Max's Corner Bakery";
SET @company_name = "Max's";
SET @menu_desc = "Max's Corner Bakery";
SET @menu_image = "http://www.raindeocampo.com/wp-content/uploads/2012/12/66011_10151202425798071_1977820677_n.jpg";

INSERT INTO menus(
	menu_name, 
	company_name, 
	menu_desc, 
	menu_image
)
VALUES(
	@menu_name, 
	@company_name, 
	@menu_desc, 
	@menu_image
);

# ==========
# RECORD 5
# ==========
SET @menu_name = "Max's Combo Meals";
SET @company_name = "Max's";
SET @menu_desc = "Max's Combo Meals";
SET @menu_image = "http://www.24h.ae/upload/product/item/full/14Jan2016_15-10-07set_menu_a.jpg";

INSERT INTO menus(
	menu_name, 
	company_name, 
	menu_desc, 
	menu_image
)
VALUES(
	@menu_name, 
	@company_name, 
	@menu_desc, 
	@menu_image
);

USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @table_number = 1;
SET @branch_id = 1;
SET @table_capacity = 5;
SET @table_status = "statusVacant";

INSERT INTO tables(
	table_number, 
	branch_id, 
	table_capacity, 
	table_status
)
VALUES(
	@table_number, 
	@branch_id, 
	@table_capacity, 
	@table_status
);

# ==========
# RECORD 2
# ==========
SET @table_number = 2;
SET @branch_id = 1;
SET @table_capacity = 5;
SET @table_status = "statusVacant";

INSERT INTO tables(
	table_number, 
	branch_id, 
	table_capacity, 
	table_status
)
VALUES(
	@table_number, 
	@branch_id, 
	@table_capacity, 
	@table_status
);

USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @menuitem_code = "0000000000";
SET @menu_id = 1;
SET @menuitem_name = "Family Fried Chicken (Whole)";
SET @menuitem_desc = "The original and classic fried chicken that made Max's world famous and a Filipino institution. Golden fried to perfection with a unique blend of secret spices. Truly Sarap to the Bones";
SET @menuitem_price = 548.90;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443579955_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 2
# ==========
SET @menuitem_code = "0000000001";
SET @menu_id = 1;
SET @menuitem_name = "Family Chicken Basket";
SET @menuitem_desc = "Eight pieces of Max's Fried Chicken™ (legs and thighs) cooked to an unmatched perfection to satisfy your craving. This is the original and classic fried chicken that made Max's world famous and a Filipino institution. Golden fried to perfection with a unique blend of secret spices.";
SET @menuitem_price = 517.0;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443579901_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 3
# ==========
SET @menuitem_code = "0000000002";
SET @menu_id = 1;
SET @menuitem_name = "Regular Fried Chicken (Whole)";
SET @menuitem_desc = "The original classic fried chicken that made Max's popular. It is cooked to golden perfection, processed in a very unique way which gives it the unforgettable Sarap to the Bones quality, spiced just right and totally MSG-free.";
SET @menuitem_price = 449.90;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443580053_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 4
# ==========
SET @menuitem_code = "0000000003";
SET @menu_id = 1;
SET @menuitem_name = "Spring Chicken (Whole)";
SET @menuitem_desc = "The distinctive characteristic of Max's Spring Chicken™' is the tenderness of its meat, since the chicken is harvested at a young age. Otherwise, it is the same original and classic fried chicken that made Max's world famous and a Filipino institution. Golden fried to perfection with a unique blend of secret spices. Truly sarap to the bones!";
SET @menuitem_price = 374.00;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443580103_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 5
# ==========
SET @menuitem_code = "0000000004";
SET @menu_id = 1;
SET @menuitem_name = "Family Fried Chicken (Half)";
SET @menuitem_desc = "The original classic fried chicken that made Max's popular. It is cooked to golden perfection, processed in a very unique way which gives it the unforgettable Sarap to the bones™ quality, spiced just right and totally MSG free.";
SET @menuitem_price = 279.40;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443579933_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 6
# ==========
SET @menuitem_code = "0000000005";
SET @menu_id = 2;
SET @menuitem_name = "Per Table Menu A (Full Set)";
SET @menuitem_desc = "A complete set menu, from soup to dessert, good for ten people, just right for the whole family and friends. Includes the following dishes: Max's Fried Chicken™, Soup of the Day, Pancit Canton, Chopsuey, Lumpiang Shanghai, Plain Rice, Caramel Bar™ Serves 10 people.";
SET @menuitem_price = 3298.90;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1470803878_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 7
# ==========
SET @menuitem_code = "0000000006";
SET @menu_id = 2;
SET @menuitem_name = "Per Table Menu B (Full Set)";
SET @menuitem_desc = "A complete set menu, from soup to dessert, good for ten people, just right for the whole family and friends. Includes the following dishes: Max's Fried Chicken™, Soup of the Day, Oriental Beef with Mushroom, Sweet and Sour Fish Fillet, Pancit Canton, Plain Rice, Roasted Nuts, Frozen Fruit Salad Serves 10 people ";
SET @menuitem_price = 4332.90;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443590257_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 8
# ==========
SET @menuitem_code = "0000000007";
SET @menu_id = 2;
SET @menuitem_name = "Per Table Menu C (Full Set)";
SET @menuitem_desc = "A complete set menu, from soup to dessert, good for ten people, just right for the whole family. Includes the following dishes: Max's Fried Chicken™ Sinigang na Hipon, Boneless Bangus, Kare-Kare, Lechon Kawali, Plain Rice, Roasted Nuts, Buko Pandan Serves 10 people.";
SET @menuitem_price = 5135.90;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443590428_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 9
# ==========
SET @menuitem_code = "0000000008";
SET @menu_id = 2;
SET @menuitem_name = "Per Table Menu A (Half)";
SET @menuitem_desc = "A complete set menu, from soup to dessert, good for five people, just right for the whole family and friends. Includes the following dishes: Max's Fried Chicken™, Soup of the Day, Pancit Canton, Chopsuey, Lumpiang Shanghai, Plain Rice, Caramel Bar™ Serves 5 people.";
SET @menuitem_price = 1648.90;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443590208_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 10
# ==========
SET @menuitem_code = "0000000009";
SET @menu_id = 2;
SET @menuitem_name = "Per Table Menu B (Half)";
SET @menuitem_desc = "A complete set menu, from soup to dessert, just right for the whole family and friends. Includes the following dishes: Max's Fried Chicken™ Soup of the Day, Oriental Beef with Mushroom, Sweet and Sour Fish Fillet, Pancit Canton, Plain Rice, Roasted Nuts, Frozen Fruit Salad Serves 5 people.";
SET @menuitem_price = 2167.00;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443590414_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 11
# ==========
SET @menuitem_code = "0000000010";
SET @menu_id = 3;
SET @menuitem_name = "Holiday Delivery Duo";
SET @menuitem_desc = "1 Cater Tray Max's Fried Chicken & 1 Cater Tray Pancit Canton Large.";
SET @menuitem_price = 2198.90;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1480922327_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 12
# ==========
SET @menuitem_code = "0000000011";
SET @menu_id = 4;
SET @menuitem_name = "Carrot Cake";
SET @menuitem_desc = "Classic moist carrot cake with chopped walnuts, sweet vanilla cream cheese frosting and garnished with orange-green-white chocolate tiles.";
SET @menuitem_price = 715.00;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1481091332_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 13
# ==========
SET @menuitem_code = "0000000012";
SET @menu_id = 4;
SET @menuitem_name = "Red Velvet";
SET @menuitem_desc = "Classic red velvet butter cake with sweet vanilla cream cheese frosting and decorated with whipped cream rosettes and white chocolate curls on top.";
SET @menuitem_price = 654.50;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1481091486_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 14
# ==========
SET @menuitem_code = "0000000013";
SET @menu_id = 4;
SET @menuitem_name = "Chocolate Ganache";
SET @menuitem_desc = "A deeply chocolatey and moist chocolate butter cake with rich truffle icing and dark chocolate glaze, garnished with dark and white chocolate cut-outs.";
SET @menuitem_price = 654.50;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1481091691_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 15
# ==========
SET @menuitem_code = "0000000014";
SET @menu_id = 4;
SET @menuitem_name = "Chocolate Cream Fudge";
SET @menuitem_desc = "Sinful with every bite, this luscious chocolate cake is an indulgence hard to resist. Enriched by a creamy custard filling, coated with flavorful chocolate icing, and topped with chocolate logs, this is a real treat!";
SET @menuitem_price = 654.50;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443577265_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 16
# ==========
SET @menuitem_code = "0000000015";
SET @menu_id = 4;
SET @menuitem_name = "Black Forest";
SET @menuitem_desc = "The heavenly goodness of Max's Corner Bakery's Chocolate Moist Cake infused with rich strawberry filling and topped generously with whipped cream and cherries. Garnished with chocolate shavings to perfection, this best-seller is a delicious indulgence.";
SET @menuitem_price = 654.50;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443576942_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 17
# ==========
SET @menuitem_code = "0000000016";
SET @menu_id = 5;
SET @menuitem_name = "Chicken Dinner Meal";
SET @menuitem_desc = "A half order of Max's Regular Fried Chicken complemented with Soup of the Day and Plain rice. Comes with softdrink and Caramel Bar™.";
SET @menuitem_price = 332.20;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443576281_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 18
# ==========
SET @menuitem_code = "0000000017";
SET @menu_id = 5;
SET @menuitem_name = "Spring Chicken Meal";
SET @menuitem_desc = "One-half of Max's Spring Chicken™ served with Soup of the Day, Steamed rice and softdrink capped off with a Caramel Bar™ for dessert.";
SET @menuitem_price = 299.20;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443576361_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 19
# ==========
SET @menuitem_code = "0000000018";
SET @menu_id = 5;
SET @menuitem_name = "Chopseuy Meal";
SET @menuitem_desc = "A serving of fresh mixed vegetables, pork and shrimp sauteed in thick sauce. This comes with a serving of steamed rice and a quarter of Max's Fried Chicken™. An excellent meal for vegetable lovers.";
SET @menuitem_price = 282.70;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443576309_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 20
# ==========
SET @menuitem_code = "0000000019";
SET @menu_id = 5;
SET @menuitem_name = "Platter Meal";
SET @menuitem_desc = "A quarter of Max's mouthwatering Fried Chicken, a serving of steamed rice and serving of Pancit Canton. Served with a drink and Max's very own Caramel Bar™ as dessert.";
SET @menuitem_price = 282.70;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443576346_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

# ==========
# RECORD 21
# ==========
SET @menuitem_code = "0000000020";
SET @menu_id = 5;
SET @menuitem_name = "Fiesta Plate Meal";
SET @menuitem_desc = "Max's quarter fried chicken that comes with (choices) Fresh or Fried lumpiang ubod and Steamed rice, a piece of Caramel Bar™ and a refreshing drink.";
SET @menuitem_price = 275.00;
SET @menuitem_image = "http://delivery.maxschicken.com/product/1443576328_thumb.jpg";

INSERT INTO menuitems(
	menuitem_code, 
	menu_id, 
	menuitem_name, 
	menuitem_desc, 
	menuitem_price, 
	menuitem_image
)
VALUES(
	@menuitem_code, 
	@menu_id, 
	@menuitem_name, 
	@menuitem_desc, 
	@menuitem_price, 
	@menuitem_image
);

USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @customer_username = "johnvlim";
SET @company_name = "Max's";
SET @branch_name = "Ermita";

INSERT INTO customers_companies_branches(
	customer_username, 
	company_name, 
	branch_name
)
VALUES(
	@customer_username, 
	@company_name, 
	@branch_name
);