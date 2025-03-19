CREATE DATABASE mainDb;
USE mainDb;

CREATE TABLE mainTbl (
    id integer PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    contents TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO mainTbl (title, contents)
VALUES
("USR1", "Description 1"),
("USR2", "Description 2");

