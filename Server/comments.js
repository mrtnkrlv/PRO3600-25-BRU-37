import pool from './database.js';

async function getComment(commentId) {
    try {
        const [result] = await pool.query(`
            SELECT *
            FROM comments
            WHERE commentId = ?
        `, [commentId]);
        return result[0]; // Retourne le premier résultat (un seul commentaire)
    } catch (error) {
        console.error(`Erreur lors de la récupération du commentaire ${commentId} : ${error.message}`);
        throw error; // Propagation de l'erreur pour gestion en amont
    }
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
    try {
        const [result] = await pool.query(`
            SELECT * FROM comments WHERE commentId = ?
        `, [commentId]);
        return result[0];
    } catch (error) {
        console.error(`Erreur lors de la récupération du commentaire : ${error.message}`);
        throw error;
    }
}
  
async function updateComment(commentId, newContent) {
    const query = `UPDATE comments SET content = ? WHERE commentsId = ?`;
    await pool.query(query, [newContent, commentId]);
    return { message: 'Comments updated successfuly' };
}


// Exemple d'utilisation des fonctions

(async () => {
    try {
        // Création d'un nouveau commentaire (sans parent)
        const createNewComment1 = await createComment(1, "paul.emptoz@telecom-sudparis.eu",null, "Le couscous était super !");
        console.log("Nouveau commentaire créé :", createNewComment1);

        // Suppression d'un commentaire par son ID
        const deleteComment1 = await deleteComment(9);
        console.log("Résultat de la suppression :", deleteComment1);
    } catch (error) {
        console.error("Une erreur est survenue :", error.message);
    }
})();