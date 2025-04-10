import pool from './database.js';

// Ajoute ou met à jour la note d'un utilisateur pour un plat
async function addOrUpdateRating(mealId, userId, rating) {
  try {
    // Validation de la note
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("La note doit être un entier entre 1 et 5.");
    }

    // Vérification de l'existence du plat
    const [mealExists] = await pool.query(`SELECT * FROM meals WHERE mealId = ?`, [mealId]);
    if (mealExists.length === 0) {
      throw new Error("Plat introuvable.");
    }

    // Vérification de l'existence de l'utilisateur
    const [userExists] = await pool.query(`SELECT * FROM user WHERE id = ?`, [userId]);
    if (userExists.length === 0) {
      throw new Error("Utilisateur introuvable.");
    }

    // Vérification si une note existe déjà
    const [existingRating] = await pool.query(`SELECT * FROM ratings WHERE mealId = ? AND userId = ?`, [mealId, userId]);

    if (existingRating.length > 0) {
      // Mise à jour de la note existante
      await pool.query(`UPDATE ratings SET rating = ? WHERE mealId = ? AND userId = ?`, [rating, mealId, userId]);
      console.log("Note mise à jour.");
    } else {
      // Ajout d'une nouvelle note
      await pool.query(`INSERT INTO ratings (mealId, userId, rating) VALUES (?, ?, ?)`, [mealId, userId, rating]);
      console.log("Nouvelle note ajoutée.");
    }

    // Recalculer la moyenne des notes pour ce plat
    const [allRatings] = await pool.query(`SELECT rating FROM ratings WHERE mealId = ?`, [mealId]);
    const totalRatings = allRatings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = allRatings.length > 0 ? totalRatings / allRatings.length : 0;

    // Mettre à jour la moyenne dans la table meals
    await pool.query(`UPDATE meals SET averageRating = ?, ratingCount = ? WHERE mealId = ?`, [averageRating, allRatings.length, mealId]);

    return { success: true, message: existingRating.length > 0 ? "Note mise à jour." : "Note ajoutée." };
  } catch (error) {
    console.error(`Erreur lors de l'ajout ou de la mise à jour de la note : ${error.message}`);
    throw error;
  }
}

// Supprime la note d'un utilisateur pour un plat spécifique

async function removeRating(mealId, userId) {
  try {
    // Vérifier si le plat existe
    const [mealExists] = await pool.query(`SELECT * FROM meals WHERE mealId = ?`, [mealId]);
    if (mealExists.length === 0) {
      throw new Error("Plat introuvable.");
    }

    // Vérifier si une note existe pour cet utilisateur et ce plat
    const [existingRating] = await pool.query(`SELECT * FROM ratings WHERE mealId = ? AND userId = ?`, [mealId, userId]);
    if (existingRating.length === 0) {
      throw new Error("Note inexistante pour ce plat et cet utilisateur.");
    }

    // Supprimer la note
    await pool.query(`DELETE FROM ratings WHERE mealId = ? AND userId = ?`, [mealId, userId]);
    console.log("Note supprimée.");

    // Recalculer la moyenne des notes pour ce plat
    const [newAllRatings] = await pool.query(`SELECT rating FROM ratings WHERE mealId = ?`, [mealId]);
    const totalRatings = newAllRatings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = newAllRatings.length > 0 ? totalRatings / newAllRatings.length : 0;

    // Mettre à jour la moyenne dans la table meals
    await pool.query(`UPDATE meals SET averageRating = ?, ratingCount = ? WHERE mealId = ?`, [averageRating, newAllRatings.length, mealId]);

    return { success: true, message: "Note supprimée." };
  } catch (error) {
    console.error(`Erreur lors de la suppression de la note : ${error.message}`);
    throw error;
  }
}

// Récupère la note d'un utilisateur pour un plat spécifique
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
async function getUserRating(mealId, userId) {
  try {
    const [rating] = await pool.query(`SELECT rating FROM ratings WHERE mealId = ? AND userId = ?`, [mealId, userId]);
    return rating.length > 0 ? rating[0].rating : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la note : ${error.message}`);
    throw error;
  }
}

// Calcule la moyenne des notes pour un plat spécifique
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
=======
 
>>>>>>> Stashed changes
=======
 
>>>>>>> Stashed changes
=======
 
>>>>>>> Stashed changes
=======
 
>>>>>>> Stashed changes
async function getAverageRating(mealId) {
  try {
    const [result] = await pool.query(`
      SELECT AVG(rating) AS averageRating 
      FROM ratings 
      WHERE mealId = ?
    `, [mealId]);

    return result[0].averageRating || null;
  } catch (error) {
    console.error(`Erreur lors du calcul de la moyenne des notes : ${error.message}`);
    throw error;
  }
}

// Exemple d'utilisation des fonctions :
(async () => {
  try {
    // Ajouter ou mettre à jour une note :
    const updatedRating = await addOrUpdateRating(1, "paul.emptoz@telecom-sudparis.eu", 4);
    console.log("Note ajoutée ou mise à jour :", updatedRating);

    // Récupérer une note spécifique :
    const userRating = await getUserRating(1, "paul.emptoz@telecom-sudparis.eu");
    console.log("Note utilisateur :", userRating);

    // Calculer la moyenne des notes :
    const averageRating = await getAverageRating(1);
    console.log("Moyenne des notes :", averageRating);

    // Supprimer une note :
    const deletedRating = await removeRating(1, "paul.emptoz@telecom-sudparis.eu");
    console.log(deletedRating.message);
  } catch (error) {
    console.error('Une erreur est survenue :', error.message);
  } finally {
    pool.end(); // Fermer le pool après utilisation.
  }
})();
