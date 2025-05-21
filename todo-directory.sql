CREATE DATABASE IF NOT EXISTS `todo_directory`;
USE `todo_directory`;

-- Table structure for table `person`
DROP TABLE IF EXISTS `person`;

CREATE TABLE `person` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- Data for table `person`
INSERT INTO `person` VALUES
(1, 'Andrews', 'andrews@example.com', NULL),
(2, 'Ithan', 'ithan@example.com', NULL),
(3, 'Jhon', 'jhon@example.com', NULL),
(4, 'Mitchel', 'mitchel@example.com', NULL),
(5, 'Zia', 'zia@example.com', NULL),
(6, 'Shishir', 'shishir@example.com', NULL);

-- Table structure for table `todo`
DROP TABLE IF EXISTS `todo`;

CREATE TABLE `todo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_name` varchar(45) DEFAULT NULL,
  `person_id` int DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_PERSON_idx` (`person_id`),
  CONSTRAINT `FK_PERSON` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- Data for table `todo`
INSERT INTO `todo` VALUES
(1, 'Read Book', 1, 'To Do'),
(2, 'Drink Water', 2, 'Pending'),
(3, 'Go to Gym', 3, 'Done'),
(4, 'Go to Office', 4, 'To Do'),
(5, 'Go to Home', 5, 'Done'),
(6, 'Go to Park', 6, 'To Do');