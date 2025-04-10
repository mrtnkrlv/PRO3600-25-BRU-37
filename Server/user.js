import pool from './database.js';


async function getUser(id){
    const [result] = await pool.query(`
        SELECT *
        FROM user
        WHERE id = ?
    `, [id])
    return result 
}

async function createUser(id, password, username){
    const [result] = await pool.query(`   
        INSERT INTO user (id, password, username)
        VALUES (?, ?, ?)
    `, [id, password, username])
    return getUser(id)
}

async function deleteUser(id){
    const [result] = await pool.query(`   
        DELETE FROM user
        WHERE id = ?
        ` ,[id])
    return result 
}

async function modifyUsername(id, username){
    const [result] = await pool.query(`
        UPDATE user
        SET username = ?
        WHERE id = ?;
        `,[username, id])
    return result 
}

async function modifyPassword(id, currentpassword, newpassword){
    const [result] = await pool.query(`
        UPDATE user
        SET password = ?
        WHERE id = ? AND password = ?;
        `,[newpassword, id, currentpassword])
    return result 
}

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