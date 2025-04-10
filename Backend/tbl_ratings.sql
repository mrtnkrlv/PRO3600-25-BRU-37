CREATE TABLE ratings (
    mealId INT,
    userId VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    PRIMARY KEY (mealId, userId),  -- Création d'une clé primaire composite car un utilisateur ne peut noter un même plat qu'une fois
    FOREIGN KEY (mealId) REFERENCES meals(mealId),
    FOREIGN KEY (userId) REFERENCES user(id)
) ;