# CDP_G2_Equipe2_Dev

## Docker

On peut maintenant lancer notre application avec Docker :

Se placer à la racine du projet, là où est présent le Dockerfile et rentrer ces commandes :

```
docker build -t web-app
```
Une fois la commande finie, faire :
```
docker run -p 8080:8080 web-app
```

Et l'application est maintenant disponible à l'adresse du docker, au port 8080.
