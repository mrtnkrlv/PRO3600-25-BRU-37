import { getComments, getComment, createComment, deleteComment, getCommentsByMeal, getCommentsByUser, updateComment } from '../../comments.js';
import pool from '../../database.js';

beforeEach(async () => {
  // Préparation des données de test
  await pool.query("INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)", ['test_user_id', 'pwd', 'TestUser']);
  await pool.query("INSERT IGNORE INTO meals (mealId, mealName) VALUES (?, ?)", [100, 'Test Meal']);
  await pool.query("INSERT IGNORE INTO comments (commentId, userId, mealId, content, likes, dislikes, commentParentId) VALUES (?, ?, ?, ?, ?, ?, ?)", [100, 'test_user_id', 100, 'test_comment', 0, 0, null] );
});

afterAll(async () => {
 // Supprimer les likes liés aux commentaires du mealId de test
  await pool.query("DELETE FROM commentLikes WHERE commentId IN (SELECT commentId FROM comments WHERE mealId = ?)", [100]);

  // Supprimer tous les commentaires liés au plat de test
  await pool.query("DELETE FROM comments WHERE mealId = ?", [100]);

  // Supprimer le plat de test
  await pool.query("DELETE FROM meals WHERE mealId = ?", [100]);

  // Fermer la connexion
  await pool.end();
});

//Tests de getComments
describe("Tests de getComments", () => {
  test("Récupère tous les commentaires", async () => {
    const result = await getComments();
    expect(result.some(c => c.commentId === 100)).toBe(true); //Teste si le commentaire de test est bien récupéré
  });
});

//Tests de getComment
describe("Tests de getComment", () => {
  test("Récupère un commentaire par son ID", async () => {
    
    const result = await getComment(100);
    expect(result.commentId).toBe(100);
    expect(result.content).toBe('test_comment');
  });
});

//Tests de createComment
describe("Tests de createComment", () => {
  test("Crée un nouveau commentaire et le retourne", async () => {
    const nouveauCom = await createComment(100, 'test_user_id', 'test_comment2', null);
    expect(nouveauCom.content).toBe('test_comment2');

    await pool.query("DELETE FROM commentLikes WHERE commentId = ?", [nouveauCom.commentId]); //Supression du commentaire ajouté
  });
});

//Tests de createComment
describe("Tests de deleteComment", () => {
  test("Supprime un commentaire par son ID", async () => {
    //Ajout du commentaire à supprimer 
    const contenu = 'test_comment à supprimer';
    const comASupprimer = await createComment(100, 'test_user_id', contenu, null);

    await deleteComment(comASupprimer.commentId);
    const commentaire = await getComment(comASupprimer.commentId);
    expect(commentaire).toBeUndefined();

    await pool.query("DELETE FROM commentLikes WHERE commentId = ?", [comASupprimer.commentId]); //Supression du commentaire ajouté si le test échoue
  });
});

//Tests de getCommentByMeal
describe("Tests de getCommentsByMeal", () => {
  test("Récupère les commentaires d’un plat donné", async () => {
    const result = await getCommentsByMeal(100);
    expect(result.some(c => c.commentId === 100)).toBe(true); //Teste si le commentaire de test est bien récupéré
  });
});

