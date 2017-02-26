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