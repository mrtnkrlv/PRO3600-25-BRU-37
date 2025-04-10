USE mainDb;

CREATE TABLE commentaryLikes (
    likeId INTEGER AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,  
    mealId INTEGER NOT NULL,
    commentaryId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (mealId) REFERENCES meals(mealId),
    FOREIGN KEY (commentaryId) REFERENCES commentary(commentaryId)
);
