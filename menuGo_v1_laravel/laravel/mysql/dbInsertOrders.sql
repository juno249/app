USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @customer_username = "johnvlim";
SET @menuitem_id = "1001001001";
SET @table_id = 1;
SET @order_status = "sent";

INSERT INTO orders(
	customer_username, 
	menuitem_id,
	table_id, 
	order_status
)
VALUES(
	@customer_username, 
	@menuitem_id, 
	@table_id, 
	@order_status
);