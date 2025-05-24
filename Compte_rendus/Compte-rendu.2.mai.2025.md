# Compte-rendu 2 mai 2025
## Ordre du jour : 

1. Explication de l'implémentation du système d'authentification 
2. Présentation des tests
3. Présentation optimisation 

## 1. Explication de l'implémentation du système d'authentification 

## 2. Présentation des tests

- On aurait pu (dû) insérer les données de test directement dans la base de données
- Ce qu'il faut tester, c'est l'algorithmie. Je récupère une donnée, je la modifie et on test cette donnée. 
    - Bien tester tous les recoins 

- Faire des mises en charge du site : comparer avec et sans système de cache  

## 3. Présentation optimisation 

- Console.error à éviter car synchrone

- Mise en cache : proxi inverse ou importer une appli gx
    - Quel méthode vont en bénéficier => directement on peut mettre en place les tests unitaires (avant même d'avoir codé)

## 4. Concurrence 

- Lorsqu'on a des objets en cache, il faut faire de la cohérence de données entre ce qu'il y a en cache et en base de données. Vérifier qu'il n'y a pas de problèmes critiques. 

## Et maintenant ? 

<u>Prochaines étapes :</u> 
- Mise en cache 
- Plus besoin de travailler le visuel 
- Tests 
- Faire une mise en charge (avec Minet) => fin du projet, **Loris** 

<u>Prochaine réunion :</u>

Mardi 13 mai à 12h00

<u>To do :</u>
- Loris : Contact Minet 
- Paul : Documentation
- Lucas : Tests
- ??? : Mise en cache






