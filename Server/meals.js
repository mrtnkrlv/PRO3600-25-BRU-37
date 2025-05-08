import pool from './database.js'; // Import the pool 

// Get an array with all meals in a given week
export async function getMeals(){
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

// Get the tuple associated to mealId from the MEALS table
export async function getMeal(mealId){
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

export async function getMealByName(mealName){
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

// Insert an element into the MEALS table
export async function addMeal(mealId, mealName, positionInWeek) {
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


async function deleteMeal(mealId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Suppression des dépendances
    await connection.query('DELETE FROM mealGrades WHERE mealId = ?', [mealId]);
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
 * Modifie la place dans la semaine d'un plat
 * @param {number} mealId - ID du plat à modifier
 * @param {number} newPosition - Nouvelle position dans la semaine (0-5)
 * @returns {Promise<object>} Le plat mis à jour ou une erreur
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
    console.log(`✅ Position du plat avec ID ${mealId} mise à jour à ${newPosition}`);
    return await getMeal(mealId); // Retourne le plat mis à jour

  } catch (error) {
    await connection.rollback();
    console.error(`❌ Erreur lors de la modification de la position :`, error.message);
    throw error;
  } finally {
    connection.release();
  }
}


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
        console.log(`✅ ${meal.mealName} ajouté :`, result[0]);
      } catch (error) {
        console.error(`❌ Erreur lors de l'ajout de ${meal.mealName} :`, error.message);
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