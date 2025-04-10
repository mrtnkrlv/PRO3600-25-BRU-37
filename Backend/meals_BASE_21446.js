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

const result = await addMeal(1, "Couscous", 5);

console.log(result)
process.exit()