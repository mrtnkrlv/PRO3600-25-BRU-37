import pool from './database.js';

/**
 * @module user
 */

/**
 * Vérifie si un utilisateur existe avec l'identifiant et le mot de passe donnés.
 * @async
 * @param {string} id - Identifiant de l'utilisateur.
 * @param {string} pwd - Mot de passe.
 * @returns {Promise<boolean>} True si l'utilisateur existe, sinon false.
 */
export async function existsUser(id, pwd){
    const [[result]] = await pool.query(`
        SELECT COUNT(*) AS count
        FROM user
        WHERE id = ?
        AND pwd = ?`, [id, pwd])
    //console.log(result.count)
    if (result.count === 1) return true
    return false
}


/**
 * Récupère les informations d'un utilisateur.
 * @async
 * @param {string} id - Identifiant de l'utilisateur.
 * @returns {Promise<Object>} Objet utilisateur { id, pwd, username }.
 */
export const getUser = async (id) => {
    const [user] = await pool.query(
      `SELECT id, pwd, username 
       FROM user
       WHERE id = ?`, [id])
    return user[0] // Returns { id, pwd, username }
  };

/**
 * Crée un nouvel utilisateur.
 * @async
 * @param {string} id - Identifiant de l'utilisateur.
 * @param {string} pwd - Mot de passe.
 * @param {string} username - Nom d'utilisateur.
 * @returns {Promise<Object>} L'utilisateur créé.
 */
export async function createUser(id, pwd, username){
    const [result] = await pool.query(`   
        INSERT INTO user (id, pwd, username)
        VALUES (?, ?, ?)
    `, [id, pwd, username])
    return getUser(id)
}

/**
 * Supprime un utilisateur par son identifiant.
 * @async
 * @param {string} id - Identifiant de l'utilisateur.
 * @returns {Promise<Object>} Résultat de la suppression.
 */
export async function deleteUser(id){
    const [result] = await pool.query(`   
        DELETE FROM user
        WHERE id = ?
        ` ,[id])
    return result 
}

/**
 * Modifie le nom d'utilisateur.
 * @async
 * @param {string} id - Identifiant de l'utilisateur.
 * @param {string} username - Nouveau nom d'utilisateur.
 * @returns {Promise<Object>} Résultat de la modification.
 */
export async function modifyUsername(id, username){
    const [result] = await pool.query(`
        UPDATE user
        SET username = ?
        WHERE id = ?;
        `,[username, id])
    return result 
}

import {getComment} from "./comments.js"; 

/**
 * Récupère le nom d'utilisateur à partir de l'identifiant d'un commentaire.
 * @async
 * @param {number} commentId - Identifiant du commentaire.
 * @returns {Promise<string>} Nom d'utilisateur associé au commentaire.
 */
export async function getUsernameByComment(commentId){
    const comment = await getComment(commentId);
    const userId = comment.userId;
    const [result] = await pool.query(  
    `SELECT username FROM user WHERE id = ?`, 
    [userId])
    return result
}

/**
 * Modifie le mot de passe de l'utilisateur.
 * @async
 * @param {string} id - Identifiant de l'utilisateur.
 * @param {string} currentpwd - Ancien mot de passe.
 * @param {string} newpwd - Nouveau mot de passe.
 * @returns {Promise<Object>} Résultat de la modification.
 */
export async function modifyPassword(id, currentpwd, newpwd){
    const [result] = await pool.query(`
        UPDATE user
        SET pwd = ?
        WHERE id = ? AND pwd = ?;
        `,[newpwd, id, currentpwd])
    return result 
}

// Exemples de requêtes
/*

const createPaul = await createUser("paul.emptoz@telecom-sudparis.eu", "modepassestylé", "Paulo")
console.log(createPaul)


const modifyPaul = await modifyUsername("paul.emptoz@telecom-sudparis.eu", "Paulochon")
const getPaul = await getUser("paul.emptoz@telecom-sudparis.eu")
console.log(getPaul)

const modifypasswordPaul = await modifyPassword("paul.emptoz@telecom-sudparis.eu", "modepassestylé", "nouveaumdpstylé")
const getPaul2 = await getUser("paul.emptoz@telecom-sudparis.eu")
console.log(getPaul2)

//const deletePaul = await deleteUser("paul.emptoz@telecom-sudparis.eu")
//console.log("L'utilisateur a été supprimé")

process.exit() 

*/

//console.log(await existsUser("martin.kirilov-lilov@telecom-sudpars.eu", "1234"))

// const createMartin = await createUser("martin.kirilov-lilov@telecom-sudparis.eu", "1234", "Martini")

// console.log(await getUsernameByComment(8))