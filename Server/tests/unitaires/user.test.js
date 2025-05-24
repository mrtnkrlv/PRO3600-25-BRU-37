import { existsUser, getUser, createUser, deleteUser, modifyUsername, modifyPassword, getUsernameByComment } from '../../user.js';

import pool from '../../database.js';
import { createComment } from '../../comments.js'; // Nécessaire pour tester getUsernameByComment

const test_user_id = 'test_user@example.com';
const test_user_pwd = 'test123';
const test_username = 'TestUser';

beforeEach(async () => {
  // Créer un utilisateur de test
  await pool.query("INSERT IGNORE INTO user (id, pwd, username, accCreated) VALUES (?, ?, ?, ?)", [test_user_id, test_user_pwd, test_username, true]);
});

afterEach(async () => {
  // Nettoyage après chaque test
  await pool.query("DELETE FROM user WHERE id = ?", [test_user_id]);
});

afterAll(async () => {
  await pool.end();
});

//Tests de createUser
describe("Tests de createUser", () => {
  test("Crée un nouvel utilisateur et retourne les données correctes", async () => {
    const id = 'new_user@example.com';
    const pwd = 'newpwd';
    const username = 'NewUser';

    const user = await createUser(id, pwd, username);
    expect(user).toEqual({ id, pwd, username });

    // Nettoyage 
    await pool.query("DELETE FROM user WHERE id = ?", [id]);
  });
});

//Tests de existsUser
describe("Tests de existsUser", () => {
  test("Retourne true pour un utilisateur existant avec le bon mot de passe", async () => {
    const exists = await existsUser(test_user_id, test_user_pwd);
    expect(exists).toBe(true);
  });

  test("Retourne false pour un mauvais mot de passe", async () => {
    const exists = await existsUser(test_user_id, 'wrong_pwd');
    expect(exists).toBe(false);
  });

  test("Retourne false pour un utilisateur inexistant", async () => {
    const exists = await existsUser('fake_user@example.com', 'fake_pwd');
    expect(exists).toBe(false);
  });
});

//Tests de getUser
describe("Tests de getUser", () => {
  test("Retourne les données correctes pour un utilisateur existant", async () => {
    const user = await getUser(test_user_id);
    expect(user).toEqual({id: test_user_id, pwd: test_user_pwd, username: test_username});
  });
});

//Tests de deleteUser
describe("Tests de deleteUser", () => {
  test("Supprime un utilisateur existant", async () => {
    const id = 'to_delete@example.com';
    await createUser(id, 'pwd2', 'UserToDelete');

    //On supprime l'utilisateur et vérifie qu'il n'existe plus
    await deleteUser(id);
    const exists = await existsUser(id, 'pwd2');
    expect(exists).toBe(false);

    //Nettoyage si le test a échoué
    await pool.query("DELETE FROM user WHERE id = ?", [id]);
  });
});

//Tests de modifyUsername
describe("Tests de modifyUsername", () => {
  test("Modifie le nom d’utilisateur d’un utilisateur existant", async () => {
    const newUsername = 'UpdatedUser';
    const result = await modifyUsername(test_user_id, newUsername);

    //On vérifie que le nom d'utilisateur à bien été modifié
    const updated = await getUser(test_user_id);
    expect(updated.username).toBe(newUsername);
  });
});

//Tests de modifyPassword
describe("Tests de modifyPassword", () => {
  test("Modifie le mot de passe si l’ancien est correct", async () => {
    const newpwd = 'newTestPwd';
    const result = await modifyPassword(test_user_id, test_user_pwd, newpwd);

    //On vérifie que le mot de passe a bien été modifié
    const valid = await existsUser(test_user_id, newpwd);
    expect(valid).toBe(true);
  });
});

//Tests de getUsernameByComment
describe("Tests de getUsernameByComment", () => {
  test("Retourne le bon nom d’utilisateur à partir de l’ID du commentaire", async () => {

    //Ajouter un plat de test
    await pool.query("INSERT IGNORE INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)", [105, 'meal_test', 0, ]);

    //Créer un commentaire avec un utilisateur de test
    const comment = await createComment(105, test_user_id, 'Test comment');
    const result = await getUsernameByComment(comment.commentId);

    expect(result[0].username).toBe(test_username);

    //Nettoyage du commentaire et du plat
    await pool.query("DELETE FROM comments WHERE commentId = ?", [comment.commentId]);
    await pool.query("DELETE FROM meals WHERE mealId = ?", [105]);
  });
});