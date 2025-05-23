import { addLikeToMeal, removeLikeFromMeal } from '../../likes.js';
import pool from '../../database.js';

beforeEach(async () => {
  // Ajouter un utilisateur et un plat de test 
  await pool.query("INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)", ['test_id', 'pwd', 'test_user']);
  await pool.query("INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)", ['test_id2', 'pwd2', 'test_user2']);
  await pool.query("INSERT IGNORE INTO meals (mealId, mealName) VALUES (?, ?)", [1,'test_meal']);  
});

afterAll(async () => {
  // Nettoyer les données de test et fermer le pool
  await pool.query("DELETE FROM likes WHERE mealId = ?", [1]);
  await pool.query("DELETE FROM meals WHERE mealId = ?", [1]);
  await pool.query("DELETE FROM user WHERE id = ?", ['test_id']);
  await pool.end();
});

//Tests pour la méthode addLikeToMeal
describe('Tests de addLikeToMeal', () => {
  test('Retourne null si le plat est introuvable', async () => {
    const result = await addLikeToMeal(-1, 'test_id');
    expect(result).toBeNull();
  });

  test("Retourne null si l'utilisateur est introuvable", async () => {
    const result = await addLikeToMeal(1, 'unknownUser');
    expect(result).toBeNull();
  });

  test('Ajoute un like et met à jour le compteur', async () => { 
    const result = await addLikeToMeal(1, 'test_id');
    expect(result).toEqual({ success: true, message: expect.any(String) });

    const [tab] = await pool.query('SELECT likes FROM meals WHERE mealId = 1');
    expect(tab[0].likes).toBe(1);
  });

  test('Retourne null si le like existe déjà', async () => {
    await addLikeToMeal(1, 'test_id');
    const result = await addLikeToMeal(1, 'test_id');
    expect(result).toBeNull();
  });
});


//Tests pour la méthode addLikeToMeal
describe('Tests de removeLikeFromMeal', () => {
  test('Retourne null si le plat est introuvable', async () => {
    const result = await removeLikeFromMeal(-1, 'test_id');
    expect(result).toBeNull();
  });

  test("Retourne null si l'utilisateur n'a pas liké ce plat", async () => {
    const result = await removeLikeFromMeal(1, 'test_id2');
    expect(result).toBeNull();
  });

  test('Supprime le like et décrémente le compteur', async () => {
    await addLikeToMeal(1, 'test_id');
    const result = await removeLikeFromMeal(1, 'test_id');
    expect(result).toEqual({ success: true, message: expect.any(String) });

    const [tab] = await pool.query('SELECT likes FROM meals WHERE mealId = 1');
    expect(tab[0].likes).toBe(0);
  });
});
