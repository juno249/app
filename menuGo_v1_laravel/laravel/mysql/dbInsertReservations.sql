USE ziplogic;

# ==========
# RECORD 1
# ==========
SET @reservation_code = "cWDDDpmFb5hRCG8neSNHdWzzcSnzTL";
SET @customer_username = "johnvlim";
SET @orderreference_code = "cWDDDpmFb5hRCG8neSNHdWzzcSnzTL";
SET @reservation_eta = "2017-03-14 12:37:00";
SET @reservation_paymentmode = "cash";
SET @reservation_servicetime = "2017-03-14 12:37:00";
SET @reservation_status = "pending";

INSERT INTO reservations(
	reservation_code, 
	customer_username, 
	orderreference_code, 
	reservation_eta, 
	reservation_paymentmode, 
	reservation_servicetime, 
	reservation_status
)
VALUES(
	@reservation_code, 
	@customer_username, 
	@orderreference_code, 
	@reservation_eta, 
	@reservation_paymentmode, 
	@reservation_servicetime, 
	@reservation_status
);