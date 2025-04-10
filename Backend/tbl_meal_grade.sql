USE mainDb; 

CREATE TABLE mealGrades (
    gradeId INTEGER AUTO_INCREMENT PRIMARY KEY,
    mealId INTEGER NOT NULL,
    userId VARCHAR(255) NOT NULL,
    grade INTEGER CHECK (grade BETWEEN 0 AND 5),
    UNIQUE (mealId, userId),
    FOREIGN KEY (mealId) REFERENCES meals(mealId),
    FOREIGN KEY (userId) REFERENCES user(id)
);