import { getMeal, getMealByName, addMeal, deleteMeal, getScheduledMeals, updateMealPosition } from '../../meals.js';
import pool from '../../database.js';
import { afterEach } from '@jest/globals';

const test_meal_id = 100;

beforeAll(async () => {
  //Créer un plat de test
  await pool.query("INSERT IGNORE INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)", [test_meal_id, 'test_meal', 0, ]);
});

afterAll(async () => {
  // Nettoyage de la base de données
  await pool.query("DELETE FROM comments WHERE mealId = ?", [test_meal_id]);
  await pool.query("DELETE FROM meals WHERE mealId = ?", [test_meal_id]);
  await pool.end();
});


//Tests de getMeal
describe("Tests de getMeal", () => {
  test("Retourne un plat existant", async () => {
    const meal = await getMeal(test_meal_id);
    expect(meal.mealId).toBe(test_meal_id);
  });

  test("Retourne null si le plat n’existe pas", async () => {
    const meal = await getMeal(-1);
    expect(meal).toBeNull();
  });
});

//Tests de getMealByName
describe("Tests de getMealByName", () => {
  test('Retourne l’ID du plat existant', async () => {
    const mealId = await getMealByName('test_meal');
    expect(mealId).toBe(test_meal_id);
  });

  test("Retourne null si le plat n’existe pas", async () => {
    const mealId = await getMealByName('plat_inexistant');
    expect(mealId).toBeNull();
  });
});

//Tests de addMeal
describe("Tests de addMeal", () => {

  afterEach(async () => {
    // Supprimer le plat ajouté dans ce test spécifique
    await pool.query("DELETE FROM meals WHERE mealId = ?", [101]);
});

  test("Ajoute un plat valide", async () => {
    const newMeal = await addMeal(101, 'nouveau_plat', 2);
    expect(newMeal).toBeDefined();
    expect(newMeal.mealId).toBe(101);
    expect(newMeal.mealName).toBe('nouveau_plat');
    expect(newMeal.positionInWeek).toBe(2);
  });

  test("Échoue si positionInWeek invalide", async () => {
    await expect(addMeal(101, 'nouveau_plat', 10)).rejects.toThrow('positionInWeek doit être un entier entre 0 (non placé) et 5');
  });
});

//Tests de deleteMeal
describe("Tests de deleteMeal", () => {
  test("Supprime un plat existant", async () => {
    // Ajouter un plat à supprimer
    await pool.query("INSERT IGNORE INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)", [102, 'plat_à_supprimer', 0,]);

    const result = await deleteMeal(102);
    expect(result).toEqual({ success: true });

    const deletedMeal = await getMeal(102);
    expect(deletedMeal).toBeNull();

    // Nettoyer si le test échoue
    await pool.query("DELETE FROM meals WHERE mealId = ?", [102]);
  });

  test("N'échoue pas si le plat n’existe pas", async () => {
    const result = await deleteMeal(-1);
    expect(result).toEqual({ success: true });
  });
});

//Tests de getScheduledMeals
describe("Tests de getScheduledMeals", () => {
  test("Retourne les plats avec positionInWeek entre 1 et 5", async () => {
    //Supprimer le plat s'il existe déjà
    await pool.query("DELETE FROM meals WHERE mealId = ?", [103]);

    //Ajouter un plat avec positionInWeek = 3
    await pool.query("INSERT INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)", [103,'plat_programmé', 3,]);

    const scheduledMeals = await getScheduledMeals();
    expect(scheduledMeals.some(m => m.mealId === 103)).toBe(true); //Teste si le plat de test est bien récupéré

    //Nettoyer
    await pool.query("DELETE FROM meals WHERE mealId = ?", [103]);
  });
});

//Tests de updateMealPosition
describe("Tests de updateMealPosition", () => {
  test("Met à jour la position d’un plat valide", async () => {
    const updatedMeal = await updateMealPosition(test_meal_id, 4);
    expect(updatedMeal.positionInWeek).toBe(4);

    // Remettre la position à 0
    await updateMealPosition(test_meal_id, 0);
  });

  test("Échoue si position invalide", async () => { 
    await expect(updateMealPosition(test_meal_id, 10)).rejects.toThrow('La nouvelle position doit être un entier entre 0 (non placé) et 5');
  });

  test("Échoue si le plat n’existe pas", async () => {
    await expect(updateMealPosition(-1, 3)).rejects.toThrow("Aucun plat trouvé avec l'ID -1");
  });
});