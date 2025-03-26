import pool from './database.js';

async function getCommentary(commentaryId){
    const [result] = await pool.query(`
        SELECT *
        FROM commentary
        WHERE commentaryId = ?
    `, [commentaryId])
    return result 
}


async function createCommentary(mealId, userId, content, commentaryParentId){ /* The other attributes should be 
    initialized automatically and commentaryParentId is optional */
    const [result] = await pool.query(`   
        INSERT INTO commentary (mealId, userId, content, commentaryParentId)
        VALUES (?, ?, ?, ?)
    `, [mealId, userId, content, commentaryParentId])
    const commentaryId = await result.insertId
    return getCommentary(commentaryId)// insertId return the generated ID
}

async function deleteCommentary(commentaryId){
    const [result] = await pool.query(`   
        DELETE FROM commentary
        WHERE commentaryId = ?
        ` ,[commentaryId])
    return result 
}

async function getCommentsByMeal(mealId) {
    const query = `SELECT * FROM commentary WHERE mealId = ?`;
    const [tab] = await pool.query(query, [mealId]);
    return tab;
}

async function getCommentsByUser(userId) {
    const query = `SELECT * FROM commentary WHERE userId = ?`;
    const [tab] = await pool.query(query, [userId]);
    return tab;
}
  
async function updateCommentary(commentaryId, newContent) {
    const query = `UPDATE commentary SET content = ? WHERE commentaryId = ?`;
    await pool.query(query, [newContent, commentId]);
    return { message: 'Commentaire mis à jour avec succès' };
}



const createNewCommentary1 = await createCommentary(1, "paul.emptoz@telecom-sudparis.eu", "Le couscous était super !")
console.log(createNewCommentary1)


const deleteCommentary1 = await deleteCommentary(7)  /* The comment ID is needed to delete it, 
but it's not that easy for the user to find..." */


process.exit()