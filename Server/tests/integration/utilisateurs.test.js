import pool from '../../database.js';
import { createUser, getUser, deleteUser, modifyUsername } from '../../user.js';
import { addComment, getCommentsByMeal, modifyComment, deleteComment } from '../../comments.js'; // adapter selon ton fichier
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
    await addMeal({ mealId, name: "Plat Test", description: "Plat de test" });
    // Créer les utilisateurs
    await createUser(user1.id, user1.pwd, user1.username);
    await createUser(user2.id, user2.pwd, user2.username);
  });

  afterAll(async () => {
    // Nettoyer la base : supprimer plat et utilisateurs
    await deleteMeal(mealId);
    await deleteUser(user1.id);
    await deleteUser(user2.id);
    await pool.end(); // fermer la connexion db
  });

  test('Un utilisateur s’inscrit, ajoute un commentaire et like un autre', async () => {
    // Ajouter un commentaire par user1
    const comment = await addComment(mealId, user1.id, "Super plat !");
    commentIdUser1 = comment.commentId;
    expect(comment).toHaveProperty('commentId');
    expect(comment.text).toBe("Super plat !");
    
    // Ajouter un like par user1 sur un autre plat (ici même mealId pour simplicité)
    const likeResult = await addLike(mealId, user1.id);
    expect(likeResult).toHaveProperty('success', true);

    // Vérifier que le commentaire est bien enregistré
    const comments = await getCommentsByMeal(mealId);
    expect(comments.some(c => c.commentId === commentIdUser1 && c.userId === user1.id)).toBe(true);

    // Vérifier que le like est bien enregistré
    const likes = await getLikesByUserAndMeal(mealId, user1.id);
    expect(likes.length).toBeGreaterThanOrEqual(1);
  });
});