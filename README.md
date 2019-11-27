# CDP_G2_Equipe2_Dev

[![Build Status](https://travis-ci.org/FatimaEzzahraBakir/CDP_G2_Equipe2_Dev.svg?branch=master)](https://travis-ci.org/FatimaEzzahraBakir/CDP_G2_Equipe2_Dev)


## Docker

On peut maintenant lancer notre application avec Docker :

Se placer à la racine du projet, là où est présent le Dockerfile et rentrer ces commandes pour lancer le projet:

```
docker-compose up -d
```

Et l'application est maintenant disponible à l'adresse du docker, au port 8080.

Après avoir effectué une modification, pour relancer docker il faut faire :
```
docker-compose up -d --build
```
