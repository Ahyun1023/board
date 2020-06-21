CREATE DATABASE board;

CREATE TABLE `board`.`comment` (
  `comment_id` INT NOT NULL,
  `id` INT NOT NULL,
  `name` VARCHAR(20) NOT NULL,
  `date` DATETIME NOT NULL,
  `content` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`comment_id`));

CREATE TABLE `board`.`post` (
  `id` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `content` VARCHAR(1000) NOT NULL,
  `name` VARCHAR(20) NOT NULL,
  `view` INT NOT NULL,
  `photo` VARCHAR(1000) NULL,
  PRIMARY KEY (`id`));
  
  CREATE TABLE `board`.`users` (
  `id` VARCHAR(45) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `createdTime` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);
