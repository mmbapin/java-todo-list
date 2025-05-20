CREATE DATABASE  IF NOT EXISTS `todo_directory`;
USE `todo_directory`;

--
-- Table structure for table `todo`
--

DROP TABLE IF EXISTS `todo`;

CREATE TABLE `todo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_name` varchar(45) DEFAULT NULL,
  `assign_person_name` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Data for table `employee`
--

INSERT INTO `todo` VALUES 
	(1,'Read Book','Andrews','To Do'),
  (2,'Drink Water','Ithan','Pending'),
  (3,'Go to Gym','Jhon','Done'),
  (4,'Go to Office','Mitchel','To Do'),
  (5,'Go to Home','Zia','Done'),
  (6,'Go to Park','Shishir','To Do');

