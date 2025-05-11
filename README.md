# Facebouf

Facebouf est une application web permettant aux étudiants et au personnel de Télécom SudParis de **noter** et **commenter** les plats du restaurant universitaire.  
Le site propose également un système de likes sur les plats et les commentaires, ainsi qu’une gestion des profils utilisateurs.

## Fonctionnalités principales

- **Consultation des menus** : voir les plats du jour et de la semaine
- **Notation des plats** : attribuer une note à chaque plat
- **Commentaires** : laisser un avis sur un plat, répondre à d’autres commentaires
- **Likes** : liker les plats et les commentaires
- **Gestion du profil** : création de compte, modification du pseudo, mot de passe, photo de profil
- **Modération** : suppression de commentaires inappropriés par les administrateurs

## Technologies utilisées

- **Front-end** : EJS, CSS
- **Back-end** : Node.js avec Express
- **Base de données** : MySQL
- **Documentation technique** : JSDoc

## Installation et utilisation

1. **Cloner le dépôt**

git clone <https://github.com/mrtnkrlv/PRO3600-25-BRU-37.git>  
cd PRO3600-25-BRU-37

2. **Installer les dépendances**
npm install  


3. **Configurer la base de données**
- Créer les tables 

- Renseigner les variables d’environnement dans un fichier `.env` :
  ```
  MYSQL_HOST=localhost
  MYSQL_USER=root
  MYSQL_PASSWORD=motdepasse
  MYSQL_DATABASE=facebouf
  ```

4. **Lancer le serveur**
npm run dev  


5. **Générer la documentation**
npx jsdoc .


## Structure du projet

- `Server/` : code back-end (Express, routes, accès BDD)
- `views/` : templates EJS pour le rendu côté client
- `public/` : ressources statiques (CSS, images)
- `database.js` : configuration du pool MySQL


## Auteurs

- Martin Kirilov-Lilov (chef de projet)
- Loris Serieys (tests)
- Lucas Charbonnier (documentation)
- Paul Emptoz (GitHub, secrétariat)

## Licence

Projet réalisé dans le cadre du module PRO3600 à Télécom SudParis.

---

*Documentation générée automatiquement avec [JSDoc](https://jsdoc.app/).*

