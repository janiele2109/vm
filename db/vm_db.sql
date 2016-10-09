DROP DATABASE IF EXISTS `vm_db`;

CREATE DATABASE IF NOT EXISTS `vm_db`;

USE `vm_db`;

CREATE TABLE IF NOT EXISTS `users`(
	userId      INT NOT NULL AUTO_INCREMENT,
	userName    VARCHAR(30) NOT NULL,
	password    VARCHAR(30) NOT NULL,
	email       VARCHAR(50) NOT NULL,
	firstName   VARCHAR(30) NOT NULL,
	fullName    VARCHAR(30) NOT NULL,
	accType     INT NOT NULL,
	PRIMARY KEY (userId)
);

CREATE TABLE IF NOT EXISTS `wordlist`(
	wordlistId      INT NOT NULL AUTO_INCREMENT,
	wordlistName    VARCHAR(30) NOT NULL,
	PRIMARY KEY (wordlistId)
);

CREATE TABLE IF NOT EXISTS `word`(
	wordId      	INT NOT NULL AUTO_INCREMENT,
	word 			VARCHAR(50) NOT NULL,
	pronunciation	VARCHAR(50) NOT NULL,
	wordlistId    	INT NOT NULL,
	PRIMARY KEY (wordId, wordlistId)
);

CREATE TABLE IF NOT EXISTS `wordMeaning`(
	wordMeaningId  	INT NOT NULL AUTO_INCREMENT,
	meaning			VARCHAR(50) NOT NULL,
	wordId    		INT NOT NULL,
	PRIMARY KEY (wordMeaningId, wordId)
);

CREATE TABLE IF NOT EXISTS `wordExample`(
	wordExampleId  	INT NOT NULL AUTO_INCREMENT,
	example			VARCHAR(50) NOT NULL,
	wordMeaningId	INT NOT NULL,
	PRIMARY KEY (wordExampleId, wordMeaningId)
);

CREATE TABLE IF NOT EXISTS `sessionInfo`(
	sid VARCHAR(255) NOT NULL,
	value TEXT NOT NULL,
	expiration TIMESTAMP NOT NULL,
	PRIMARY KEY (sid)
);

INSERT INTO users(userName, password, email, firstName, fullName, accType) VALUES 
("asd", "123", "janiele2109@gmail.com", "Janie", "Janie Le", 1),
("sophiele", "mypass", "sophiele@gmail.com", "Sophie", "Sophie Le", 1);