import pool from './database.js';
import LRUCache  from '..LRUcache.js';

/** 
async function addLikeToMeal(mealId, userId) {
    // Vérifier si le plat existe
    const [mealExists] = await pool.query(`
        SELECT * FROM meals WHERE mealId = ?
    `, [mealId]);

    if (mealExists.length === 0) {
        console.log("Plat introuvable");
        return null;
    }

    // Vérifier si l'utilisateur existe
    const [userExists] = await pool.query(`
        SELECT * FROM user WHERE id = ?
    `, [userId]);

    if (userExists.length === 0) {
        console.log("Utilisateur introuvable");
        return null;
    }

    // Ajouter un like dans la table mealLikes (si elle existe)
    const [alreadyLiked] = await pool.query(`
        SELECT * FROM likes WHERE mealId = ? AND userId = ?
    `, [mealId, userId]);

    if (alreadyLiked.length > 0) {
        console.log("Vous avez déjà liké ce plat");
        return null;
    }

    await pool.query(`
        INSERT INTO likes (mealId, userId)
        VALUES (?, ?)
    `, [mealId, userId]);
    console.log("Like ajouté dans la table mealLikes");

    // Mettre à jour le compteur de likes dans la table meals
    await pool.query(`
        UPDATE meals
        SET likes = likes + 1
        WHERE mealId = ?
    `, [mealId]);
    
    console.log("Compteur de likes mis à jour pour le plat");
    
    return { success: true, message: "Like ajouté avec succès" };
}

async function removeLikeFromMeal(mealId, userId) {
    // Vérifier si le plat existe
    const [mealExists] = await pool.query(`
        SELECT * FROM meals WHERE mealId = ?
    `, [mealId]);

    if (mealExists.length === 0) {
        console.log("Plat introuvable");
        return null;
    }

    // Vérifier si l'utilisateur a liké ce plat
    const [alreadyLiked] = await pool.query(`
        SELECT * FROM likes WHERE mealId = ? AND userId = ?
    `, [mealId, userId]);

    if (alreadyLiked.length === 0) {
        console.log("Vous n'avez pas liké ce plat");
        return null;
    }

    // Supprimer le like de la table mealLikes
    await pool.query(`
        DELETE FROM likes WHERE mealId = ? AND userId = ?
    `, [mealId, userId]);
    console.log("Like supprimé de la table mealLikes");

    // Décrémenter le compteur de likes dans la table meals
    await pool.query(`
        UPDATE meals
        SET likes = likes - 1
        WHERE mealId = ?
    `, [mealId]);
    
    console.log("Compteur de likes décrémenté pour le plat");
    
    return { success: true, message: "Like retiré avec succès" };
}


// Exemple d'utilisation
async function main() {
    const result = await addLikeToMeal(1, "paul.emptoz@telecom-sudparis.eu");
    
    if (result) {
        console.log(result.message);
    } else {
        console.log("Le like n'a pas pu être ajouté.");
    }

    
    const result2 = await removeLikeFromMeal(1, "paul.emptoz@telecom-sudparis.eu");
    
    if (result2) {
        console.log(result2.message);
    } else {
        console.log("Le like n'a pas pu être retiré.");
    }
    
    pool.end(); // Fermer le pool de connexions
}

main();
**/

const userLikesCache = new LRUCache(1000); //On a donc de quoi stocket les likes de 1000 utilisateurs

//caches booléens pour éviter un SELECT
const mealExistsCache = new LRUCache(1000);
const userExistsCache = new LRUCache(1000);


//vérifier/mettre en cache l'existence d'un plat 
async function mealExists(mealId) {
  const hit = mealExistsCache.get(mealId);
  if (hit !== undefined) return hit;

  const [rows] = await pool.query(`SELECT 1 FROM meals WHERE mealId = ?`, [mealId]);
  const exists = rows.length > 0;
  mealExistsCache.set(mealId, exists);
  return exists;
}

//vérifier/mettre en cache l'existence d'un user
async function userExists(userId) {
  const hit = userExistsCache.get(userId);
  if (hit !== undefined) return hit;

  const [rows] = await pool.query(`SELECT 1 FROM user WHERE id = ?`, [userId]);
  const exists = rows.length > 0;
  userExistsCache.set(userId, exists);
  return exists;
}

//récupérer la liste des likes d’un user (avec cache)
async function getUserLikes(userId) {
  let likes = userLikesCache.get(userId);
  if (likes) return likes;                        

  const [rows] = await pool.query(
    `SELECT mealId FROM likes WHERE userId = ?`,
    [userId]
  );
  likes = rows.map(r => r.mealId);
  userLikesCache.set(userId, likes);             
  return likes;
}

export async function addLikeToMeal(mealId, userId) {
  //plat + user existent ?
  if (!(await mealExists(mealId))) {
    console.log('Plat introuvable');
    return null;
  }
  if (!(await userExists(userId))) {
    console.log('Utilisateur introuvable');
    return null;
  }

  //utilisateur a déjà like ?
  const likes = await getUserLikes(userId);
  if (likes.includes(mealId)) {
    console.log('Vous avez déjà liké ce plat');
    return null;
  }

  // insert + update compteur
  await pool.query(`INSERT INTO likes (mealId, userId) VALUES (?, ?)`, [mealId, userId]);
  await pool.query(`UPDATE meals SET likes = likes + 1 WHERE mealId = ?`, [mealId]);

  //update cache
  likes.push(mealId);
  userLikesCache.set(userId, likes);              // (le .set le remonte en MRU)

  console.log('Like ajouté');
  return { success: true, message: 'Like ajouté avec succès' };
}


export async function removeLikeFromMeal(mealId, userId) {
  //plat et like existent ?
  if (!(await mealExists(mealId))) {
    console.log('Plat introuvable');
    return null;
  }

  const likes = await getUserLikes(userId);
  if (!likes.includes(mealId)) {
    console.log("Vous n'avez pas liké ce plat");
    return null;
  }

  //delete + décrémenter compteur
  await pool.query(`DELETE FROM likes WHERE mealId = ? AND userId = ?`, [mealId, userId]);
  await pool.query(`UPDATE meals SET likes = likes - 1 WHERE mealId = ?`, [mealId]);

  //update cache
  likes.splice(likes.indexOf(mealId), 1);
  userLikesCache.set(userId, likes);              // rafraîchit la position LRU

  console.log('Like retiré');
  return { success: true, message: 'Like retiré avec succès' };
}
