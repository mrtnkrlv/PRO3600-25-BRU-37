import { addMeal, getMeal, getMeals, deleteMeal, updateMealPosition } from '../../meals.js';
import pool from '../../database.js';

beforeEach(async () => {
  //Nettoyage après chaque test
  await pool.query("DELETE FROM meals WHERE mealId IN (?, ?, ?)", [201, 202, 203]);
});

afterAll(async () => {
  //Fermeture du pool
  await pool.end();
});

describe("Tests d’intégration : Gestion des plats", () => {

  test("Ajout d’un plat puis vérification dans la liste triée", async () => {
    await addMeal(201, 'Plat1', 2); //Ajout du plat

    //Récupération de tous les plats de la base
    const result = await getMeals();
    const plats = result[0]; //Récupération du tableau de plats

    const added = plats.find(p => p.mealId === 201); //Trouve le plat dont l'ID est 201

    expect(added.mealName).toBe('Plat1'); //Vérifie que le nom du plat correspond bien à ce qui a été ajouté
    expect(added.positionInWeek).toBe(2); // Vérifie que la position du plat est bien celle attendue
  });

  test("Ajout d’un plat puis mise à jour de sa position", async () => {
    await addMeal(202, 'Plat2', 1); //Ajout du plat

    const updated = await updateMealPosition(202, 4); //Mise à jour position
    expect(updated.positionInWeek).toBe(4);

    const meal = await getMeal(202); 
    expect(meal.positionInWeek).toBe(4); //Vérification que la mise à jour de la position a fonctionné
  });

  test("Ajout d’un plat avec une position invalide doit échouer", async () => {
    await expect(addMeal(203, 'Plat Invalide', 8)).rejects.toThrow('positionInWeek doit être un entier entre 0 (non placé) et 5');
  });

});