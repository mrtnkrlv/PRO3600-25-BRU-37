const ratingModule = require('../Server/comments.js');
const pool = require('../Server/database.js');

jest.mock('../Server/database.js', () => ({
  query: jest.fn()
}));


  
  beforeAll(async () => {
    await pool.query('DELETE FROM comments');
    await pool.query('INSERT INTO user (id, name) VALUES (?, ?)', [1, 'TestUser']);
    await pool.query('INSERT INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)', [1, 'TestMeal', 1]);
  });
  
  afterAll(async () => {
    await pool.end();
  });
  
  //Test pour createComment
  describe('createComment', () => {
    test('doit créer un nouveau commentaire', async () => {
      const comment = await createComment(1, 1, 'TestCommentaire', null);
      expect(comment.content).toBe('TestCommentaire');
    });
  });
  
  //Test pour deleteComment
  describe('deleteComment', () => {
    test('doit supprimer un commentaire', async () => {
      const comment = await createComment(1, 1, 'Com à suppr', null);
      const result = await deleteComment(comment.commentId);
      expect(result.affectedRows).toBe(1);
    });
  });
  
  //Test pour getCommentByMeal
  describe('getCommentsByMeal', () => {
    test('Doit retourner tous les commentaires dun plat', async () => {
      await createComment(1, 1, 'Comm1', null);
      await createComment(1, 1, 'Comm2', null);
      const comments = await getCommentsByMeal(1);
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBe(2);
    });
  });
  
  //Test pour getCommentsByUser
  describe('getCommentsByUser', () => {
    test('Doit retourner tous les commentaires dun utilisateur', async () => {
      //A compléter
    });
  });
  
  //Test pour updateComment
  describe('updateComment', () => {
    test('Doit modifier le contenu dun commentaire', async () => {
      const comment = await createComment(1, 1, 'Contenu', null);
      const result = await updateComment(comment.commentId, 'Nouveau contenu');
      expect(result.message).toBe('Comments updated successfuly');
  
      const updated = await getComment(comment.commentId);
      expect(updated.content).toBe('Updated content');
    });
  });
  