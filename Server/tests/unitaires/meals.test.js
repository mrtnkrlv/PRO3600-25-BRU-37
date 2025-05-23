import {
  getMeals,
  getMeal,
  getMealByName,
  addMeal,
  deleteMeal,
  getScheduledMeals,
  updateMealPosition
} from '../../meals.js';
import pool from '../../database.js';

const TEST_MEAL_ID = 100;
const TEST_MEAL_NAME = 'test_meal';

beforeEach(async () => {
  // Préparation : insérer un plat test
  await pool.query(`INSERT IGNORE INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)`, [
    TEST_MEAL_ID,
    TEST_MEAL_NAME,
    0,
  ]);
});

afterEach(async () => {
  // Nettoyage : supprimer les plats de test
  await pool.query(`DELETE FROM meals WHERE mealId = ?`, [TEST_MEAL_ID]);
});

afterAll(async () => {
  await pool.end();
});

describe('Tests de getMeals', () => {
  test('Retourne la liste des plats triés par positionInWeek', async () => {
    const result = await getMeals();
    expect(Array.isArray(result)).toBe(true);
    expect(result.some(m => m.mealId === TEST_MEAL_ID)).toBe(true);
  });
});

describe('Tests de getMeal', () => {
  test('Retourne un plat existant', async () => {
    const meal = await getMeal(TEST_MEAL_ID);
    expect(meal).toBeDefined();
    expect(meal.mealId).toBe(TEST_MEAL_ID);
  });

  test('Retourne null si le plat n’existe pas', async () => {
    const meal = await getMeal(99999);
    expect(meal).toBeNull();
  });
});

describe('Tests de getMealByName', () => {
  test('Retourne l’ID du plat existant', async () => {
    const mealId = await getMealByName(TEST_MEAL_NAME);
    expect(mealId).toBe(TEST_MEAL_ID);
  });

  test('Retourne null si le plat n’existe pas', async () => {
    const mealId = await getMealByName('plat_inexistant');
    expect(mealId).toBeNull();
  });
});

describe('Tests de addMeal', () => {
  afterEach(async () => {
    // Supprimer le plat ajouté dans ce test spécifique
    await pool.query(`DELETE FROM meals WHERE mealId = ?`, [101]);
  });

  test('Ajoute un plat valide', async () => {
    const newMeal = await addMeal(101, 'nouveau_meal', 2);
    expect(newMeal).toBeDefined();
    expect(newMeal.mealId).toBe(101);
    expect(newMeal.mealName).toBe('nouveau_meal');
    expect(newMeal.positionInWeek).toBe(2);
  });

  test('Échoue si positionInWeek invalide', async () => {
    await expect(addMeal(101, 'nouveau_meal', 10)).rejects.toThrow(
      'positionInWeek doit être un entier entre 0 (non placé) et 5'
    );
  });
});

describe('Tests de deleteMeal', () => {
  beforeEach(async () => {
    // Ajouter un plat à supprimer
    await pool.query(`INSERT INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)`, [
      102,
      'meal_a_supprimer',
      0,
    ]);
  });

  test('Supprime un plat existant', async () => {
    const result = await deleteMeal(102);
    expect(result).toEqual({ success: true });

    const deletedMeal = await getMeal(102);
    expect(deletedMeal).toBeNull();
  });

  test('Ne plante pas si le plat n’existe pas', async () => {
    const result = await deleteMeal(99999);
    expect(result).toEqual({ success: true });
  });
});

describe('Tests de getScheduledMeals', () => {
  test('Retourne les plats avec positionInWeek entre 1 et 5', async () => {
    // Préparer un plat avec positionInWeek 3
    await pool.query(`INSERT INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)`, [
      103,
      'meal_programmé',
      3,
    ]);

    const scheduledMeals = await getScheduledMeals();
    expect(Array.isArray(scheduledMeals)).toBe(true);
    expect(scheduledMeals.some(m => m.mealId === 103)).toBe(true);

    // Nettoyer
    await pool.query(`DELETE FROM meals WHERE mealId = ?`, [103]);
  });
});

describe('Tests de updateMealPosition', () => {
  test('Met à jour la position d’un plat valide', async () => {
    const updatedMeal = await updateMealPosition(TEST_MEAL_ID, 4);
    expect(updatedMeal.positionInWeek).toBe(4);

    // Remettre la position à 0
    await updateMealPosition(TEST_MEAL_ID, 0);
  });

  test('Échoue si position invalide', async () => {
    await expect(updateMealPosition(TEST_MEAL_ID, 10)).rejects.toThrow(
      'La nouvelle position doit être un entier entre 0 (non placé) et 5'
    );
  });

  test('Échoue si le plat n’existe pas', async () => {
    await expect(updateMealPosition(99999, 3)).rejects.toThrow(`Aucun plat trouvé avec l'ID 99999`);
  });
});