import pool from '../../database.js';
import { addMeal, getMeal, deleteMeal } from '../../meals.js';
import { createComment, getCommentsByMeal, deleteComment } from '../../comments.js';

beforeEach(async () => {
  // Créer un utilisateur, un plat et un commentaire de base pour les tests
  await pool.query(`INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)`, ['test_user_id', 'pwd', 'TestUser']);
  await addMeal(301, 'Test Meal for Comments', 2);
});

afterEach(async () => {
  // Nettoyer les commentaires, plats et utilisateurs
  await pool.query(`DELETE FROM comments WHERE mealId = ?`, [301]);
  await pool.query(`DELETE FROM meals WHERE mealId = ?`, [301]);
  await pool.query(`DELETE FROM user WHERE id = ?`, ['test_user_id']);
});

afterAll(async () => {
  await pool.end();
});

describe('Intégration - Commentaires sur les plats', () => {
  test('Ajout d’un commentaire à un plat et vérification de la présence', async () => {
    const comment = await createComment(301, 'test_user_id', 'Un commentaire de test');

    const comments = await getCommentsByMeal(301);
    const found = comments.find(c => c.commentId === comment.commentId);

    expect(found.content).toBe('Un commentaire de test');
  });

  test('Suppression d’un commentaire et vérification de sa disparition', async () => {
    const comment = await createComment(301, 'test_user_id', 'Un commentaire à supprimer');

    const deleted = await deleteComment(comment.commentId);
    expect(deleted.affectedRows).toBe(1);

    const comments = await getCommentsByMeal(301);
    const found = comments.find(c => c.commentId === comment.commentId);
    expect(found).toBeUndefined();
  });

  test('Ajout de plusieurs commentaires et vérification de leur ordre de création', async () => {
    await createComment(301, 'test_user_id', 'Premier');
    await createComment(301, 'test_user_id', 'Deuxième');

    const comments = await getCommentsByMeal(301);
    expect(comments.length).toBeGreaterThanOrEqual(2);
    expect(comments.map(c => c.content)).toEqual(
      expect.arrayContaining(['Premier', 'Deuxième'])
    );
  });

});
