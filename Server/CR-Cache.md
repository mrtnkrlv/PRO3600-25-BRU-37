## Explications Cache 
Yo l'équipe, on se retrouve pour un nouveau tuto..
Je pense qu'à terme on supprimera ce fichier, il existe juste le temps d'expliquer à tout le monde le système de cache actuel.

## Mise en place
Il faut importer le module suivant : **npm install node-cache --save**
    *node-cache est un module interne à node* 

Le code qui constitue le cache se trouve dans : **Route-Cache.js** 

## Explications du code 
* Initialisation du code, on crée une instance de cache

### Fonction 
* On veut stocker notre clé durant un temps donné par **(duration)**

* On vérifie si on a une requête de type **GET** 

* On stocke une **clé** qui correspond à l'**URL demandé** 
*original.Url donne le chemin entier et la chaîne de requête* 

* On vérifie si la clé **appartient au cache**

=> Si **OUI :** 
    On renvoie la réponse stocké dans la variable *CachedResponse*
    Ca permet de ne pas avoir à faire de requête sur la DB

=> Si **NON :** 
    On ajoute la clé au cache et on renvoie la prochaine fonction **next()**

Pour l'instant j'ai seulement implémenté la fonction pour le chargement de la homepage, à voir là où c'est le plus utile.


## Critiques
Le système de cache peut largement être amélioré, ici c'est une V1.
* A la place de stocker pendant un temps donné, j'aimerai qu'on vérifie si le content en cache a été update ou non.
* Avoir des images en cache, pour RouteCache les images sont en caches seulement si on passe par res.send. J'aimerai voir si on peut pas utiliser le cache du navigateur internet directement ? 
