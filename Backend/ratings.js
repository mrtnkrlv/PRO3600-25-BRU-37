import pool from './database.js';

async function addOrUpdateRating(mealId, userId, rating) {
    // Vérifier si la note est entre 1 et 5
    if (rating < 1 || rating > 5) {
        console.log("La note doit être comprise entre 1 et 5");
        return null;
    }

    // Vérifier si le plat existe
    const [mealExists] = await pool.query(`SELECT * FROM meals WHERE mealId = ?`, [mealId]);
    if (mealExists.length === 0) {
        console.log("Plat introuvable");
        return null;
    }

    // Vérifier si l'utilisateur existe
    const [userExists] = await pool.query(`SELECT * FROM user WHERE id = ?`, [userId]);
    if (userExists.length === 0) {
        console.log("Utilisateur introuvable");
        return null;
    }

    // Vérifier si l'utilisateur a déjà noté ce plat
    const [existingRating] = await pool.query(`SELECT * FROM ratings WHERE mealId = ? AND userId = ?`, [mealId, userId]);
    if (existingRating.length > 0) {
        await pool.query(`UPDATE ratings SET rating = ? WHERE mealId = ? AND userId = ?`, [rating, mealId, userId]);
        console.log("Note mise à jour");
    } else {
        await pool.query(`INSERT INTO ratings (mealId, userId, rating) VALUES (?, ?, ?)`, [mealId, userId, rating]);
        console.log("Nouvelle note ajoutée");
    }

    // Calculer la nouvelle moyenne des notes pour ce plat
    const [allRatings] = await pool.query(`SELECT rating FROM ratings WHERE mealId = ?`, [mealId]);
    let totalRatings = 0;
    for (const item of allRatings) {
        totalRatings += item.rating;
    };
    const averageRating = allRatings.length > 0 ? totalRatings / allRatings.length : 0;

    // Mettre à jour la note moyenne dans la table meals
    await pool.query(`UPDATE meals SET averageRating = ?, ratingCount = ? WHERE mealId = ?`, [averageRating, allRatings.length, mealId]);
    console.log("Note moyenne mise à jour pour le plat");

    return { 
        success: true,
        message: existingRating.length > 0 ? "Note mise à jour" : "Note ajoutée",
    };
}

async function removeRating(mealId, userId) {
    // Vérifier si le plat existe
    const [mealExists] = await pool.query(`SELECT * FROM meals WHERE mealId = ?`, [mealId]);
    if (mealExists.length === 0) {
        console.log("Plat introuvable");
        return null;
    }

    // Vérifier si l'utilisateur a noté ce plat
    const [existingRating] = await pool.query(`SELECT * FROM ratings WHERE mealId = ? AND userId = ?`, [mealId, userId]);
    if (existingRating.length === 0) {
        console.log("plat non noté");
        return null;
    }

    // Supprimer la note de la table ratings
    await pool.query(`DELETE FROM ratings WHERE mealId = ? AND userId = ?`, [mealId, userId]);
    console.log("Note supprimée");

    // Recalculer la moyenne des notes pour ce plat
    const [newAllRatings] = await pool.query(`SELECT rating FROM ratings WHERE mealId = ?`, [mealId]);
    let averageRating = 0;
    let ratingCount = 0;

    if (newAllRatings.length > 0) {
        let totalRatings = 0;
        for (const item of newAllRatings) {
            totalRatings += item.rating;
        };
        averageRating = totalRatings / newAllRatings.length;
        ratingCount = newAllRatings.length;
    }

    // Mettre à jour la note moyenne dans la table meals
    await pool.query(`UPDATE meals SET averageRating = ?, ratingCount = ? WHERE mealId = ?`, [averageRating, ratingCount, mealId]);
    console.log("Note moyenne mise à jour après suppression");

    return { 
        success: true, 
        message: "Note supprimée"
    };
}

async function getUserRating(mealId, userId) {
    const [rating] = await pool.query(`SELECT rating FROM ratings WHERE mealId = ? AND userId = ?`, [mealId, userId]);
    if (rating.length === 0) {
        return "L'utilisateur n'a pas encore noté ce plat";
    }
    return rating[0].rating;
}