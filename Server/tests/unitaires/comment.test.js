import { getComments, getComment, createComment, deleteComment, getCommentsByMeal, getCommentsByUser, updateComment } from '../../comments.js';
import pool from '../../database.js';

beforeEach(async () => {
  // Préparation des données de test
  await pool.query(`INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)`, ['test_user_id', 'pwd', 'TestUser']);
  await pool.query(`INSERT IGNORE INTO meals (mealId, mealName) VALUES (?, ?)`, [100, 'Test Meal']);
  await pool.query(`INSERT IGNORE INTO comments (commentId, userId, mealId, content, likes, dislikes) VALUES (?, ?, ?, ?, ?, ?)`, [100, 'test_user_id', 100, 'test_comment', 0, 0] );
});

afterEach(async () => {
  // Nettoyage
  await pool.query(`DELETE FROM comments WHERE commentId = ?`, [100]);
  await pool.query(`DELETE FROM meals WHERE mealId = ?`, [100]);
  await pool.query(`DELETE FROM user WHERE id = ?`, ['test_user_id']);
});

afterAll(async () => {
  await pool.end();
});

describe('Tests de getComments', () => {
  test('Récupère tous les commentaires', async () => {
    const result = await getComments();
    expect(result.some(c => c.commentId === 100)).toBe(true); //Teste si le commentaire de test est bien récupéré
  });
});

describe('Tests de getComment', () => {
  test('Récupère un commentaire par son ID', async () => {
    const result = await getComment(100);
    expect(result.commentId).toBe(100);
    expect(result.content).toBe('test_comment');
  });
});

describe('Tests de createComment', () => {
  test('Crée un nouveau commentaire et le retourne', async () => {
    const contenu = 'test_comment2';
    const nouveauCommentaire = await createComment(100, 'test_user_id', contenu, null);
    expect(nouveauCommentaire.content).toBe(contenu);

    await deleteComment(nouveauCommentaire.commentId); //Suppression du commentaire créé 
  });
});

describe('Tests de deleteComment', () => {
  test('Supprime un commentaire par son ID', async () => {
    const contenu = 'test_comment à supprimer';
    const commentaireASupprimer = await createComment(100, 'test_user_id', contenu, null);

    await deleteComment(commentaireASupprimer.commentId);
    const commentaire = await getComment(commentaireASupprimer.commentId);
    expect(commentaire).toBeUndefined();
  });
});

describe('Tests de getCommentsByMeal', () => {
  test('Récupère les commentaires d’un plat donné', async () => {
    const result = await getCommentsByMeal(100);
    expect(result.some(c => c.commentId === 100)).toBe(true); //Teste si le commentaire de test est bien récupéré
  });
});

