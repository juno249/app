USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @menuitem_id = "1";
SET @orderreference_code = "cWDDDpmFb5hRCG8neSNHdWzzcSnzTL";
SET @order_status = "sent";

INSERT INTO orders(
	menuitem_id, 
	orderreference_code, 
	order_status
)
VALUES(
	@menuitem_id, 
	@orderreference_code, 
	@order_status
);