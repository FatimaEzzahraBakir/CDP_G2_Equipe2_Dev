# Documentation utilisateur

Cette documenation est valable à partir de la release v0.3.0
Voici le détails des actions réalisables grâce à notre application de gestion de projet. Pour effectuer une action, il faudra au préalable être connecté avec un compte.

## Inscription et connexion
Sur la page d'accueil, si vous n'êtes pas connecté vous avez deux boutons, un pour l'inscription et un pour la connexion. Si vous êtes connecté, vous aurez deux nouveaux boutons, un pour voir la liste des projet et un de déconnexion. La déconnexion est également faisable grâce au bouton "déconnexion" dans la navbar, en haut à droite.
Pour vous inscrire, il faudra fournir votre nom, prénom, login, adresse e-mail et mot de passe.
Pour vous connecté, il faudra renseigner votre login et mot de passe.

## Gérer les projets

Sur la page des projets ***localhost:8080/user/'votre_login'/projects***, vous pouvez voir vos projets déjà existants, ou en créer un nouveau avec le bouton "+ Nouveau Projet". Une nouvelle page s'affiche vous permettant de remplir les différents champs d'information de votre projet. Une fois ces champs remplis, appuyez sur le bouton "Créer" pour l'ajouter à votre liste de projet. Vous le verrez apparaître sur la page de tous vos projets.
Les différentes actions possibles avec un de vos projets est de le supprimer, le modifier ou y accéder. Cette dernière action vous renvoie sur la page spécifique au projet, où il y a toutes les informations de ce projet.

### Issues
***localhost:8080/user/'votre_login'/projects/'id_projet'/backlog***
Sur cette page, vous pourrez gérer les issues d'un projet. Vous pouvez en créer une, avec les informations nécessaires, en cliquant sur "+Nouvelle issue". Un crayon apparait sur la ligne d'une issue pour l'éditer, et une poubelle pour la supprimer.

### Sprints
***localhost:8080/user/'votre_login'/projects/'id_projet'/sprints***
Sur cette page, vous pourrez gérer les sprints d'un projet. Vous pouvez en créer un, avec les informations nécessaires, en cliquant sur "+Nouveau sprint". Vous pouvez y accéder, le modifier ou le supprimer avec les action en dessus d'un sprint spécifique. En accédant au sprint, vous pourrez voir la liste des issues rattachées, ainsi que les tâches à faire.
Sur une tâche vous pouvez assigner un développeur sur celle-ci.
Si le sprint est le sprint actuel, et que vous avez des tâches à l'état "TODO" ou "DOING", vous les verrez apparaître sur la page principale du projet.

### Tests
***localhost:8080/user/'votre_login'/projects/'id_projet'/tests***
Sur cette page, vous pourrez gérer les tests d'un projet. Vous pouvez en créer un, avec les informations nécessaires, en cliquant sur "+Nouveau test". Un crayon apparait sur la ligne d'un test pour l'éditer, et une poubelle pour le supprimer. Une colonne "Etat" affiche un symbole en vert si le test s'est bien déroulé, en orange si le test n'as pas encore de résultat et en rouge si le résultat obtenu n'est pas le résultat attendu.

### Releases
***localhost:8080/user/'votre_login'/projects/'id_projet'/releases***
Sur cette page, vous pourrez gérer les releases d'un projet. Vous pouvez en créer une, avec les informations nécessaires, en cliquant sur "+Nouvelle release". Vous pouvez la supprimer grâce au bouton "Supprimer" sous une release spécifique.

### Documentations
***localhost:8080/user/'votre_login'/projects/'id_projet'/newDoc***
Sur cette page vous pourrez y déposer vos fichiers de documentation, au format .txt. Une fois une documentation ajoutée, elle est visible sur la page principale du projet, et vous pourrez la téléchargée depuis cette page.
