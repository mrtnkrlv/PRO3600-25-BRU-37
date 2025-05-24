# Compte-rendu du 11 avril 2025 

## Présence :
 Emptoz, Kirilov-Lilov, Charbonnier, Brunnet, Serieys

 ## Ordre du jour : 

- Le cache 
- Les tests
- Le rapport 

## Le cache 

- Importé le mdule de node Nodecache 
    - Méthode GET et SET pour créer et récupérer des clefs des éléments qu'on met dans le cache (hashmap)
    - Explication du fonctionnement du code
    - Pourquoi NodeCache ? Cache mémoire : le cache est séparé pour chaque instance (même instance pour tout le monde)
- Peut on gérer sa taille ? => temps d'expiration
    - On préfèrerai une taille et dès que c'est plein, on retire le premier élément
    - Scalabilité : compromis entre get sur la BD et le cache à beaucoup d'entrées
- Un cache par objet avec une clef qui est définie par nous même : est ce que comme java on utilise le système avec equals ? Point de vue cohérence des données et scalabilité. 

##  Tests 

- Relier les tests avec la base de données 
- Différence entre test unitaire et test d'intégration : séparer les deux tyoes de tests
- Tests de calidation = tests d'intégration 
- Mettre en place une automisation de la chaîne de tests qui tourne toutes les nuits => intégration continue

## Documentation/Rapport

- Mettre des références
- Faire un Gantt
- Diagramme de classe mais javascipt 

## Prochaine fois 

Réunion projet dev 13h30-14h  

 Soutenance le 3 juin : on peut rendre le travail plus tard **le 24 mai**





