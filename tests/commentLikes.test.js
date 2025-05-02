const ratingModule = require('../Server/commentLikes.js');
const pool = require('../Server/database.js');

jest.mock('../Server/database.js', () => ({
  query: jest.fn()
}));

await pool.query('INSERT INTO user (id, name) VALUES (?, ?)', [1, 'TestUtilisateur']);
await pool.query('INSERT INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)', [1, 'TestRepas', 1]);
await pool.query(`INSERT INTO comments (commentId, mealId, userId, content, likes) VALUES (?, ?, ?, ?, ?)`, [1, 1, 1, 'TestCommentaire', 0]);

// Tests pour createLike
describe('createLike', () => {
    test('Doit retourner null si utilisateur nexiste pas', async () => {
      const result = await createLike(-1, 1, 1);
      expect(result).toBeNull();
    });
  
    test('Doit retourner null si le plat nexiste pas', async () => {
      const result = await createLike(1, -1, 1);
      expect(result).toBeNull();
    });
  
    test('Doit retourner null si le commentaire nexiste pas', async () => {
      const result = await createLike(1, 1, -1);
      expect(result).toBeNull();
    });

    test('Doit créer un like associé à un commentaire', async () => {
      const result = await createLike(1, 1, 1);
      expect(result).toHaveProperty('affectedRows');
      expect(result.affectedRows).toBe(1);
    });
  });
  

// Tests pour addLikeToComment
describe('addLikeToComment', () => {
  /*
  test('Doit ajouter un like et incrémenter le compteur', async () => {
    await pool.query('DELETE FROM commentLikes WHERE userId = ? AND commentId = ?', [1, 1]);
    const result = await addLikeToComment(1, 1, 1);
    expect(result).toEqual({ success: true });

    const [[comment]] = await pool.query('SELECT likes FROM comments WHERE commentId = ?', [1]);
    expect(comment.likes).toBeGreaterThan(0);
  });
  */

  test('Doit échouer si le like existe déjà', async () => {
    await expect(addLikeToComment(1, 1, 1)).rejects.toThrow('Like déjà existant');
  });
});


//Tests pour removeLikeFromComment
describe('removeLikeFromComment', () => {
  test('Doit retirer un like et décrémenter le compteur', async () => {
    const result = await removeLikeFromComment(1, 1);
    expect(result).toEqual({ success: true });

    const [[comment]] = await pool.query('SELECT likes FROM comments WHERE commentId = ?', [1]);
    expect(comment.likes).toBe(0);
  });

  test('Doit échouer si le like nexiste pas', async () => {
    await expect(removeLikeFromComment(1, 1)).rejects.toThrow('Like introuvable');
  });
});