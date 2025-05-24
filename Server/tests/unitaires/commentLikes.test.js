import { createLike, addLikeToComment, removeLikeFromComment } from '../../commentLikes.js';
import pool from '../../database.js';

beforeEach(async () => {
  // Préparation des données de test
  await pool.query("INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)", ['test_user_id', 'pwd', 'TestUser']);
  await pool.query("INSERT IGNORE INTO meals (mealId, mealName) VALUES (?, ?)", [100, 'Test Meal']);
  await pool.query("INSERT IGNORE INTO comments (commentId, userId, mealId, content, likes) VALUES (?, ?, ?, ?, ?)", [100, 'test_user_id', 100, 'Test comment', 0]);
});

afterEach(async () => {
  //Nettoyage des commentaires ajoutés à chaque test
  await pool.query(`DELETE FROM commentLikes WHERE commentId = ?`, [100]);
  await pool.query(`DELETE FROM comments WHERE commentId = ?`, [100]);
});

afterAll(async () => {
   // Supprimer les likes liés au commentaire de test
  await pool.query("DELETE FROM commentLikes WHERE commentId = ?", [100]);

  // Supprimer le commentaire de test
  await pool.query("DELETE FROM comments WHERE commentId = ?", [100]);

  // Supprimer le plat de test
  await pool.query("DELETE FROM meals WHERE mealId = ?", [100]);

  // Fermer la connexion
  await pool.end();
});

//Tests de createLike
describe("Tests de createLike", () => {
  test("Crée un like valide pour un commentaire existant", async () => {
    const result = await createLike('test_user_id', 100, 100);
    expect(result.affectedRows).toBe(1); //Vérifier que le like a bien été inséré 
  });

  test("Retourne null si l’utilisateur est introuvable", async () => {
    const result = await createLike('unknown_user', 100, 100);
    expect(result).toBeNull();
  });

  test("Retourne null si le plat est introuvable", async () => {
    const result = await createLike('test_user_id', -1, 100);
    expect(result).toBeNull();
  });

  test("Retourne null si le commentaire est introuvable", async () => {
    const result = await createLike('test_user_id', 100, -1);
    expect(result).toBeNull();
  });
});

//Tests de addLikeToComment
describe("Tests de addLikeToComment", () => {
  test("Ajoute un like et met à jour le compteur", async () => {
    const result = await addLikeToComment(100, 'test_user_id', 100);
    expect(result).toEqual({ success: true });

    // Vérifier que le compteur de likes dans le commentaire est bien passé à 1
    const [tab] = await pool.query("SELECT likes FROM comments WHERE commentId = ?", [100]);
    expect(tab[0].likes).toBe(1);
  });

  test("Échoue si le like existe déjà", async () => {
    await addLikeToComment(100, 'test_user_id', 100);
    await expect(addLikeToComment(100, 'test_user_id', 100)).rejects.toThrow('Like déjà existant');
  });

  test("Échoue si le commentaire n’existe pas", async () => {
    await expect(addLikeToComment(-1, 'test_user_id', 100)).rejects.toThrow('Commentaire introuvable');
  });
});

//Tests de removeLikeFromComment
describe("Tests de removeLikeFromComment", () => {
  test("Supprime un like et décrémente le compteur", async () => {
    await addLikeToComment(100, 'test_user_id', 100);

    const result = await removeLikeFromComment(100, 'test_user_id');
    expect(result).toEqual({ success: true });

    // Vérifier que le compteur de likes est revenu à 0
    const [tab] = await pool.query("SELECT likes FROM comments WHERE commentId = ?", [100]);
    expect(tab[0].likes).toBe(0);
  });

  test("Échoue si le like est introuvable", async () => {
    await expect(removeLikeFromComment(100, 'test_user_id')).rejects.toThrow('Like introuvable');
  });
});