USE mainDb;

CREATE TABLE meals (
    mealId VARCHAR(255) NOT NULL PRIMARY KEY,
    mealName VARCHAR(255) NOT NULL,
    positionInWeek INTEGER, -- Between 1 and 5, represents day of the week (meals are refreshed weekly)
    mealImage LONGBLOB 
);


