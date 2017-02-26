USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @customer_username = "johnvlim";
SET @company_name = "Max's";
SET @branch_name = "Ermita";

INSERT INTO customers(
	customer_username, 
	company_name, 
	branch_name
)
VALUES(
	@customer_username, 
	@company_name, 
	@branch_name
);