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
}

const result = await getMeal(1);

console.log(result)

  