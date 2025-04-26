
import { addOrUpdateRating, removeRating, getUserRating, getAverageRating } from '../Server/ratings.js';



//Tests pour la méthode addOrUpdateRating
describe('addOrUpdateRating', () => {
    
    test('Doit rejeter une note invalide (hors 1-5)', async () => {
        await expect(addOrUpdateRating(1, 1, 0)).rejects.toThrow("La note doit être un entier entre 1 et 5.");
        await expect(addOrUpdateRating(1, 1, 6)).rejects.toThrow("La note doit être un entier entre 1 et 5.");
    });
    
    test('Doit échouer si l’utilisateur n’existe pas', async () => {
        await expect(addOrUpdateRating(1, -1, 3)).rejects.toThrow("Utilisateur introuvable."); // Index -1 n'xiste pas 
    });

    test('Doit échouer si le plat n’existe pas', async () => {
        await expect(addOrUpdateRating(-1, 1, 3)).rejects.toThrow("Plat introuvable.");
    });

    test('Doit ajouter une note si tout est valide', async () => {
        await addOrUpdateRating(1, 1, 4);
        const note = await getUserRating(1, 1);
        expect(note).toBe(4);

        await removeRating(1, 1);
    });

    test('Doit mettre à jour une note existante si tout est valide', async () => {
        await addOrUpdateRating(1, 1, 3);
        const res = await addOrUpdateRating(1, 1, 5);
        const note = await getUserRating(1, 1);
        expect(note).toBe(5);

        await removeRating(1, 1);
    });
});



//Tests pour la méthode removeRating
describe('removeRating', () => {

    test('Doit échouer si le plat nexiste pas', async () => {
        await expect(removeRating(-1, 1)).rejects.toThrow("Plat introuvable.");
    });

    test('Doit échouer si la note nexiste pas', async () => {
        await expect(removeRating(1, -1)).rejects.toThrow("Note inexistante pour ce plat et cet utilisateur.");
    });

    test('Doit supprimer une note existante', async () => {
        await addOrUpdateRating(1, 1, 4);
        await removeRating(1, 1);
        const note = await getUserRating(1, 1);
        expect(note).toBeNull();
    });

    test('Doit mettre à jour la moyenne après suppression', async () => {
        await addOrUpdateRating(1, 1, 3);
        await addOrUpdateRating(1, 2, 5);
        const initialeM = await getAverageRating(1);
        
        await removeRating(1, 1);
        const newM = await getAverageRating(1);
        
        expect(newM).not.toBe(initialeM);
        expect(newM).toBe(5); 

        await removeRating(1, 2);
    });
});


describe('getUserRating', () => {

    test('Doit retourner la note de lutilisateur', async () => {
        await addOrUpdateRating(1, 1, 4);
        const note = await getUserRating(1, 1);
        expect(note).toBe(4);
        await removeRating(1, 1);
    });

    test('Devrait retourner null si la note nexiste pas', async () => {
        const note = await getUserRating(1, -1);
        expect(note).toBeNull();
    });

});


describe('getAverageRating', () => {

    test('Doit calculer correctement la moyenne', async () => {
        await addOrUpdateRating(1, 1, 3);
        await addOrUpdateRating(1, 2, 5);

        const moy = await getAverageRating(1);
        expect(moy).toBe(4); // (3 + 5) / 2 = 4

        await removeRating(1, 1);
        await removeRating(1, 2);
    });
})