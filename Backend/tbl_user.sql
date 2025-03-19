USE mainDb

CREATE TABLE user (
    id VARCHAR(255) PRIMARY KEY, -- Email TSP for the authentification
    password VARCHAR(255) NOT NULL, -- Password
    username TEXT NOT NULL, 
    -- profilePicture BLOB -- profile picture directly stored in the data base (max 65 Ko -> compress pictures)
);


