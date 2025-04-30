USE mainDb

CREATE TABLE user (
    id VARCHAR(255) PRIMARY KEY, -- Email TSP for the authentification
    pwd VARCHAR(255) NOT NULL, -- Password
    username TEXT NOT NULL, -- Username
    accCreated BOOLEAN -- To check if the account has been created or not (for redirections)
    -- profilePicture BLOB -- profile picture directly stored in the data base (max 65 Ko -> compress pictures)
);


