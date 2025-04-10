import pool from './database.js'; // Import the pool 

// Get the tuple associated to mealId from the MEALS table
async function getMeal(mealId){
    const [result] = await pool.query(`
        SELECT *
        FROM meals
        WHERE mealId = ?
        `, [mealId])
    return result;
}

// Insert an element into the MEALS table"
async function addMeal(mealId,mealName,positionInWeek){
    const [result] = await pool.query(`
      INSERT INTO meals (mealId, mealName, positionInWeek)
      VALUES (?,?,?)
    `, [mealId,mealName, positionInWeek]);
    return getMeal(1)
}

// Tests


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

console.log(result)
process.exit()