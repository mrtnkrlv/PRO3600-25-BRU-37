USE mainDb;

-- ADD: mealImage LONGBLOB 

CREATE TABLE meals (
    mealId INTEGER PRIMARY KEY,
    mealName VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    positionInWeek INTEGER -- Between 1 and 5, represents day of the week (meals are refreshed weekly)
    averageRating DECIMAL(3,2) DEFAULT 0.00,
    ratingCount INT DEFAULT 0   
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    positionInWeek INTEGER -- Between 0 and 5, represents day of the week (meals are refreshed weekly)

>>>>>>> Stashed changes
);
