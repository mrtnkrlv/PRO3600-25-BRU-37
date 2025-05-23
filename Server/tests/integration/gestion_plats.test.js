import { addMeal, getMeal, getMeals, deleteMeal, updateMealPosition } from '../../meals.js';
import pool from '../../database.js';

beforeEach(async () => {
  // Nettoyage
  await pool.query('DELETE FROM meals WHERE mealId IN (?, ?, ?)', [201, 202, 203]);
});

afterAll(async () => {
  await pool.end();
});

describe('Tests d’intégration - Gestion des plats', () => {

  test('Ajout d’un plat puis vérification dans la liste triée', async () => {
    await addMeal(201, 'Plat1', 2);

    const result = await getMeals();
    const plats = result[0];

    const added = plats.find(p => p.mealId === 201); 
    expect(added.mealName).toBe('Plat1');
    expect(added.positionInWeek).toBe(2);
  });

  test('Ajout d’un plat puis mise à jour de sa position', async () => {
    await addMeal(202, 'Plat2', 1);

    // Mise à jour position
    const updated = await updateMealPosition(202, 4);
    expect(updated.positionInWeek).toBe(4);

    const meal = await getMeal(202);
    expect(meal.positionInWeek).toBe(4);
  });

  test('Ajout d’un plat avec une position invalide doit échouer', async () => {
    await expect(addMeal(203, 'Plat Invalide', 8)).rejects.toThrow('positionInWeek doit être un entier entre 0 (non placé) et 5');
  });

});