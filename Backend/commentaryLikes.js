import pool from './database.js';

async function createLike(userId, mealId, commentId) {
    // Vérifier que l'utilisateur, le plat et le commentaire existent
    const [userExists] = await pool.query('SELECT id FROM user WHERE id = ?', [userId]);
    const [mealExists] = await pool.query('SELECT mealId FROM meals WHERE mealId = ?', [mealId]);
    const [commentaryExists] = await pool.query('SELECT commentaryId FROM commentary WHERE commentaryId = ?', [commentId]);

    if (userExists.length === 0) {
        console.log("Utilisateur introuvable");
        return null;
    }

    if (mealExists.length === 0) {
        console.log("Plat introuvable");
        return null;
    }

    if (commentaryExists.length === 0) {
        console.log("Commentaire introuvable");
        return null;
    }

    // Ajouter le like dans la table commentaryLikes
    const [result] = await pool.query(
        'INSERT INTO commentaryLikes (userId, mealId, commentaryId) VALUES (?, ?, ?)',
        [userId, mealId, commentId]
    );

    console.log("Like ajouté à la table commentaryLikes");
    return result;
}

async function addLikeToComment(commentId, userId, mealId) {
    // Vérifier si le like existe déjà
    const [existingLike] = await pool.query(
        'SELECT * FROM commentaryLikes WHERE commentaryId = ? AND userId = ?',
        [commentId, userId]
    );

    if (existingLike.length > 0) {
        console.log("Like déjà existant");
        return null;
    }

    // Vérifier l'existence du commentaire
    const [comment] = await pool.query(
        'SELECT * FROM commentary WHERE commentaryId = ?',
        [commentId]
    );

    if (comment.length === 0) {
        console.log("Commentaire introuvable");
        return null;
    }

    // Mettre à jour le compteur de likes ET ajouter le like
    await pool.query('UPDATE commentary SET likes = likes + 1 WHERE commentaryId = ?', [commentId]);
    console.log("Compteur de likes mis à jour");

    const newLike = await createLike(userId, mealId, commentId);
    return newLike;
}

// Fonction principale pour tester
async function main() {
    const like1 = await addLikeToComment(8, "paul.emptoz@telecom-sudparis.eu", 1);

    if (like1) {
        console.log("Like créé:", like1);
    } else {
        console.log("Le like n'a pas pu être créé.");
    }

    pool.end(); // Fermer le pool de connexions
}

main();
