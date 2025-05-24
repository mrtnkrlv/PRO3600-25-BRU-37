import pool from '../../database.js';
import { addLikeToComment, removeLikeFromComment } from '../../commentLikes.js';
import { createComment } from '../../comments.js';

let commentId; //Variable globale pour stocker l'Id du commentaire créé

beforeEach(async () => {
  //Création d'un utilisateur, d'un plat et d'un commentaire
  await pool.query("INSERT IGNORE INTO user (id, pwd, username) VALUES (?, ?, ?)", ['like_user', 'pwd', 'UserLike']);
  await pool.query("INSERT IGNORE INTO meals (mealId, mealName, positionInWeek) VALUES (?, ?, ?)", [300, 'test_meal', 3]);

  const comment = await createComment(300, 'like_user', 'Un commentaire à liker', null);
  commentId = comment.commentId; //Récupération de l'ID du commentaire créé
});

afterEach(async () => {
  //Supprimer tous les likes des commentaires liés au plat
  await pool.query("DELETE FROM commentLikes WHERE commentId IN (SELECT commentId FROM comments WHERE mealId = ?)", [300]);

  //Supprimer tous les commentaires liés au plat
  await pool.query("DELETE FROM comments WHERE mealId = ?", [300]);

  //Supprimer le plat
  await pool.query("DELETE FROM meals WHERE mealId = ?", [300]);

  //Supprimer l'utilisateur
  await pool.query("DELETE FROM user WHERE id = ?", ['like_user']);
});

afterAll(async () => {
  await pool.end();
});

describe("Tests d'intégration : likes sur les commentaires", () => {

  test("Un utilisateur peut liker un commentaire, et le compteur augmente", async () => {
    await addLikeToComment(commentId, 'like_user', 300);

    //Vérifier que le nombre de likes dans la table comments a augmenté à 1
    const [rows] = await pool.query("SELECT likes FROM comments WHERE commentId = ?", [commentId]);
    expect(rows[0].likes).toBe(1);
  });

  test("Un utilisateur ne peut pas liker deux fois le même commentaire", async () => {
    //Ajouter un like une première fois
    await addLikeToComment(commentId, 'like_user', 300);

    //Essayer d'ajouter un like une deuxième fois
    await expect(addLikeToComment(commentId, 'like_user', 300)).rejects.toThrow('Like déjà existant');
  });

  test("Un utilisateur peut unliker un commentaire, et le compteur diminue", async () => {
    await addLikeToComment(commentId, 'like_user', 300);

    //Retirer le like et vérifier que la suppression a réussi
    const res = await removeLikeFromComment(commentId, 'like_user');
    expect(res).toEqual({ success: true });

    //Vérifier que le compteur a bien été décrémenté
    const [rows] = await pool.query("SELECT likes FROM comments WHERE commentId = ?", [commentId]);
    expect(rows[0].likes).toBe(0);
  });

  test("Unliker un commentaire non liké échoue", async () => {
    await expect(removeLikeFromComment(commentId, 'like_user')).rejects.toThrow('Like introuvable');
  });
});