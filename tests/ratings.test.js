const ratingModule = require('../Server/ratings.js');
const pool = require('../Server/database.js');

jest.mock('../Server/database.js', () => ({
  query: jest.fn()
}));


// Tests sur addOrUpdate
describe('addOrUpdateRating', () => {

  test('Doit échouer si la note est invalide', async () => {
    await expect(ratingModule.addOrUpdateRating(1, 1, 6)).rejects.toThrow("La note doit être un entier entre 1 et 5.");
  });

  test('rDoit échouer si le plat est introuvable', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    await expect(ratingModule.addOrUpdateRating(-1, 1, 4)).rejects.toThrow("Plat introuvable."); //L'ID -1 n'est pas attribuable
  });

  test('Doit échouer si l’utilisateur est introuvable', async () => {
    pool.query
      .mockResolvedValueOnce([[{ mealId: 1 }]])
      .mockResolvedValueOnce([[]]);

    await expect(ratingModule.addOrUpdateRating(1, -1, 4)).rejects.toThrow("Utilisateur introuvable.");
  });

  test('Doit ajouter une nouvelle note si aucune note nexiste', async () => {
    pool.query
      .mockResolvedValueOnce([[{ mealId: 1 }]])
      .mockResolvedValueOnce([[{ id: 1 }]])
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([[{ rating: 4 }, { rating: 5 }]])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([[{ rating: 4 }]]);

    const result = await ratingModule.addOrUpdateRating(1, 1, 4);
    const res = await ratingModule.getUserRating(1, 1);
    expect(result).toEqual({ success: true, message: 'Note ajoutée.' });
    expect(res).toBe(4);
  });

  test('Doit mettre à jour une note existante', async () => {
    pool.query
      .mockResolvedValueOnce([[{ mealId: 1 }]])
      .mockResolvedValueOnce([[{ id: 1 }]])
      .mockResolvedValueOnce([[{ rating: 3 }]])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([[{ rating: 5 }, { rating: 4 }]])
      .mockResolvedValueOnce([]);

    const result = await ratingModule.addOrUpdateRating(1, 1, 5);
    expect(result).toEqual({ success: true, message: 'Note mise à jour.' });
  });
});


// Tests sur removeRating
describe('removeRating', () => {

  test('Doit échouer si le plat nexiste pas', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    await expect(ratingModule.removeRating(-1, 1)).rejects.toThrow("Plat introuvable.");
  });

  test('Doit échouer si la note nexiste pas', async () => {
    pool.query
      .mockResolvedValueOnce([[{ mealId: 1 }]])
      .mockResolvedValueOnce([[]]);
    await expect(ratingModule.removeRating(1, -1)).rejects.toThrow("Note inexistante pour ce plat et cet utilisateur.");
  });

  test('Doit supprimer une note existante', async () => {
    pool.query
      .mockResolvedValueOnce([[{ mealId: 1 }]])
      .mockResolvedValueOnce([[{ rating: 4 }]])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([[{ rating: 5 }, { rating: 3 }]])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([[{ averageRating: 4 }]]);

    const result = await ratingModule.removeRating(1, 1);
    const res = await ratingModule.getAverageRating(1);
    expect(result).toEqual({ success: true, message: "Note supprimée." });
    expect(res).toBe(4);
  });
});


//Tests sur getUserRating
describe('getUserRating', () => {
  test('Doit retourner la note de l’utilisateur si elle existe', async () => {
    pool.query.mockResolvedValueOnce([[{ rating: 4 }]]);
    const result = await ratingModule.getUserRating(1, 1);
    expect(result).toBe(4);
  });
});


//Tests sur getAverageRating
describe('getAverageRating', () => {
  test('Doit retourner la moyenne si des notes existent', async () => {
    pool.query.mockResolvedValueOnce([[{ averageRating: 4 }]]);
    const moy = await ratingModule.getAverageRating(1);
    expect(moy).toBe(4);
  });
});
