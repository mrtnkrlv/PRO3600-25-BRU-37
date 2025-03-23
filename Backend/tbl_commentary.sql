USE mainDb;


CREATE TABLE commentary (
    commentaryId INTEGER AUTO_INCREMENT PRIMARY KEY,
    mealId INTEGER NOT NULL,
    userId VARCHAR(255) NOT NULL,  
    commentaryParentId INTEGER, -- to be able to respond to a commentary 
    dateCreation DATE DEFAULT (CURRENT_DATE),
    content TEXT NOT null,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    FOREIGN KEY (mealId) REFERENCES meals(mealId), 
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (commentaryParentId) REFERENCES commentary(commentaryId) 
);