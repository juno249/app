USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @orderreference_code = "cWDDDpmFb5hRCG8neSNHdWzzcSnzTL";
SET @customer_username= "johnvlim";

INSERT INTO orderreferences(
	orderreference_code, 
	customer_username
)
VALUES(
	@orderreference_code, 
	@customer_username
);