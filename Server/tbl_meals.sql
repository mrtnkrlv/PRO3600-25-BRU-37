USE mainDb;

-- ADD: mealImage LONGBLOB 

CREATE TABLE meals (
<<<<<<< Updated upstream
  mealId INTEGER PRIMARY KEY,
  mealName VARCHAR(255) NOT NULL,
  likes INTEGER DEFAULT 0,
  positionInWeek INTEGER, -- Between 0 and 5
  averageRating DECIMAL(3,2) DEFAULT 0.00, -- Nouvelle colonne
  ratingCount INTEGER DEFAULT 0 -- Nouvelle colonne
=======
    mealId INTEGER PRIMARY KEY,
    mealName VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0,
    positionInWeek INTEGER -- Between 0 and 5, represents day of the week (meals are refreshed weekly)

>>>>>>> Stashed changes
);
