USE mainDb;

-- ADD: mealImage LONGBLOB 

CREATE TABLE meals (
  mealId INTEGER PRIMARY KEY,
  mealName VARCHAR(255) NOT NULL,
  likes INTEGER DEFAULT 0,
  positionInWeek INTEGER, -- Between 0 and 5
  averageRating DECIMAL(3,2) DEFAULT 0.00, -- Nouvelle colonne
  ratingCount INTEGER DEFAULT 0 -- Nouvelle colonne
);
