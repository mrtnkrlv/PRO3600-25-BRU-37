import pool from './database.js';

// Récupère un utilisateur par son ID
async function getUser(id) {
  try {
    const [result] = await pool.query(`
      SELECT *
      FROM user
      WHERE id = ?
    `, [id]);

    if (result.length === 0) {
      throw new Error(`Utilisateur avec l'ID ${id} introuvable.`);
    }

    return result[0];
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur : ${error.message}`);
    throw error;
  }
}

//Crée un nouvel utilisateur
async function createUser(id, password, username) {
  try {
    // Validation des données
    if (!id || !password || !username) {
      throw new Error('Tous les champs (id, password, username) sont obligatoires.');
    }

    await pool.query(`
      INSERT INTO user (id, password, username)
      VALUES (?, ?, ?)
    `, [id, password, username]);

    return await getUser(id);
  } catch (error) {
    console.error(`Erreur lors de la création de l'utilisateur : ${error.message}`);
    throw error;
  }
}

// Supprime un utilisateur par son id
async function deleteUser(id) {
  try {
    const [result] = await pool.query(`
      DELETE FROM user
      WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      throw new Error(`Aucun utilisateur trouvé avec l'ID ${id}`);
    }

    console.log(`Utilisateur avec l'ID ${id} supprimé.`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur : ${error.message}`);
    throw error;
  }
}

// Modify the name of a user already existing
async function modifyUsername(id, username) {
  try {
    const [result] = await pool.query(`
      UPDATE user
      SET username = ?
      WHERE id = ?
    `, [username, id]);

    if (result.affectedRows === 0) {
      throw new Error(`Aucun utilisateur trouvé avec l'ID ${id}`);
    }

    return await getUser(id);
  } catch (error) {
    console.error(`Erreur lors de la modification du nom d'utilisateur : ${error.message}`);
    throw error;
  }
}

// Modify password
async function modifyPassword(id, currentPassword, newPassword) {
  try {
    const [result] = await pool.query(`
      UPDATE user
      SET password = ?
      WHERE id = ? AND password = ?
    `, [newPassword, id, currentPassword]);

    if (result.affectedRows === 0) {
      throw new Error('Mot de passe incorrect ou utilisateur introuvable.');
    }

    console.log(`Mot de passe mis à jour pour l'utilisateur avec l'ID ${id}.`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la modification du mot de passe : ${error.message}`);
    throw error;
  }
}

// Verify if the user is in the database
async function userExists(id) {
  try {
    const [result] = await pool.query(`
      SELECT id FROM user WHERE id = ?
    `, [id]);

    return result.length > 0;
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'existence de l'utilisateur : ${error.message}`);
    throw error;
  }
}

// Exemple d'utilisation des fonctions :
(async () => {
  try {

    // Modification du nom d'utilisateur :
    const updatedUsername = await modifyUsername("paul.emptoz@telecom-sudparis.eu", "Paulochon");
    console.log("Nom d'utilisateur mis à jour :", updatedUsername);

    // Modification du mot de passe :
    const updatedPassword = await modifyPassword("paul.emptoz@telecom-sudparis.eu", "modepassestylé", "nouveaumdpstylé");
    console.log("Mot de passe mis à jour :", updatedPassword);

    // Vérification si l'utilisateur existe :
    const exists = await userExists("paul.emptoz@telecom-sudparis.eu");
    console.log(`L'utilisateur existe : ${exists}`);

    // Suppression de l'utilisateur :
    const deleted = await deleteUser("paul.emptoz@telecom-sudparis.eu");
    console.log(`Utilisateur supprimé : ${deleted}`);

  } catch (error) {
    console.error('Une erreur est survenue :', error.message);
  } finally {
    pool.end(); // Fermer le pool après utilisation.
  }
})();
