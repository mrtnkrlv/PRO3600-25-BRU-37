const ratingModule = require('../Server/likes.js');
const pool = require('../Server/database.js');

jest.mock('../Server/database.js', () => ({
  query: jest.fn()
}));


// Tests sur addLikeToMeal
describe('addLikeToMeal', () => {
    test('Doit retourner null si le plat est introuvable', async () => {
      query.mockResolvedValueOnce([[]]); 

      const result = await likeModule.addLikeToMeal(-1, 1);
      expect(result).toBeNull();
    });

    test('Doit retourner null si lutilisateur est introuvable', async () => {
      query
        .mockResolvedValueOnce([[{ mealId: 1 }]])
        .mockResolvedValueOnce([[]]);

      const result = await likeModule.addLikeToMeal(1, -1);
      expect(result).toBeNull();
    });

    test('Doit retourner null si le like existe déjà', async () => {
      query
        .mockResolvedValueOnce([[{ mealId: 1 }]])
        .mockResolvedValueOnce([[{ id: 100 }]])
        .mockResolvedValueOnce([[{ mealId: 1, userId: 100 }]]);

      const result = await likeModule.addLikeToMeal(1, 100);
      expect(result).toBeNull();
    });

    test('Doit ajouter un like et mettre à jour le compteur', async () => {
      query
        .mockResolvedValueOnce([[{ mealId: 1 }]])
        .mockResolvedValueOnce([[{ id: 100 }]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await likeModule.addLikeToMeal(1, 100);
      expect(result).toEqual({ success: true, message: "Like ajouté avec succès" });
    });
});


// Tests sur removeLikeFromMeal
describe('removeLikeFromMeal', () => {
    test('Doit retourner null si le plat est introuvable', async () => {
      query.mockResolvedValueOnce([[]]);

      const result = await likeModule.removeLikeFromMeal(-1, 1);
      expect(result).toBeNull();
    });

    test('Doit retourner null si lutilisateur na pas liké ce plat', async () => {
      query
        .mockResolvedValueOnce([[{ mealId: 1 }]])
        .mockResolvedValueOnce([[]]);

      const result = await likeModule.removeLikeFromMeal(1, -1);
      expect(result).toBeNull();
    });

    test('Doit supprimer le like et décrémenter le compteur', async () => {
      query
        .mockResolvedValueOnce([[{ mealId: 1 }]])
        .mockResolvedValueOnce([[{ mealId: 1, userId: 100 }]])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await likeModule.removeLikeFromMeal(1, 100);
      expect(result).toEqual({ success: true, message: "Like retiré avec succès" });
    });
});

  