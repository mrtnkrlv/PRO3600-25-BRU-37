import pool from './database.js';

async function getComment(commentId){
    const [result] = await pool.query(`
        SELECT *
        FROM comments
        WHERE commentId = ?
    `, [commentId])
    return result 
}


async function createComment(mealId, userId, content, commentParentId){ /* The other attributes should be 
    initialized automatically and commentaryParentId is optional */
    const [result] = await pool.query(`   
        INSERT INTO comments (mealId, userId, content, commentParentId)
        VALUES (?, ?, ?, ?)
    `, [mealId, userId, commentParentId, content])
    const commentId = await result.insertId
    return getComment(commentId)// insertId return the generated ID
}

async function deleteComment(commentId){
    const [result] = await pool.query(`   
        DELETE FROM comments
        WHERE commentId = ?
        ` ,[commentId])
    return result 
}

async function getCommentsByMeal(mealId) {
    const query = `SELECT * FROM comments WHERE mealId = ?`;
    const [tab] = await pool.query(query, [mealId]);
    return tab;
}

async function getCommentsByUser(userId) {
    const query = `SELECT * FROM comments WHERE userId = ?`;
    const [tab] = await pool.query(query, [userId]);
    return tab;
}
  
async function updateComment(commentId, newContent) {
    const query = `UPDATE comments SET content = ? WHERE commentsId = ?`;
    await pool.query(query, [newContent, commentId]);
    return { message: 'Comments updated successfuly' };
}


// Exemple


const createNewComment1 = await createComment(1, "paul.emptoz@telecom-sudparis.eu", null,"Le couscous était super !")
console.log(createNewComment1)


const deleteComment1 = await deleteComment(9)  /* The comment ID is needed to delete it, 
but it's not that easy for the user to find..." */
console.log(deleteComment1)
