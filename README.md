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
- **Système de Cache** : NodeCache

## Installation 

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

## Utilisation


### **1. Accès à l’application**

- L’application fonctionne sur un serveur web, généralement accessible à l’adresse `http://localhost:8080` si vous l’exécutez localement.
- Les fichiers statiques (images, CSS, JS) sont servis depuis le dossier `public`.

---

### **2. Navigation Principale**

| Page                | URL                 | Description                                                | Authentification requise |
|---------------------|---------------------|------------------------------------------------------------|--------------------------|
| Accueil             | `/homepage`         | Page d’accueil générale du site                            | Non                      |
| Liste des plats     | `/plats`            | Affiche tous les plats et les commentaires associés        | Non                      |
| Compte utilisateur  | `/account`          | Affiche les infos du compte et permet de les modifier      | Oui                      |
| Connexion           | `/login`            | Formulaire de connexion                                   | Non                      |
| Déconnexion         | `/logout`           | Déconnecte l’utilisateur et retourne à l’accueil           | Oui                      |

---

### **3. Connexion et gestion de compte**

#### **Se connecter**
- Rendez-vous sur la page `/login`.
- Saisissez votre email et mot de passe.
- Cliquez sur "Se connecter".
- En cas d’erreur (identifiants incorrects), un message s’affiche[1].

#### **Accéder à son compte**
- Après connexion, accédez à `/account` pour voir vos informations personnelles.
- Cette page nécessite d’être authentifié : si vous n’êtes pas connecté, vous serez redirigé vers `/login`[1].

#### **Se déconnecter**
- Cliquez sur le bouton ou le lien de déconnexion (redirige vers `/logout`).
- Vous serez renvoyé vers la page d’accueil et votre session sera terminée[1].

---

### **4. Découvrir les plats et commenter**

#### **Voir la liste des plats**
- Allez sur `/plats`.
- Vous verrez la liste des plats disponibles, chacun accompagné des commentaires des utilisateurs (avec leur nom d’utilisateur).

#### **Ajouter un commentaire (utilisateur connecté)**
- Sur la page `/plats`, remplissez le formulaire de commentaire sous le plat concerné.
- Le commentaire sera associé à votre compte et au plat sélectionné.
- Cliquez sur "Envoyer" : votre commentaire apparaîtra immédiatement après rechargement de la page[1].

---

### **5. Sécurité et sessions**

- L’application utilise des sessions pour maintenir la connexion utilisateur.
- Les données de session sont stockées côté serveur et un cookie est utilisé côté navigateur.

#### **Gestion des erreurs**
- Si une erreur serveur survient, un message d’erreur générique s’affiche et l’erreur est loggée côté serveur.

#### **Lancement du serveur**
- Pour lancer le serveur en mode développement :
  ```bash
  npx nodemon app.js
  ```
- Le serveur écoute sur le port 8080 par défaut.

---

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

---

Projet réalisé dans le cadre du module PRO3600 à Télécom SudParis.

---

*Documentation générée automatiquement avec [JSDoc](https://jsdoc.app/).*

