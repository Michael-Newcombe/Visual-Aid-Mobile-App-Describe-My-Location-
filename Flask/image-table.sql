CREATE TABLE `images` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(50) NOT NULL,
  `captions` text(150) NOT NULL,
  `score` tinyint(11) NOT NULL,
  `comments` text(150),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB;






