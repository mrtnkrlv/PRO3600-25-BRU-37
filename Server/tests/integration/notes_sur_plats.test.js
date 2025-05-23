import pool from '../../database.js';
import { addMeal, deleteMeal, getMeal } from '../../meals.js';
import { addOrUpdateRating, removeRating, getUserRating } from '../../ratings.js';

beforeEach(async () => {
  await pool.query(`DELETE FROM meals WHERE mealId = ?`, [400]);
  // Créer 2 utilisateurs
  await pool.query(`INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?), (?, ?, ?)`, [
    'user1', 'pwd1', 'User One',
    'user2', 'pwd2', 'User Two',
  ]);
  // Ajouter un plat
  await addMeal(400, 'Plat à noter', 5);
});

afterEach(async () => {
  // Supprimer les notes liées au plat 400
  await pool.query(`DELETE FROM ratings WHERE mealId = ?`, [400]);
  // Supprimer le plat
  await deleteMeal(400);
  // Supprimer les utilisateurs
  await pool.query(`DELETE FROM user WHERE id IN (?, ?)`, ['user1', 'user2']);
});

afterAll(async () => {
  await pool.end();
});

describe('Notes des plats', () => {

  test('Ajouter un plat, le noter, vérifier moyenne', async () => {
    const res = await addOrUpdateRating(400, 'user1', 4);
    expect(res).toEqual({ success: true, message: expect.stringContaining('Note') });

    const meal = await getMeal(400);
    expect(meal.ratingCount).toBe(1);
    expect(Number(meal.averageRating)).toBe(4);

    const userRating = await getUserRating(400, 'user1');
    expect(Number(userRating)).toBe(4);
  });

  test('Deux utilisateurs notent le même plat : vérifier calcul correct moyenne', async () => {
    await addOrUpdateRating(400, 'user1', 4);
    await addOrUpdateRating(400, 'user2', 2);

    const meal = await getMeal(400);
    expect(Number(meal.ratingCount)).toBe(2);
    expect(Number(meal.averageRating)).toBe((4 + 2) / 2, 5);

    const user1Rating = await getUserRating(400, 'user1');
    const user2Rating = await getUserRating(400, 'user2');
    expect(user1Rating).toBe(4);
    expect(user2Rating).toBe(2);
  });

   test('Supprimer un plat : vérifier que notes associées sont supprimées', async () => {
    await addOrUpdateRating(400, 'user1', 5);
    await addOrUpdateRating(400, 'user2', 3);

    await deleteMeal(400);

    const [ratings] = await pool.query(`SELECT * FROM ratings WHERE mealId = ?`, [400]);
    expect(ratings.length).toBe(0);
  });

});