const mealModule = require('../Server/meals.js');
const pool = require('../Server/database.js');
const { describe } = require('@jest/globals');

jest.mock('../Server/database.js', () => ({
  query: jest.fn()
}));

// Tests sur getMeals
describe('getMeals', () => {
    test('Doit retourner tous les plats dans le bon ordre', async () => {
      pool.query.mockResolvedValueOnce([[{ mealId: 1 }, { mealId: 2 }]]);

      const result = await mealModule.getMeals();
      expect(result).toEqual([[{ mealId: 1 }, { mealId: 2 }]]);
    });
});

// Tests sur getMeal
describe('getMeal', () => {
    test('Doit retourner le plat correspondant à ID', async () => {
      pool.query.mockResolvedValueOnce([[{ mealId: 1}]]);
      const result = await mealModule.getMeal(1);
      expect(result).toEqual({ mealId: 1});
    });

    test('Doit échouer si le plat nexiste pas', async () => {
      pool.query.mockResolvedValueOnce([[]]);
      const result = await mealModule.getMeal(-1);
      expect(result).toBeNull();
    });
});

// Tests sur addMeal
describe('addMeal', () => {
    test('Dois ajouter correctement le plat', async () => {
        //A compléter
    });

    test('Doit échouer si positionInWeek nest pas entre 0 et 5', async () => {
        await expect(mealModule.addMeal(5, 'Plat', 6)).rejects.toThrow();
      });
  
      test('Dois échouer si ID existe déjà', async () => {
        pool.query.mockResolvedValueOnce([[{ mealId: 5 }]]);
        await expect(mealModule.addMeal(5, 'Plat', 2)).rejects.toThrow();
      });
});


// Tests sur deleteMeal
describe('deleteMeal', () => {
    test('Doit supprimer le plat', async () => {
      pool.query
        .mockResolvedValueOnce()
        .mockResolvedValueOnce()
        .mockResolvedValueOnce();
      const result = await mealModule.deleteMeal(1);
      expect(result).toEqual({ success: true });
    });
});

// Tests sur getScheduleMeals
describe('getScheduledMeals', () => {
    test('Doit retourner les plats dont la position est entre 1 et 5', async () => {
      pool.query.mockResolvedValueOnce([[{ mealId: 1 }, { mealId: 2 }]]);
      const result = await mealModule.getScheduledMeals();
      expect(result).toEqual([{ mealId: 1 }, { mealId: 2 }]);
    });
});


// Tests sur UpdateMealPosition
describe('updateMealPosition', () => {
    test('Doit échouer si la poisiton est invalide', async () => {
      await expect(mealModule.updateMealPosition(1, 6)).rejects.toThrow();
    });

    test('Doit échouer si le plat nexiste pas', async () => {
      connection.query.mockResolvedValueOnce([[]]); 
      await expect(mealModule.updateMealPosition(-1, 1)).rejects.toThrow();
    });

    test('Doit vérifier que la position a bien été modifiée', async () => {
      //A Compléter
    });
});