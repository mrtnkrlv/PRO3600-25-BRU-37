CREATE TABLE ratings (
    mealId INT NOT NULL,
    userId VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    PRIMARY KEY (mealId, userId),  -- Création d'une clé primaire composite car un utilisateur ne peut noter un même plat qu'une fois
    FOREIGN KEY (mealId) REFERENCES meals(mealId),
    FOREIGN KEY (userId) REFERENCES users(id)
)