USE mainDb;

CREATE TABLE commentLikes (
    likeId INTEGER AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,  
    mealId INTEGER NOT NULL,
    commentId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (mealId) REFERENCES meals(mealId),
    FOREIGN KEY (commentId) REFERENCES comments(commentId)
);
