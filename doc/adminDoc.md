# Documentation administateur

Cette documenation est valable à partir de la release v0.3.0
Voici la procédure à suivre pour installer notre application sur votre machine.


# Sous Windows
## L'application
Nous avons mis en place docker pour ce projet, pour lancer l'application faire la commande :
> docker-compose up -d --build

Une fois cette commande effectuée, nous pouvons voir notre application en marche sur :
		**adresse IP de votre docker**:8080

## Les tests
Pour lancer les tests, il faut faire la commande :
> node ***nom_du_fichier***

Le nom du fichier correspond au fichier de test souhaité de /test/testE2E.
# Sous Linux
## L'application
Nous avons mis en place docker pour ce projet, pour lancer l'application faire la commande :
> docker-compose up -d --build

Une fois cette commande effectuée, nous pouvons voir notre application en marche sur :
		**localhost**:8080
## Les tests
Pour lancer les tests, il faut faire la commande :
> node ***nom_du_fichier***

Le nom du fichier correspond au fichier de test souhaité de /test/testE2E.

## Solution si docker ne marche pas.

Dans le cas ou l'application ne marcherait pas avec docker, voici une solution pour exécuter tout de même notre application.
Il y a une modification a effectuer dans le fichier /src/app.js : commenter la ligne 11 et décommenter la ligne 12.
Une fois cela fait, se placer dans le dossier racine du projet et exécuter ces commandes :
> npm install
> node src/app.js

L'application sera ensuite disponible à **localhost:8080**
