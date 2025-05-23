/**
 * @fileoverview
 * Service de persistance & cache des commentaires.
 *
 * - La base de données est un pool MySQL/MariaDB (driver : **mysql2/promise**).
 * - Un cache **LRU** en mémoire (taille = 1000 entrées) est utilisé pour
 *   accélérer la lecture d’un commentaire individuel.
 *
 * @module commentsService
 */

import pool from './database.js';
import LRUcache from '../LRUcache.js';

/** @constant {LRUCache<string|number, object>} */
const commentCache = new LRUCache(1000)

/**
 * @module comments
 */

/**
 * Récupère tous les commentaires.
 * @async
 * @returns {Promise<Array>} Liste des commentaires.
 * @throws {Error} En cas d'erreur lors de la récupération.
 */
export async function getComments() {
    try {
        const [result] = await pool.query(`
            SELECT *
            FROM comments`);
            return result
    } catch (error) {
        console.error(`Erreur lors de la récupération des commentaires`)
        throw error; // Propagation de l'erreur pour gestion en amont`)
    }
}

/**
 * Récupère un commentaire par son identifiant.
 * Tente d'abord le cache LRU puis la base de données si nécessaire.
 * @async
 * @param {number} commentId - Identifiant du commentaire.
 * @returns {Promise<Object>} Le commentaire trouvé.
 * @throws {Error} En cas d'erreur ou si le commentaire n'existe pas.
 */
export async function getComment(commentId) {
    const cachedComment = commentCache.get(commentId)
    if (cachedComment) {
         return cachedComment
    }
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM comments
            WHERE commentId = ?
        `, [commentId])
         const comment = rows[0]
    if (comment) {
      commentCache.set(commentId, comment);
        return comment
      }
     } // undefined si aucun résultat
    catch (error) {
    console.error(
      `Erreur lors de la récupération du commentaire ${commentId} : ${error.message}`,
    );
    throw error;   
    }
}

/**
 * Crée un nouveau commentaire pour un plat.
 * @async
 * @param {number} mealId - Identifiant du plat.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @param {string} content - Contenu du commentaire.
 * @param {number} [commentParentId] - Identifiant du commentaire parent (optionnel).
 * @returns {Promise<Object>} Le commentaire créé.
 */
export async function createComment(mealId, userId, content, commentParentId){ /* The other attributes should be 
    initialized automatically and commentaryParentId is optional */
    const [result] = await pool.query(`   
        INSERT INTO comments (mealId, userId, content, commentParentId)
        VALUES (?, ?, ?, ?)
    `, [mealId, userId, content, commentParentId])
    const commentId = await result.insertId
    // console.log(result)
    return getComment(commentId)// insertId return the generated ID
}

/**
 * Supprime un commentaire par son identifiant.
 * @async
 * @param {number} commentId - Identifiant du commentaire à supprimer.
 * @returns {Promise<Object>} Résultat de la suppression.
 */
export async function deleteComment(commentId){
    const [result] = await pool.query(`   
        DELETE FROM comments
        WHERE commentId = ?
        ` ,[commentId])
    commentCache.map.delete(commentID)   //On supprime le commentaire du cache
    return result 
}

/**
 * Récupère tous les commentaires associés à un plat.
 * @async
 * @param {number} mealId - Identifiant du plat.
 * @returns {Promise<Array>} Liste des commentaires du plat.
 */
export async function getCommentsByMeal(mealId) {
    const query = `SELECT * FROM comments WHERE mealId = ?`
    const [tab] = await pool.query(query, [mealId]);
    return tab;
}

/**
 * Récupère tous les commentaires d'un utilisateur.
 * @async
 * @param {string} userId - Identifiant de l'utilisateur.
 * @returns {Promise<Array>} Liste des commentaires de l'utilisateur.
 */
export async function getCommentsByUser(userId) {
    try {
        const [result] = await pool.query(`
            SELECT * FROM comments WHERE commentId = ?
        `, [commentId])
        return result[0]
    } catch (error) {
        console.error(`Erreur lors de la récupération du commentaire : ${error.message}`)
        throw error
    }
}

/**
 * Met à jour le contenu d'un commentaire.
 * @async
 * @param {number} commentId - Identifiant du commentaire.
 * @param {string} newContent - Nouveau contenu du commentaire.
 * @returns {Promise<Object>} Message de succès.
 */
export async function updateComment(commentId, newContent) {
    const query = `UPDATE comments SET content = ? WHERE commentsId = ?`
    await pool.query(query, [newContent, commentId])
    return { message: 'Comments updated successfuly' }
}


// Exemple d'utilisation des fonctions

/* (async () => {
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
*/

// console.log(await getComments())