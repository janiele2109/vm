USE `jangerte_vm`;

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
	userId			INT NOT NULL,
	DateCreated 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (wordlistId, userId)
);

CREATE TABLE IF NOT EXISTS `word`(
	wordId      	INT NOT NULL AUTO_INCREMENT,
	word 			VARCHAR(50) NOT NULL,
	partOfSpeech	VARCHAR(50) NOT NULL,
	pronunciation	VARCHAR(50) NOT NULL,
	wordlistId    	INT NOT NULL,
	userId			INT NOT NULL,
	DateCreated 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (wordId, partOfSpeech, wordlistId, userId)
);

CREATE TABLE IF NOT EXISTS `wordMeaning`(
	wordMeaningId  	INT NOT NULL AUTO_INCREMENT,
	meaning			longtext NOT NULL,
	nativemeaning	longtext NOT NULL,
	wordId    		INT NOT NULL,
	PRIMARY KEY (wordMeaningId, wordId)
);

CREATE TABLE IF NOT EXISTS `wordExample`(
	wordExampleId  	INT NOT NULL AUTO_INCREMENT,
	example			longtext NOT NULL,
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
("janie", "123", "janiele2109@gmail.com", "Janie", "Janie Le", 1),
("sophie", "123", "janiele2109@gmail.com", "Sophie", "Sophie Le", 1)