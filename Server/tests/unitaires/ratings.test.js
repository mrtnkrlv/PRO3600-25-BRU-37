import { addOrUpdateRating, removeRating, getUserRating, getAverageRating } from '../../ratings.js';
import pool from '../../database.js';

beforeEach(async () => {
  //Créer un utilisateur et un plat de test
  await pool.query("INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)", ['test_id', 'pwd', 'test_user']);
  await pool.query("INSERT IGNORE INTO meals (mealId, mealName) VALUES (?, ?)", [1, 'test_meal']);
});

afterEach(async () => {
  //Nettoie uniquement les ratings du test, pas les plats ni les users
  await pool.query("DELETE FROM ratings WHERE mealId = ? AND userId = ?", [1, 'test_id']);
  //Remet la moyenne et le compteur à 0
  await pool.query("UPDATE meals SET averageRating = 0, ratingCount = 0 WHERE mealId = 1");
});

afterAll(async () => {
  //Nettoyage de la base de données
  await pool.query("DELETE FROM meals WHERE mealId = 1");
  await pool.query("DELETE FROM user WHERE id = 'test_id'");
  await pool.end();
});

//Tests de addOrUpdateRating
describe("Tests de addOrUpdateRating", () => {
  test("Retourne une erreur si la note est invalide (<1)", async () => {
    await expect(addOrUpdateRating(1, 'test_id', 0)).rejects.toThrow("La note doit être un entier entre 1 et 5.");
  });

  test("Retourne une erreur si la note est invalide (>5)", async () => {
    await expect(addOrUpdateRating(1, 'test_id', 6)).rejects.toThrow("La note doit être un entier entre 1 et 5.");
  });

  test("Retourne une erreur si le plat est introuvable", async () => {
    await expect(addOrUpdateRating(-1, 'test_id', 4)).rejects.toThrow("Plat introuvable.");
  });

  test("Retourne une erreur si l'utilisateur est introuvable", async () => {
    await expect(addOrUpdateRating(1, 'unknown_user', 4)).rejects.toThrow("Utilisateur introuvable.");
  });

  test("Ajoute une nouvelle note et met à jour la moyenne", async () => {
    const result = await addOrUpdateRating(1, 'test_id', 4);
    expect(result).toEqual({ success: true, message: "Note ajoutée." });

    // Vérifie que la base de données contient bien la bonne moyenne et le bon compteur
    const [tab] = await pool.query("SELECT averageRating, ratingCount FROM meals WHERE mealId = 1");
    expect(Number(tab[0].averageRating)).toBe(4);
    expect(tab[0].ratingCount).toBe(1);
  });

  test("Met à jour une note existante", async () => {
    await addOrUpdateRating(1, 'test_id', 3);
    const result = await addOrUpdateRating(1, 'test_id', 5);

    expect(result).toEqual({ success: true, message: "Note mise à jour." });

    // Vérifie que la moyenne est bien mise à jour
    const [tab] = await pool.query("SELECT averageRating, ratingCount FROM meals WHERE mealId = 1");
    expect(Number(tab[0].averageRating)).toBe(5);
    expect(tab[0].ratingCount).toBe(1);
  });
});

//Tests de removeRating
describe("Tests de removeRating", () => {
  test("Retourne une erreur si le plat est introuvable", async () => {
    await expect(removeRating(-1, 'test_id')).rejects.toThrow("Plat introuvable.");
  });

  test("Retourne une erreur si aucune note n'existe", async () => {
    await expect(removeRating(1, 'test_id')).rejects.toThrow("Note inexistante pour ce plat et cet utilisateur.");
  });

  test("Supprime une note et met à jour la moyenne", async () => {
    await addOrUpdateRating(1, 'test_id', 4);
    const result = await removeRating(1, 'test_id');

    expect(result).toEqual({ success: true, message: "Note supprimée." });

    // Vérifie que la moyenne et le compteur sont bien remis à zéro
    const [tab] = await pool.query("SELECT averageRating, ratingCount FROM meals WHERE mealId = 1");
    expect(Number(tab[0].averageRating)).toBe(0);
    expect(tab[0].ratingCount).toBe(0);
  });
});

//Tests de getUserRating
describe("Tests de getUserRating", () => {
  test("Retourne null si l'utilisateur n'a pas noté", async () => {
    const rating = await getUserRating(1, 'test_id');
    expect(rating).toBeNull();
  });

  test("Retourne la note enregistrée", async () => {
    await addOrUpdateRating(1, 'test_id', 5);
    const rating = await getUserRating(1, 'test_id');
    expect(rating).toBe(5);
  });
});

//Tests de getAverageRating
describe("Tests de getAverageRating", () => {
  test("Retourne null si aucune note", async () => {
    const avg = await getAverageRating(1);
    expect(avg).toBeNull();
  });

  test("Retourne la moyenne correcte", async () => {
    await addOrUpdateRating(1, 'test_id', 4);
    const avg = await getAverageRating(1);
    expect(Number(avg)).toBe(4);
  });
});