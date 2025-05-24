import pool from '../../database.js';
import { addMeal } from '../../meals.js';
import { createComment, getCommentsByMeal, deleteComment } from '../../comments.js';

beforeEach(async () => {
  // Créer un utilisateur et un plat pour les tests
  await pool.query("INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)", ['test_user_id', 'pwd', 'TestUser']);
  await pool.query("INSERT IGNORE INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)", [301, 'test_meal', 2]);
});

afterEach(async () => {
  // Supprimer les commentaires enfants d'abord 
  await pool.query("DELETE FROM comments WHERE commentParentId IS NOT NULL AND mealId = ?", [301]);
  await pool.query("DELETE FROM comments WHERE mealId = ?", [301]);

  // Supprimer le plat et l'utilisateur
  await pool.query("DELETE FROM meals WHERE mealId = ?", [301]);
  await pool.query("DELETE FROM user WHERE id = ?", ['test_user_id']);
});

afterAll(async () => {
  await pool.end();
});

describe("Tests d'intégration : Commentaires sur les plats", () => {

  test('Ajout d’un commentaire à un plat et vérification de la présence', async () => {
    const comment = await createComment(301, 'test_user_id', 'Commentaire de test');
    const comments = await getCommentsByMeal(301);

    // Trouver le commentaire ajouté parmi les commentaires récupérés
    const added = comments.find(c => c.commentId === comment.commentId);

    // Vérifier que le contenu du commentaire ajouté correspond à celui attendu
    expect(added.content).toBe('Commentaire de test');
  });

  test('Suppression d’un commentaire et vérification de sa disparition', async () => {
    const comment = await createComment(301, 'test_user_id', 'Commentaire à supprimer');

    // Supprimer ce commentaire
    const deleted = await deleteComment(comment.commentId);

    // Vérifier que la suppression a affecté une ligne 
    expect(deleted.affectedRows).toBe(1);

    // Récupérer tous les commentaires pour le plat 301
    const comments = await getCommentsByMeal(301);

     // Vérifier que le commentaire supprimé n'est plus présent
    const found = comments.find(c => c.commentId === comment.commentId);
    expect(found).toBeUndefined();
  });

  test('Ajout de plusieurs commentaires et vérification de leur ordre de création', async () => {
    await createComment(301, 'test_user_id', 'Premier');
    await createComment(301, 'test_user_id', 'Deuxième');

     // Récupérer tous les commentaires pour le plat 301
    const comments = await getCommentsByMeal(301);

    // Vérifier que les contenus des commentaires contiennent "Premier" et "Deuxième"
    expect(comments.map(c => c.content)).toEqual(expect.arrayContaining(['Premier', 'Deuxième'])
    );
  });

});
