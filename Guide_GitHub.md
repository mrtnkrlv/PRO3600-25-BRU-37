# **Guide Github**

## <u>Introduction au projet :</u>

1) Retrouve ta clé SSH créée pendant le TP (dans ton dossier .ssh>id_rsa.pub  (fichier caché donc) visible avec *ls -a*.
2) Mets cette clé sur Github : photo de profil>setting>SSH and GPG keys>new SSh keys et tu mets ta clef SSH qui est dans le fichier id_rsa.pub 
3) On se connecte à GitHub maintenant. Sur ton terminal : 

*ssh -T git@github.com*

4) Dans le dossier de ton choix tu fais :

*git clone <span style="color: red;">ssh_code</span>*

<span style="color: red;">ssh_code</span> tu le trouves dans le projet, quand tu clique sur le bouton vert code>ssh
5) Le projet est collé en local 

## <u>Guide de gestion du projet : </u>

### Avant de modifier :

1) Commencer par pull au cas où la version serveur ait changée :

*git pull origin main*

Attention, si tu écris simplement *git pull*, il fera le pull seulement sur la branche où tu te trouves (ce qui n'est pas forcément le main). 
Cela mène à des conflits lors du commit car le main est différents dans le dépôt local et celui du serveur.  

2) Maintenant, on crée une nouvelle branche : 

*git checkout -b <span style="color: red;">nom_nouvelle_branche</span>*

En plus d'ajouter la nouvelle branche, ça te met dessus direct.

Sinon, si tu veux juste te déplacer sur une branche déjà existante :

*git checkout <span style="color: red;">nom_branche</span>*

Si tu veux savoir sur quelle branche tu es (ça t'affiche aussi l'ensemble des autres branches): 

*git branch* 

### Stage :

3) Après avoir fait des modifications, tu fais : 

*git add <span style="color: red;">nom_du_fichier</span>*

add permet d'ajouter les fichiers au 'stage' : c'est une zone tampon avant de commit. En gros, ça permet d'éviter de commit tout le projet et donc un commit accidentel. C'est aussi plus clair sur le projet. Cela permet aussi de commit qu'une partie des modifications que tu as faites si il y a un fichier qui est bon mais l'autre beugué ou pas encore terminé par exemple. 


### Commit/Push : 

4) Tu peux voir ce qui va être commit avec :

*git status*

5) Tu fais ton meilleur :

*git commit -m "description du changement"*

6) Puis :

*git push origin nom_de_la_branche*

PS : on enchaîne toujours commit et push. 

### Le moment marrant : le pull review (PR) ou plus clairement le merge review

7) Après avoir fait push, tu dois avoir reçu une adresse sur ton terminal : tu vas sur ce lien.
Tu choisis le nom du PR, tu peux ajouter un commentaire pour plus de clarté, et tu l'envoies. 

PS : tu peux aussi faire le PR directement sur le GitHub

Le PR permet de demander à au moins deux autres membres du projet (la majorité) de valider ton travail avant d'initier le merge avec le main.
    
PPS : Tu peux demander activement à certains membres du groupe de faire la vérification : https://profy.dev/project/github-minesweeper/request-a-review

8) Après vérification, tu es autorisé à merge. 
Tu as juste à cliquer dans GitHub sur "Squash and merge"

9) GitHub te demande de supprimer la branche : autorise-le. 
Cela ne fera pas perdre l'historique des commits, c'est juste la convention pour plus de visibilité.

Pour voir l'historique des branches visuellement agréable, utilisez la commande *gitg* (vraiment un banger)

10) Et voilà ! La boucle est bouclée !









