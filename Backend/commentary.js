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

const createNewCommentary1 = await createCommentary(1, "paul.emptoz@telecom-sudparis.eu", "Le couscous était super !")
console.log(createNewCommentary1)

const deleteCommentary1 = await deleteCommentary(7)  /* The comment ID is needed to delete it, 
but it's not that easy for the user to find..." */


process.exit()