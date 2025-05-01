USE mainDb

CREATE TABLE user (
    id VARCHAR(255) PRIMARY KEY, -- TSP email for authentification
    pwd VARCHAR(255) NOT NULL, -- Password
    username TEXT NOT NULL, -- Username
    accCreated BOOLEAN -- To check if the account has been created or not (for redirections)
);


