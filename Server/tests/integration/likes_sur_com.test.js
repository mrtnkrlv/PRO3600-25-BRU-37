import pool from '../../database.js';
import { addLikeToComment, removeLikeFromComment } from '../../commentLikes.js';
import { createComment } from '../../comments.js';
import { addMeal } from '../../meals.js';

beforeEach(async () => {
  // Setup : création d'un utilisateur, d'un plat et d'un commentaire
  await pool.query(`INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)`, ['like_user', 'pwd', 'UserLike']);
  await addMeal(300, 'Liked Meal', 3);

  await createComment(300, 'like_user', 'Un commentaire à liker', null);
});

afterEach(async () => {
  // Supprimer tous les likes des commentaires liés au plat
  await pool.query(`
    DELETE FROM commentLikes 
    WHERE commentId IN (SELECT commentId FROM comments WHERE mealId = ?)`, [300]);

  // Supprimer tous les commentaires liés au plat
  await pool.query(`DELETE FROM comments WHERE mealId = ?`, [300]);

  // Supprimer le plat
  await pool.query(`DELETE FROM meals WHERE mealId = ?`, [300]);

  // Supprimer l'utilisateur
  await pool.query(`DELETE FROM user WHERE id = ?`, ['like_user']);
});

afterAll(async () => {
  await pool.end();
});

describe('Tests d\'intégration des likes sur les commentaires', () => {

  test('Un utilisateur peut liker un commentaire, et le compteur augmente', async () => {
    const res = await addLikeToComment(3000, 'like_user', 300);

    const [rows] = await pool.query(`SELECT likes FROM comments WHERE commentId = ?`, [3000]);
    expect(rows[0].likes).toBe(1);
  });

  test('Un utilisateur ne peut pas liker deux fois le même commentaire', async () => {
    await addLikeToComment(3000, 'like_user', 300);

    await expect(addLikeToComment(3000, 'like_user', 300))
      .rejects
      .toThrow('Like déjà existant');
  });

  test('Un utilisateur peut unliker un commentaire, et le compteur diminue', async () => {
    await addLikeToComment(3000, 'like_user', 300);

    const res = await removeLikeFromComment(3000, 'like_user');
    expect(res).toEqual({ success: true });

    const [rows] = await pool.query(`SELECT likes FROM comments WHERE commentId = ?`, [3000]);
    expect(rows[0].likes).toBe(0);
  });

  test('Unliker un commentaire non liké échoue', async () => {
    await expect(removeLikeFromComment(3000, 'like_user'))
      .rejects
      .toThrow('Like introuvable');
  });
});