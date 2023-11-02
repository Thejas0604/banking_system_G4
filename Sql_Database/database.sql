-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: banking_system
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `account_no` varchar(20) NOT NULL,
  `customer_id` varchar(20) NOT NULL,
  `account_type` varchar(20) DEFAULT NULL,
  `branch_id` varchar(20) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `starting_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`account_no`),
  KEY `account_ibfk_1_idx` (`customer_id`),
  CONSTRAINT `account_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('C1','CUS3','current','BR1','2023-09-11',500000.00),('C2','CUS6','current','BR1','2023-10-10',350000.00),('C3','CUS8','current','BR1','2023-10-15',560000.00),('C4','CUS10','current','BR1','2023-11-01',10000.00),('S1','CUS1','savings','BR1','2023-05-10',100000.00),('S10','CUS5','savings','BR1','2023-11-01',1500.00),('S11','CUS5','savings','BR1','2023-11-01',1500.00),('S2','CUS2','savings','BR1','2023-05-10',50000.00),('S3','CUS4','savings','BR1','2023-05-17',20000.00),('S4','CUS5','savings','BR2','2023-06-01',1250000.00),('S5','CUS6','savings','BR1','2023-06-16',250000.00),('S6','CUS7','savings','BR2','2023-06-28',10000.00),('S7','CUS8','savings','BR1','2023-08-17',6000000.00),('S8','CUS9','savings','BR2','2023-09-17',5000.00),('S9','CUS10','savings','BR3','2023-10-17',350000.00);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_account_no` BEFORE INSERT ON `account` FOR EACH ROW BEGIN
    DECLARE last_id INT;
    DECLARE new_id INT;

    -- Find the last account_no based on account_type
    IF NEW.account_type = 'current' THEN
        SELECT MAX(CAST(SUBSTRING(account_no, 2) AS SIGNED)) INTO last_id FROM account WHERE account_type = 'current';
        SET new_id = IFNULL(last_id, 0) + 1;
        SET NEW.account_no = CONCAT('C', new_id);
    ELSEIF NEW.account_type = 'savings' THEN
        SELECT MAX(CAST(SUBSTRING(account_no, 2) AS SIGNED)) INTO last_id FROM account WHERE account_type = 'savings';
        SET new_id = IFNULL(last_id, 0) + 1;
        SET NEW.account_no = CONCAT('S', new_id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `branch_id` varchar(20) NOT NULL,
  `branch_name` varchar(50) DEFAULT NULL,
  `manager_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES ('BR1','Main Branch','2'),('BR2','Downtown Branch','3'),('BR3','West Branch','5');
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_branch_id` BEFORE INSERT ON `branch` FOR EACH ROW BEGIN
    DECLARE max_branch_id INT;
    SET max_branch_id = IFNULL((SELECT MAX(CAST(SUBSTRING(branch_id, 3) AS SIGNED)) FROM branch), 0);
    SET NEW.branch_id = CONCAT('BR', max_branch_id + 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `current_account`
--

DROP TABLE IF EXISTS `current_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `current_account` (
  `account_no` varchar(20) NOT NULL,
  `balance` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`account_no`),
  CONSTRAINT `current_account_ibfk_1` FOREIGN KEY (`account_no`) REFERENCES `account` (`account_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_account`
--

LOCK TABLES `current_account` WRITE;
/*!40000 ALTER TABLE `current_account` DISABLE KEYS */;
INSERT INTO `current_account` VALUES ('C1',500000.00),('C2',350000.00),('C3',560000.00),('C4',10000.00);
/*!40000 ALTER TABLE `current_account` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_current_account_no` BEFORE INSERT ON `current_account` FOR EACH ROW BEGIN
    DECLARE max_account_no INT;
    SET max_account_no = IFNULL((SELECT MAX(CAST(SUBSTRING(account_no, 2) AS SIGNED)) FROM current_account), 0);
    SET NEW.account_no = CONCAT('C', max_account_no + 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customer_id` varchar(20) NOT NULL,
  `customer_type` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `telephone` char(10) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('CUS1','person','John Doe','123 Main St','1234567890'),('CUS10','person','Mark Rober','655 Wood Road','7489512548'),('CUS2','person','Jane Smith','456 Elm St','9876543210'),('CUS3','organization','ABC Corp','789 Oak St','5555555555'),('CUS4','person','Tim Cook','565 Beverly Hills','7845123698'),('CUS5','person','bruce Wayne','556 Hill Street','9876543210'),('CUS6','organization','XYZ Company','456 Elm Street','2222222222'),('CUS7','person','Jane Doe','789 Maple Street','3333333333'),('CUS8','organization','Acme Corporation','1011 Pine Street','4444444444'),('CUS9','person','Peter Parker','1234 Queens Boulevard','8945762159');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `role` varchar(15) NOT NULL,
  `branch_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `employee_ibfk_2_idx` (`employee_id`) /*!80000 INVISIBLE */,
  KEY `employee_ibfk_1_idx` (`branch_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`),
  CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('EMP1','Mark Hall','Worker','BR1'),('EMP2','Clark Jhons','Manager','BR1'),('EMP3','Smith Cover','Manager','BR2'),('EMP4','Jason Bank','Worker','BR2'),('EMP5','Walter White','Manager','BR3'),('EMP6','Jesse Pink','Worker','BR3');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fixed_deposit`
--

DROP TABLE IF EXISTS `fixed_deposit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fixed_deposit` (
  `fd_id` varchar(20) NOT NULL,
  `account_no` varchar(20) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `rate` decimal(4,2) DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`fd_id`),
  KEY `fixed_deposit_ibfk_1_idx` (`account_no`),
  CONSTRAINT `fixed_deposit_ibfk_1` FOREIGN KEY (`account_no`) REFERENCES `savings_account` (`account_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fixed_deposit`
--

LOCK TABLES `fixed_deposit` WRITE;
/*!40000 ALTER TABLE `fixed_deposit` DISABLE KEYS */;
INSERT INTO `fixed_deposit` VALUES ('FD1','S1',250000.00,'2023-06-20',12,7.50,'2024-06-20 00:00:00'),('FD2','S2',400000.00,'2023-06-21',12,7.50,'2024-06-21 00:00:00'),('FD3','S4',50000.00,'2023-07-15',24,8.50,'2025-07-15 00:00:00'),('FD4','S6',1000000.00,'2023-08-02',12,7.50,'2024-08-02 00:00:00'),('FD5','S7',150000.00,'2023-08-20',36,9.50,'2026-08-20 00:00:00'),('FD6','S8',300000.00,'2023-09-20',6,9.50,'2024-03-20 00:00:00'),('FD7','S9',50000.00,'2023-10-20',12,7.50,'2024-10-20 00:00:00');
/*!40000 ALTER TABLE `fixed_deposit` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_fd_id` BEFORE INSERT ON `fixed_deposit` FOR EACH ROW BEGIN
    DECLARE max_fd_id INT;
    SET max_fd_id = IFNULL((SELECT MAX(CAST(SUBSTRING(fd_id, 3) AS SIGNED)) FROM fixed_deposit), 0);
    SET NEW.fd_id = CONCAT('FD', max_fd_id + 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_fixed_deposit_update` BEFORE UPDATE ON `fixed_deposit` FOR EACH ROW SET NEW.end_date = DATE_ADD(NEW.start_date, INTERVAL NEW.duration MONTH) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `installement`
--

DROP TABLE IF EXISTS `installement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installement` (
  `installement_id` varchar(50) NOT NULL,
  `ins_amount` int DEFAULT NULL,
  `date_settled` date DEFAULT NULL,
  `loan_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`installement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installement`
--

LOCK TABLES `installement` WRITE;
/*!40000 ALTER TABLE `installement` DISABLE KEYS */;
/*!40000 ALTER TABLE `installement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan`
--

DROP TABLE IF EXISTS `loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan` (
  `loan_id` varchar(20) NOT NULL,
  `fd_id` varchar(20) DEFAULT NULL,
  `loan_amount` decimal(10,2) DEFAULT NULL,
  `interest_rate` decimal(4,2) DEFAULT NULL,
  `total_installments` int DEFAULT NULL,
  `remaining_installments` int DEFAULT NULL,
  `installement_amount` decimal(10,2) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `installment_due_date` date DEFAULT NULL,
  PRIMARY KEY (`loan_id`),
  KEY `loan_ibfk_1_idx` (`fd_id`),
  CONSTRAINT `loan_ibfk_1` FOREIGN KEY (`fd_id`) REFERENCES `fixed_deposit` (`fd_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan`
--

LOCK TABLES `loan` WRITE;
/*!40000 ALTER TABLE `loan` DISABLE KEYS */;
INSERT INTO `loan` VALUES ('LN1','FD1',50000.00,12.50,12,10,4687.50,'2024-07-22','2023-07-22','2023-09-22'),('LN2','FD4',100000.00,13.50,24,22,4729.17,'2025-08-05','2023-08-05','2023-10-05'),('LN3','FD5',100000.00,12.50,12,11,9375.00,'2024-08-22','2023-08-22','2023-09-22'),('LN4','FD6',50000.00,13.50,24,24,2364.58,'2025-09-23','2023-09-23','2023-09-23'),('LN5',NULL,100000.00,12.50,12,12,9375.00,'2024-10-22','2023-10-22','2023-10-22'),('LN6','FD1',2000.00,12.00,12,12,186.67,'2024-11-02','2023-11-02','2023-11-02'),('LN7','FD2',2000.00,12.00,12,12,186.67,'2024-11-02','2023-11-02','2023-12-02');
/*!40000 ALTER TABLE `loan` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_installement_amount_insert` BEFORE INSERT ON `loan` FOR EACH ROW SET NEW.installement_amount = (((NEW.loan_amount * NEW.interest_rate/100) + (NEW.loan_amount)) / (NEW.total_installments)) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_due_date_insert` BEFORE INSERT ON `loan` FOR EACH ROW SET NEW.due_date = DATE_ADD(NEW.start_date, INTERVAL NEW.total_installments MONTH) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_loan_id` BEFORE INSERT ON `loan` FOR EACH ROW BEGIN
    DECLARE max_loan_id INT;
    SET max_loan_id = IFNULL((SELECT MAX(CAST(SUBSTRING(loan_id, 3) AS SIGNED)) FROM loan), 0);
    SET NEW.loan_id = CONCAT('LN', max_loan_id + 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_installment_due_date_insert` BEFORE INSERT ON `loan` FOR EACH ROW SET NEW.installment_due_date = DATE_ADD(NEW.start_date, INTERVAL 1 MONTH) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_installement_amount_update` BEFORE UPDATE ON `loan` FOR EACH ROW SET NEW.installement_amount = (((NEW.loan_amount * NEW.interest_rate/100) + (NEW.loan_amount)) / (NEW.total_installments)) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_due_date_update` BEFORE UPDATE ON `loan` FOR EACH ROW SET NEW.due_date = DATE_ADD(NEW.start_date, INTERVAL NEW.total_installments MONTH) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_installment_due_date_update` BEFORE UPDATE ON `loan` FOR EACH ROW SET NEW.installment_due_date = DATE_ADD(NEW.start_date, INTERVAL (NEW.total_installments-NEW.remaining_installments) MONTH) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `loan_payment`
--

DROP TABLE IF EXISTS `loan_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_payment` (
  `payment_id` varchar(20) NOT NULL,
  `loan_id` varchar(20) DEFAULT NULL,
  `settle_date` date DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `loan_payment_ibfk_1_idx` (`loan_id`),
  CONSTRAINT `loan_payment_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `loan` (`loan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_payment`
--

LOCK TABLES `loan_payment` WRITE;
/*!40000 ALTER TABLE `loan_payment` DISABLE KEYS */;
INSERT INTO `loan_payment` VALUES ('LPAY1','LN1','2023-08-21'),('LPAY2','LN2','2023-09-04'),('LPAY3','LN3','2023-09-21'),('LPAY4','LN1','2023-09-21'),('LPAY5','LN2','2023-10-04');
/*!40000 ALTER TABLE `loan_payment` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_loan_paymrnt_id` BEFORE INSERT ON `loan_payment` FOR EACH ROW BEGIN
    DECLARE max_payment_id INT;
    SET max_payment_id = IFNULL((SELECT MAX(CAST(SUBSTRING(payment_id, 5) AS SIGNED)) FROM loan_payment), 0);
    SET NEW.payment_id = CONCAT('LPAY', max_payment_id + 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `loan_request`
--

DROP TABLE IF EXISTS `loan_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_request` (
  `request_id` varchar(20) NOT NULL,
  `loan_id` varchar(20) DEFAULT NULL,
  `customer_id` varchar(20) DEFAULT NULL,
  `loan_amount` decimal(10,2) DEFAULT NULL,
  `interest_rate` decimal(4,2) DEFAULT NULL,
  `approval_status` tinyint DEFAULT NULL,
  `employee_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `loan_request_ibfk_1_idx` (`customer_id`),
  KEY `loan_request_ibfk_2_idx` (`loan_id`),
  CONSTRAINT `loan_request_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `loan_request_ibfk_2` FOREIGN KEY (`loan_id`) REFERENCES `loan` (`loan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_request`
--

LOCK TABLES `loan_request` WRITE;
/*!40000 ALTER TABLE `loan_request` DISABLE KEYS */;
INSERT INTO `loan_request` VALUES ('LREQ1','LN5','CUS10',100000.00,12.50,1,'EMP5');
/*!40000 ALTER TABLE `loan_request` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_loan_request_id` BEFORE INSERT ON `loan_request` FOR EACH ROW BEGIN
    DECLARE max_request_id INT;
    SET max_request_id = IFNULL((SELECT MAX(CAST(SUBSTRING(request_id, 5) AS SIGNED)) FROM loan_request), 0);
    SET NEW.request_id = CONCAT('LREQ', max_request_id + 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization` (
  `customer_id` varchar(20) NOT NULL,
  `type` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  CONSTRAINT `organization_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization`
--

LOCK TABLES `organization` WRITE;
/*!40000 ALTER TABLE `organization` DISABLE KEYS */;
INSERT INTO `organization` VALUES ('CUS3','NGO'),('CUS6','Company'),('CUS8','Company');
/*!40000 ALTER TABLE `organization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `customer_id` varchar(20) NOT NULL,
  `age` int DEFAULT NULL,
  `nic` char(12) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  CONSTRAINT `person_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES ('CUS1',20,'1234569789'),('CUS10',36,'2352648712'),('CUS2',35,'9999999995'),('CUS4',50,'5959595965'),('CUS5',70,'8888888888'),('CUS7',13,'7878787854'),('CUS9',8,'1025647895');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_account`
--

DROP TABLE IF EXISTS `savings_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_account` (
  `account_no` varchar(20) NOT NULL,
  `account_type` varchar(15) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT NULL,
  `remaining_withdrawals` int DEFAULT NULL,
  PRIMARY KEY (`account_no`),
  KEY `savings_account_ibfk_2_idx1` (`account_type`),
  CONSTRAINT `savings_account_ibfk_1` FOREIGN KEY (`account_no`) REFERENCES `account` (`account_no`),
  CONSTRAINT `savings_account_ibfk_2` FOREIGN KEY (`account_type`) REFERENCES `savings_account_type` (`account_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_account`
--

LOCK TABLES `savings_account` WRITE;
/*!40000 ALTER TABLE `savings_account` DISABLE KEYS */;
INSERT INTO `savings_account` VALUES ('S1','Adult',72000.00,5),('S2','Adult',67000.00,3),('S3','Adult',6500.00,2),('S4','Senior',1240000.00,5),('S5','organization',210000.00,4),('S6','Teen',9000.00,1),('S7','Organization',5500000.00,2),('S8','Children',5000.00,3),('S9','Adult',350000.00,5);
/*!40000 ALTER TABLE `savings_account` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_savings_account_no` BEFORE INSERT ON `savings_account` FOR EACH ROW BEGIN
    DECLARE max_account_no INT;
    SET max_account_no = IFNULL((SELECT MAX(CAST(SUBSTRING(account_no, 2) AS SIGNED)) FROM savings_account), 0);
    SET NEW.account_no = CONCAT('S', max_account_no + 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `savings_account_type`
--

DROP TABLE IF EXISTS `savings_account_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_account_type` (
  `account_type` varchar(15) NOT NULL,
  `age_needed` int DEFAULT NULL,
  `interest_rate` decimal(4,2) DEFAULT NULL,
  `minimum_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`account_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_account_type`
--

LOCK TABLES `savings_account_type` WRITE;
/*!40000 ALTER TABLE `savings_account_type` DISABLE KEYS */;
INSERT INTO `savings_account_type` VALUES ('Adult',18,10.00,1000.00),('Children',2,12.00,0.00),('organization',NULL,NULL,NULL),('Senior',60,13.00,1000.00),('Teen',12,11.00,500.00);
/*!40000 ALTER TABLE `savings_account_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` varchar(20) NOT NULL,
  `date` datetime DEFAULT NULL,
  `type` varchar(15) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `account_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `transactions_ibfk_1_idx` (`account_no`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`account_no`) REFERENCES `account` (`account_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES ('TRA1','2023-06-15 00:00:00','withdraw',5000.00,'S1'),('TRA2','2023-06-17 00:00:00','deposit',10000.00,'S2'),('TRA3','2023-06-17 00:00:00','deposit',1000.00,'S3'),('TRA4','2023-09-17 00:00:00','transfer',5000.00,'S4'),('TRA5','2023-10-31 11:43:49','transfer',10000.00,'S1'),('TRA6','2023-10-31 11:51:43','transfer',10000.00,'S1'),('TRA7','2023-10-31 12:00:03','transfer',10000.00,'S4'),('TRA8','2023-11-02 08:28:12','FD_open',250000.00,'S1'),('TRA9','2023-11-02 08:44:30','FD_open',2000.00,'S2');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_transaction_id` BEFORE INSERT ON `transactions` FOR EACH ROW BEGIN
    DECLARE max_transaction_id INT;
    SET max_transaction_id = IFNULL((SELECT MAX(CAST(SUBSTRING(transaction_id, 4) AS SIGNED)) FROM transactions), 0);
    SET NEW.transaction_id = CONCAT('TRA', max_transaction_id + 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `transfer`
--

DROP TABLE IF EXISTS `transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transfer` (
  `transfer_id` varchar(20) NOT NULL,
  `sender_id` varchar(20) NOT NULL,
  `receiver_id` varchar(20) NOT NULL,
  PRIMARY KEY (`transfer_id`),
  KEY `transfer_ibfk_2_idx` (`receiver_id`),
  KEY `transfer_ibfk_3_idx` (`sender_id`),
  CONSTRAINT `transfer_ibfk_1` FOREIGN KEY (`transfer_id`) REFERENCES `transactions` (`transaction_id`),
  CONSTRAINT `transfer_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `account` (`account_no`),
  CONSTRAINT `transfer_ibfk_3` FOREIGN KEY (`sender_id`) REFERENCES `transactions` (`account_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfer`
--

LOCK TABLES `transfer` WRITE;
/*!40000 ALTER TABLE `transfer` DISABLE KEYS */;
INSERT INTO `transfer` VALUES ('TRA4','S4','S5'),('TRA5','S1','S2'),('TRA6','S1','S2'),('TRA7','S4','S5');
/*!40000 ALTER TABLE `transfer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_name` varchar(20) NOT NULL,
  `password_hash` char(200) DEFAULT NULL,
  `user_id` varchar(20) NOT NULL,
  `user_type` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  KEY `user_ibfk_1_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('John Doe','$2a$10$abcdef','CUS1','customer'),('Mark Rober','$2a$10$123def','CUS10','customer'),('Jane Smith','$2a$10$123456','CUS2','customer'),('ABC Corp','$2a$10$789xyz','CUS3','customer'),('Tim Cook','$2a$10$pqr123','CUS4','employee'),('Bruce Wayne','$2a$10$xyz456','CUS5','customer'),('XYZ Company','$2a$10$mnopqr','CUS6','customer'),('Jane Doe','$2a$10$789abc','CUS7','customer'),('Acme Corporation','$2a$10$xyz789','CUS8','customer'),('Peter Parker','$2a$10$def456','CUS9','customer'),('Mark Hall','$2a$10$abcdef','EMP1','employee'),('Clark Jhons','$2a$10$abcdef','EMP2','employee'),('Smith Cover','$2a$10$abcdef','EMP3','employee'),('Jason Bank','$2a$10$abcdef','EMP4','employee'),('Walter White','$2a$10$abcdef','EMP5','employee'),('Jesse Pink','$2a$10$abcdef','EMP6','employee');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increment_last_user_id` BEFORE INSERT ON `user` FOR EACH ROW BEGIN
    DECLARE last_id INT;
    DECLARE new_id INT;

    -- Find the last user ID based on user_type
    IF NEW.user_type = 'customer' THEN
        SELECT MAX(cast(SUBSTRING(user_id, 4)as float)) INTO last_id FROM user WHERE user_type='customer';
        SET new_id = IFNULL(last_id, 0) + 1;
        SET NEW.user_id = CONCAT('CUS', new_id);
    ELSE
        IF NEW.user_type = 'employee' THEN
            SELECT MAX(cast(SUBSTRING(user_id, 4)as float)) INTO last_id FROM user WHERE user_type='employee';
            SET new_id = IFNULL(last_id, 0) + 1;
            SET NEW.user_id = CONCAT('EMP', new_id);
        END IF;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'banking_system'
--

--
-- Dumping routines for database 'banking_system'
--
/*!50003 DROP PROCEDURE IF EXISTS `applyFDLoan` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `applyFDLoan`(
  IN userId VARCHAR(20),
  IN loanAmount DECIMAL(10,2),
  IN loanDuration INT
)
BEGIN
  DECLARE originalFdAmount DECIMAL(10,2);
  DECLARE maxLoanAmount DECIMAL(10,2);
  DECLARE fdAccountId VARCHAR(20);
  DECLARE savingsAccountId VARCHAR(20);
  
  -- Get the savings Account_no into savingsAccountId
  SELECT account_no INTO savingsAccountId
  FROM account
  WHERE customer_id = userId AND account_type = "savings";

-- Get the FD_id into fdAccountId
  SELECT fd_id INTO fdAccountId
  FROM fixed_deposit
  WHERE account_no = savingsAccountId;
  
  -- Get the original FD amount for the user
  SELECT amount INTO originalFdAmount
  FROM fixed_deposit
  WHERE account_no IN (SELECT account_no FROM account WHERE customer_id = userId);

  -- Calculate the maximum loan amount based on FD amount
  SET maxLoanAmount = LEAST(originalFdAmount * 0.60, 500000.00);

  -- Check if the user meets the conditions
  IF originalFdAmount IS NOT NULL
    AND loanAmount <= maxLoanAmount
    AND loanDuration > 0 THEN

    -- Insert the loan record
    INSERT INTO loan (fd_id, loan_amount, interest_rate, total_installments, remaining_installments, start_date)
    VALUES (fdAccountId, loanAmount, 12.50, loanDuration, loanDuration, NOW());

	-- Deposit the FD amount into the savings account with a transaction record
    UPDATE savings_account
    SET balance = balance + loanAmount
    WHERE account_no = savingsAccountId;

    -- Insert a transaction record for the FD transfer
    INSERT INTO transactions (date, type, amount, account_no)
    VALUES (NOW(), 'FD_open', loanAmount, savingsAccountId);

    SELECT 'Loan successfully applied.' AS Result;

  ELSE
    SELECT 'Loan amount exceeded' AS Result;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `makeCurrentAccount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `makeCurrentAccount`(
    IN user_id VARCHAR(20),
    IN branch_id VARCHAR(20),
    IN start_date DATE,
    IN start_amount DECIMAL(10, 2),
    IN account_type VARCHAR(20)
)
BEGIN
    DECLARE new_account_no VARCHAR(20);
    
    -- Insert into the account table
    INSERT INTO account (customer_id, account_type, branch_id, start_date, starting_amount)
    VALUES (user_id, account_type, branch_id, start_date, start_amount);
    
    -- Get the auto-generated account_no for the newly created account
    SELECT account_no INTO new_account_no
    FROM account
    WHERE customer_id = user_id AND start_date = start_date
    AND account_type = account_type AND branch_id = branch_id
    LIMIT 1; -- Limit the result to one row

    -- Insert into the current_account table
    INSERT INTO current_account (account_no, balance)
    VALUES (new_account_no, start_amount);
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MakeMoneyTransfer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `MakeMoneyTransfer`(
    IN sender_id VARCHAR(20),
    IN receiver_id VARCHAR(20),
    IN transfer_amount DECIMAL(10,2)
)
BEGIN
    DECLARE sender_balance DECIMAL(10,2);
    DECLARE receiver_balance DECIMAL(10,2);
    DECLARE sender_account_type VARCHAR(20);
    DECLARE receiver_account_type VARCHAR(20);
    DECLARE new_transaction_id VARCHAR(20);

    -- Get the account types of the sender and receiver
    SELECT account_type INTO sender_account_type FROM account WHERE account_no = sender_id;
    SELECT account_type INTO receiver_account_type FROM account WHERE account_no = receiver_id;

    -- Check if both sender and receiver accounts exist and are not the same
    IF sender_account_type IS NOT NULL AND receiver_account_type IS NOT NULL AND sender_id != receiver_id THEN
        -- Get the current balance of the sender
        IF sender_account_type = 'current' THEN
            SELECT balance INTO sender_balance FROM current_account WHERE account_no = sender_id;
        ELSEIF sender_account_type = 'savings' THEN
            SELECT balance INTO sender_balance FROM savings_account WHERE account_no = sender_id;
        END IF;

        -- Check if the sender has enough balance for the transfer
        IF sender_balance >= transfer_amount THEN
            -- Update the sender's balance
            IF sender_account_type = 'current' THEN
                UPDATE current_account
                SET balance = sender_balance - transfer_amount
                WHERE account_no = sender_id;
            ELSEIF sender_account_type = 'savings' THEN
                UPDATE savings_account
                SET balance = sender_balance - transfer_amount
                WHERE account_no = sender_id;
            END IF;

            -- Get the current balance of the receiver
            IF receiver_account_type = 'current' THEN
                SELECT balance INTO receiver_balance FROM current_account WHERE account_no = receiver_id;
            ELSEIF receiver_account_type = 'savings' THEN
                SELECT balance INTO receiver_balance FROM savings_account WHERE account_no = receiver_id;
            END IF;

            -- Update the receiver's balance
            IF receiver_account_type = 'current' THEN
                UPDATE current_account
                SET balance = receiver_balance + transfer_amount
                WHERE account_no = receiver_id;
            ELSEIF receiver_account_type = 'savings' THEN
                UPDATE savings_account
                SET balance = receiver_balance + transfer_amount
                WHERE account_no = receiver_id;
            END IF;

            -- Insert a record into the transactions table for the transfer
            INSERT INTO transactions (date, type, amount, account_no)
            VALUES (NOW(), 'transfer', transfer_amount, sender_id);
            
            SELECT transaction_id INTO new_transaction_id
			FROM transactions
			WHERE account_no = sender_id AND date = NOW() AND type = 'transfer' AND amount = transfer_amount;

            -- Insert a record into the transfer table to track the transfer
            INSERT INTO transfer (transfer_id, sender_id, receiver_id)
            VALUES (new_transaction_id, sender_id, receiver_id);

            -- Commit the transaction
            COMMIT;
        ELSE
            -- Rollback the transaction if the sender doesn't have enough balance
            ROLLBACK;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance for the transfer';
        END IF;
    ELSE
        -- Rollback the transaction if sender or receiver accounts are not valid
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid sender or receiver account';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MakeSavingsAccount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `MakeSavingsAccount`(
    IN p_user_id VARCHAR(20),
    IN p_branch_id VARCHAR(20),
    IN p_savings_account_type VARCHAR(15),
    IN p_start_date DATE,
    IN p_start_amount DECIMAL(10, 2)
)
BEGIN
    -- Declare a variable to store the auto-generated account_no
    DECLARE new_account_no VARCHAR(20);

    -- Insert a record into the account table, which will auto-increment account_no
    INSERT INTO account (customer_id, account_type, branch_id, start_date, starting_amount)
    VALUES (p_user_id, "savings", p_branch_id, p_start_date, p_start_amount);

    -- Get the auto-generated account_no for the newly created account
    SELECT account_no INTO new_account_no
    FROM account
    WHERE customer_id = p_user_id AND start_date = p_start_date
    AND account_type = "savings" AND branch_id = p_branch_id
    LIMIT 1;

    -- Insert a record into the savings_account table
    INSERT INTO savings_account (account_no, account_type, balance, remaining_withdrawals)
    VALUES (new_account_no, p_savings_account_type, p_start_amount, 5); -- You may need to adjust the initial number of withdrawals
    
    -- Commit the transaction
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ValidateSavingsAccount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ValidateSavingsAccount`(IN p_account_no VARCHAR(20), OUT p_is_valid CHAR)
BEGIN
    DECLARE v_count INT;

    -- Check if the provided account number exists in the "savings_account" table.
    SELECT COUNT(*) INTO v_count
    FROM savings_account
    WHERE account_no = p_account_no;

    -- If the count is greater than 0, the account is valid; otherwise, it's invalid.
    IF v_count > 0 THEN
        SET p_is_valid = "1";
    ELSE
        SET p_is_valid = "0";
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-02  8:59:01
