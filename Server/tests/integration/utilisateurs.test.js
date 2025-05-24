import pool from '../../database.js';
import { createUser, getUser, deleteUser, modifyUsername } from '../../user.js';
import { createComment, getCommentsByMeal, getComment } from '../../comments.js'; // adapter selon ton fichier
import { addLike, getLikesByUserAndMeal } from '../../likes.js'; // adapter selon ton fichier
import { addOrUpdateRating, getAverageRating } from '../../ratings.js';
import { getMeal, deleteMeal, addMeal } from '../../meals.js'; // si besoin

describe('5. Utilisateurs et parcours complet - tests d’intégration', () => {
  // Ids test
  const mealId = 9999; // un plat test (à créer et supprimer)
  const user1 = { id: 'user1@example.com', pwd: 'pass1', username: 'User One' };
  const user2 = { id: 'user2@example.com', pwd: 'pass2', username: 'User Two' };
  let commentIdUser1;
  
  beforeAll(async () => {
    // Créer un plat pour tests
    await addMeal(mealId, "Plat Test", 2);
  });

  afterAll(async () => {
    // Nettoyer la base : supprimer plat et utilisateurs
    await deleteMeal(mealId);
    await deleteUser(user1.id);
    await deleteUser(user2.id);
    await pool.end(); // fermer la connexion db
  });

  test('Un utilisateur s’inscrit, ajoute un commentaire et like un autre', async () => {

     await createUser(user1.id, user1.pwd, user1.username);
    // Ajouter un commentaire par user1
    const comment = await createComment(mealId, user1.id, "Super plat !");
    expect(comment.content).toBe("Super plat !");

    // Vérifier que le commentaire est bien enregistré
    const comments = await getCommentsByMeal(mealId);
    expect(comments.some(c => c.commentId === comment.commentId && c.userId === user1.id)).toBe(true);
  });
});