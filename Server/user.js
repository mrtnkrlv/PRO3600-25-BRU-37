import pool from './database.js';

export async function existsUser(id, pwd, username){
    const [result] = await pool.query(`
        SELECT *
        FROM user
        WHERE id = ?
        AND pwd = ?
        AND username = ?
        `, [id, pwd, username])
    if (result) return true;
    return false;
}

export async function getUser(id){
    const [result] = await pool.query(`
        SELECT *
        FROM user
        WHERE id = ?
    `, [id])
    return result 
}

export async function createUser(id, pwd, username){
    const [result] = await pool.query(`   
        INSERT INTO user (id, pwd, username)
        VALUES (?, ?, ?)
    `, [id, pwd, username])
    return getUser(id)
}

export async function deleteUser(id){
    const [result] = await pool.query(`   
        DELETE FROM user
        WHERE id = ?
        ` ,[id])
    return result 
}

export async function modifyUsername(id, username){
    const [result] = await pool.query(`
        UPDATE user
        SET username = ?
        WHERE id = ?;
        `,[username, id])
    return result 
}

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