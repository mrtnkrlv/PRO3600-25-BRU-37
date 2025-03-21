# Réunion du 21/03/24
## Ordre du jour  
Début du backend
### Début du backend
- Présentation de la base de données
    - Qu'est-ce qu'on en fait ? 
    - Stocker les images : table de hachage ? 
    - Pour chaque donnée, dire quelle utilisation on en a besoin et décider en conséquence comment les stocker
    - Utilisateurs : toujours utiliser une table de hachage
 
- Sur le choix de tables
    - On peut juste ajouter l'attribut note à la table plat, sinon on a besoin d'un carnet de note
    - Pour les commentaires : liste chaînée => documenter 
    - Raisonner en terme d'objet plutôt qu'en base de données : qu'est ce qu'opn veut faire => objet utilisateur => base de données
