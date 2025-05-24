import pool from './database.js'; // Import the pool 

/**
 * @module meals
 */

/**
 * Récupère tous les plats de la base de données, triés par leur position dans la semaine.
 * @async
 * @returns {Promise<Array>} Tableau d'objets représentant les plats.
 */
async function getMeals(){
    try {
        const result = await pool.query(`
          SELECT *
          FROM meals
          ORDER BY positionInWeek
            `);
        return result;
    }
    catch (error) {
        console.error(`Erreur dans la récupération des plats`, error);
    }
}

/**
 * Récupère un plat à partir de son identifiant.
 * @async
 * @param {number} mealId - Identifiant du plat.
 * @returns {Promise<Object|null>} Objet plat ou null si non trouvé.
 */
async function getMeal(mealId){
  try {
    const [result] = await pool.query(`
      SELECT *
      FROM meals
      WHERE mealId = ?
    `, [mealId]);
    
    return result[0] || null;
    
  } catch (error) {
    console.error(`Erreur lors de la récupération du plat ${mealId}:`, error);
    throw error;
  }
}

/**
 * Récupère l'identifiant d'un plat à partir de son nom.
 * @async
 * @param {string} mealName - Nom du plat.
 * @returns {Promise<number|null>} Identifiant du plat ou null si non trouvé.
 */
async function getMealByName(mealName){
    const [result] = await pool.query(`
      SELECT mealId as foodId
      FROM meals
      WHERE mealName = ?
    `, [mealName])
    
    const firstRow = result[0]

    if (firstRow) {
      return firstRow.foodId  // This is the ID value
    } else {
      return null  // Or handle no result case as you want
    }    
}

/**
 * Ajoute un nouveau plat dans la base de données.
 * @async
 * @param {number} mealId - Identifiant du plat.
 * @param {string} mealName - Nom du plat.
 * @param {number} positionInWeek - Position du plat dans la semaine (0-5).
 * @returns {Promise<Object>} Plat ajouté.
 * @throws {Error} Si la position ou l'ID est invalide.
 */
async function addMeal(mealId, mealName, positionInWeek) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check the position of meal you add
    if (!Number.isInteger(positionInWeek) || positionInWeek < 0 || positionInWeek > 5) {
      throw new Error('positionInWeek doit être un entier entre 0 (non placé) et 5');
    }
    // Check of the unicity of the ID
    const existingMeal = await getMeal(mealId);
    if (existingMeal) {
      throw new Error(`Le plat avec l'ID ${mealId} existe déjà`);
    }

    await connection.query(`
      INSERT INTO meals (mealId, mealName, positionInWeek)
      VALUES (?, ?, ?)
    `, [mealId, mealName, positionInWeek]);

    await connection.commit();
    return getMeal(mealId);
    
  } catch (error) {
    await connection.rollback();
    console.error('Erreur lors de l\'ajout du plat:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Supprime un plat et ses dépendances de la base de données.
 * @async
 * @param {number} mealId - Identifiant du plat à supprimer.
 * @returns {Promise<Object>} Résultat de la suppression.
 */
async function deleteMeal(mealId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Suppression des dépendances
    await connection.query('DELETE FROM ratings WHERE mealId = ?', [mealId]);
    await connection.query('DELETE FROM comments WHERE mealId = ?', [mealId]);
    
    // Suppression du plat
    await connection.query('DELETE FROM meals WHERE mealId = ?', [mealId]);
    
    await connection.commit();
    return { success: true };
    
  } catch (error) {
    await connection.rollback();
    console.error('Erreur lors de la suppression:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Récupère les plats programmés pour la semaine (position 1 à 5).
 * @async
 * @returns {Promise<Array>} Tableau des plats programmés.
 */
async function getScheduledMeals() {
  const [results] = await pool.query(`
    SELECT *
    FROM meals
    WHERE positionInWeek BETWEEN 1 AND 5
    ORDER BY positionInWeek ASC
  `);
  return results;
}

/**
 * Modifie la position d'un plat dans la semaine.
 * @async
 * @param {number} mealId - Identifiant du plat.
 * @param {number} newPosition - Nouvelle position (0-5).
 * @returns {Promise<Object>} Plat mis à jour.
 * @throws {Error} Si la position ou l'ID est invalide.
 */
async function updateMealPosition(mealId, newPosition) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Validation de la nouvelle position
    if (!Number.isInteger(newPosition) || newPosition < 0 || newPosition > 5) {
      throw new Error('La nouvelle position doit être un entier entre 0 (non placé) et 5');
    }

    // Vérification de l'existence du plat
    const [mealExists] = await connection.query(
      'SELECT * FROM meals WHERE mealId = ?',
      [mealId]
    );

    if (mealExists.length === 0) {
      throw new Error(`Aucun plat trouvé avec l'ID ${mealId}`);
    }

    // Mise à jour de la position dans la semaine
    await connection.query(
      'UPDATE meals SET positionInWeek = ? WHERE mealId = ?',
      [newPosition, mealId]
    );

    await connection.commit();
    console.log(`Position du plat avec ID ${mealId} mise à jour à ${newPosition}`);
    return await getMeal(mealId); // Retourne le plat mis à jour

  } catch (error) {
    await connection.rollback();
    console.error(`Erreur lors de la modification de la position :`, error.message);
    throw error;
  } finally {
    connection.release();
  }
}

export { getMeals, getMeal, getMealByName, addMeal, deleteMeal, getScheduledMeals, updateMealPosition };


// Tests

/*
async function insertTestMeals() {
    const testMeals = [
      { mealId: 4, mealName: 'Poulet rôti', positionInWeek: 1 },
      { mealId: 5, mealName: 'Spaghetti bolognaise', positionInWeek: 2 },
      { mealId: 6, mealName: 'Tacos végétariens', positionInWeek: 3 },
      { mealId: 7, mealName: 'Saumon grillé', positionInWeek: 4 },
      { mealId: 8, mealName: 'Burger maison', positionInWeek: 5 }
    ];
  
    for (const meal of testMeals) {
        try { const result = await addMeal(meal.mealId, meal.mealName, meal.positionInWeek);
        console.log(`${meal.mealName} ajouté :`, result[0]);
      } catch (error) {
        console.error(`Erreur lors de l'ajout de ${meal.mealName} :`, error.message);
      }
    }
  
    process.exit(); // termine le script une fois terminé
  }
  
await insertTestMeals();

// const result = await addMeal(1, "Couscous", 5);

//console.log(result)
//process.exit()

*/

// console.log(await getMealByName('Couscous'))