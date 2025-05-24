/**
 * @fileoverview
 * Service de gestion des **likes** sur les plats :
 *
 * 1. Vérifie l’existence d’un plat (« meal ») et d’un utilisateur via la base
 *    MySQL (driver **mysql2/promise**) en les mettant en cache (LRU).
 * 2. Maintient un cache des likes d’un utilisateur pour éviter des requêtes
 *    répétées.
 * 3. Expose les opérations `addLikeToMeal` et `removeLikeFromMeal` qui
 *    incrémentent/décrémentent le compteur de likes dans la table **meals**,
 *    tout en conservant la cohérence du cache.
 *
 * @module Likes
 */

import pool from './database.js';
import LRUCache from '../LRUcache.js'; // NB : chemin relatif à ajuster si besoin

/**
 * Cache LRU : mappe `userId → mealId[]`.
 * Capacité : 1000 utilisateurs.
 *
 * @type {LRUCache<(number|string), (number|string)[]>}
 */
const userLikesCache = new LRUCache(1000);

/**
 * Cache booléen : présence d’un plat (`mealId`) en BD.
 *
 * @type {LRUCache<(number|string), boolean>}
 */
const mealExistsCache = new LRUCache(1000);

/**
 * Cache booléen : présence d’un utilisateur (`userId`) en BD.
 *
 * @type {LRUCache<(number|string), boolean>}
 */
const userExistsCache = new LRUCache(1000);

/**
 * Vérifie (et met en cache) l’existence d’un plat.
 *
 * @async
 * @param {(number|string)} mealId - Identifiant du plat.
 * @returns {Promise<boolean>} `true` si le plat existe, sinon `false`.
 */
async function mealExists(mealId) {
  const hit = mealExistsCache.get(mealId);
  if (hit !== undefined) {
    return hit;
  }

  const [rows] = await pool.query(
    `SELECT 1 FROM meals WHERE mealId = ?`,
    [mealId],
  );
  const exists = rows.length > 0;
  mealExistsCache.set(mealId, exists);
  return exists;
}

/**

 * Vérifie (et met en cache) l’existence d’un utilisateur.
 *
 * @async
 * @param {(number|string)} userId - Identifiant de l’utilisateur.
 * @returns {Promise<boolean>} `true` si l’utilisateur existe, sinon `false`.
 */
async function userExists(userId) {
  const hit = userExistsCache.get(userId);
  if (hit !== undefined) {
    return hit;
  }

  const [rows] = await pool.query(
    `SELECT 1 FROM user WHERE id = ?`,
    [userId],
  );
  const exists = rows.length > 0;
  userExistsCache.set(userId, exists);
  return exists;
}

/**
 * Récupère tous les identifiants de plats likés par un utilisateur, en
 * consultant d’abord le cache LRU.
 *
 * @async
 * @param {(number|string)} userId - Identifiant de l’utilisateur.
 * @returns {Promise<(number|string)[]>} Tableau des `mealId` aimés.
 */
export async function getUserLikes(userId) {
  let likes = userLikesCache.get(userId);
  if (likes) {
    return likes;
  }

  const [rows] = await pool.query(
    `SELECT mealId FROM likes WHERE userId = ?`,
    [userId],
  );
  likes = rows.map((r) => r.mealId);
  userLikesCache.set(userId, likes);
  return likes;
}


/**
 * Ajoute un like pour un plat donné.
 * <br>Étapes :
 * 1. Vérifie la présence du plat et de l’utilisateur (avec cache).
 * 2. Vérifie que l’utilisateur n’a pas déjà liké ce plat.
 * 3. Insère le like et incrémente le compteur dans **meals**.
 * 4. Met à jour le cache `userLikesCache`.
 *
 * @async
 * @param {(number|string)} mealId - Identifiant du plat.
 * @param {(number|string)} userId - Identifiant de l’utilisateur.
 * @returns {Promise<{success: true, message: string}|null>}
 *          Confirmation ou `null` si opération impossible.
 *
 * @example
 * await addLikeToMeal(12, 42);
 */
export async function addLikeToMeal(mealId, userId) {
  // plat + user existent ?
  if (!(await mealExists(mealId))) {
    console.log('Plat introuvable');
    return null;
  }
  if (!(await userExists(userId))) {
    console.log('Utilisateur introuvable');
    return null;
  }

  // utilisateur a déjà like ?
  const likes = await getUserLikes(userId);
  if (likes.includes(mealId)) {
    console.log('Vous avez déjà liké ce plat');
    return null;
  }

  // insert + update compteur
  await pool.query(
    `INSERT INTO likes (mealId, userId) VALUES (?, ?)`,
    [mealId, userId],
  );
  await pool.query(
    `UPDATE meals SET likes = likes + 1 WHERE mealId = ?`,
    [mealId],
  );

  // update cache
  likes.push(mealId);
  userLikesCache.set(userId, likes);

  console.log('Like ajouté');
  return { success: true, message: 'Like ajouté avec succès' };
}

/**
 * Supprime le like d’un utilisateur pour un plat.
 * <br>Étapes :
 * 1. Vérifie l’existence du plat et du like.
 * 2. Supprime l’enregistrement dans **likes** et décrémente le compteur.
 * 3. Met à jour le cache `userLikesCache`.
 *
 * @async
 * @param {(number|string)} mealId - Identifiant du plat.
 * @param {(number|string)} userId - Identifiant de l’utilisateur.
 * @returns {Promise<{success: true, message: string}|null>}
 *          Confirmation ou `null` si l’utilisateur n’avait pas liké ce plat.
 *
 * @example
 * await removeLikeFromMeal(12, 42);
 */
export async function removeLikeFromMeal(mealId, userId) {
  // plat et like existent ?
  if (!(await mealExists(mealId))) {
    console.log('Plat introuvable');
    return null;
  }

  const likes = await getUserLikes(userId);
  if (!likes.includes(mealId)) {
    console.log("Vous n'avez pas liké ce plat");
    return null;
  }

  // delete + décrémenter compteur
  await pool.query(
    `DELETE FROM likes WHERE mealId = ? AND userId = ?`,
    [mealId, userId],
  );
  await pool.query(
    `UPDATE meals SET likes = likes - 1 WHERE mealId = ?`,
    [mealId],
  );

  // update cache
  likes.splice(likes.indexOf(mealId), 1);
  userLikesCache.set(userId, likes);

  console.log('Like retiré');
  return { success: true, message: 'Like retiré avec succès' };
}

