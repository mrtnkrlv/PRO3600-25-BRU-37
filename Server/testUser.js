import pool from './database.js';
import { getUser, createUser, deleteUser, modifyUsername, modifyPassword } from './user.js';

// Mock de la connexion à la base de données
jest.mock('./database.js', () => ({
  query: jest.fn()
}));

describe('Module User', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });


  describe('getUser', () => {
    test('devrait retourner les données utilisateur quand l\'ID existe', async () => {
      const mockUser = { id: 'test@example.com', username: 'Test User', password: 'hashedPassword' };
      pool.query.mockResolvedValueOnce([[mockUser]]);
      
      const result = await getUser('test@example.com');
      
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM user WHERE id = ?'),
        ['test@example.com']
      );
      expect(result).toEqual(mockUser);
    });
    
    test('devrait retourner un tableau vide quand l\'ID n\'existe pas', async () => {
      pool.query.mockResolvedValueOnce([[]]);
      
      const result = await getUser('nonexistent@example.com');
      
      expect(result).toBeUndefined();
    });
  });

  
  describe('createUser', () => {
    test('devrait créer un utilisateur et retourner ses données', async () => {
      const mockUser = { id: 'new@example.com', username: 'New User', password: 'password123' };
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
      pool.query.mockResolvedValueOnce([[mockUser]]);
      
      const result = await createUser('new@example.com', 'password123', 'New User');
      
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user'),
        ['new@example.com', 'password123', 'New User']
      );
      expect(result).toEqual(mockUser);
    });
    
    test('devrait échouer si l\'utilisateur existe déjà', async () => {
      pool.query.mockRejectedValueOnce(new Error('Duplicate entry'));
      
      await expect(createUser('existing@example.com', 'password', 'User')).rejects.toThrow('Duplicate entry');
    });
  });

  
  describe('deleteUser', () => {
    test('devrait supprimer un utilisateur existant', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      
      const result = await deleteUser('test@example.com');
      
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM user WHERE id = ?'),
        ['test@example.com']
      );
      expect(result.affectedRows).toBe(1);
    });
    
    test('devrait retourner 0 affected rows si l\'utilisateur n\'existe pas', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
      
      const result = await deleteUser('nonexistent@example.com');
      
      expect(result.affectedRows).toBe(0);
    });
  });

  
  describe('modifyUsername', () => {
    test('devrait modifier le nom d\'utilisateur', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      
      const result = await modifyUsername('test@example.com', 'New Username');
      
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user SET username = ? WHERE id = ?'),
        ['New Username', 'test@example.com']
      );
      expect(result.affectedRows).toBe(1);
    });
    
    test('devrait échouer si l\'utilisateur n\'existe pas', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
      
      const result = await modifyUsername('nonexistent@example.com', 'New Username');
      
      expect(result.affectedRows).toBe(0);
    });
  });

  
  describe('modifyPassword', () => {
    test('devrait modifier le mot de passe avec des identifiants valides', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      
      const result = await modifyPassword('test@example.com', 'oldPassword', 'newPassword');
      
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user SET password = ? WHERE id = ? AND password = ?'),
        ['newPassword', 'test@example.com', 'oldPassword']
      );
      expect(result.affectedRows).toBe(1);
    });
    
    test('devrait échouer si l\'ancien mot de passe est incorrect', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
      
      const result = await modifyPassword('test@example.com', 'wrongPassword', 'newPassword');
      
      expect(result.affectedRows).toBe(0);
    });
  }); 
}); 