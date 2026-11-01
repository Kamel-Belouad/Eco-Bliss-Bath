<div align="center">

# OpenClassrooms - Eco-Bliss-Bath

</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Présentation du projet

Eco Bliss Bath est une start-up de e-commerce de produits de beauté écoresponsables, dont le produit phare est le savon solide.

Dans le cadre de ce projet, l'objectif est de mettre en place des tests automatisés avec Cypress afin de vérifier le bon fonctionnement de l'application, des API et des principales fonctionnalités.

Les tests couvrent :

- Tests API
- Tests fonctionnels (Connexion & Panier)
- Smoke tests
- Test de sécurité XSS

# Prérequis

Pour démarrer cet applicatif web vous devez avoir les outils suivants:

- Docker
- NodeJs

Pour les tests automatisés:

- Cypress

# Installation et démarrage

## 1. Clonez le projet

Récupérer le projet depuis GitHub :

```
git clone https://github.com/Kamel-Belouad/Eco-Bliss-Bath.git
cd Eco-Bliss-Bath
```

## 2. Démarrer le backend et la base de données

Depuis la racine du projet, exécuter :

```
docker compose up
```

L'API est disponible à l'adresse suivante : `http://localhost:8081`

La documentation Swagger est disponible ici : `http://localhost:8081/api/doc`

## 3. Installer et démarrer le frontend

Se rendre dans le dossier frontend:

```
cd ./frontend
```

Installez les dépendances du projet:

```
npm install
```

Lancez l'interface

```
npm start
```

Le frontend est accessible à l'adresse suivante :`http://localhost:4200`

# Données de connexion

Pour accéder à l'application, utiliser le compte de test suivant :

- Email : `test2@test.fr`
- Mot de passe : `testtest`

# Lancer les tests automatisés avec Cypress

L'API et le frontend doivent être démarrés avant de lancer les tests.
Toutes les commandes se lancent depuis le dossier `frontend`.

## Installer Cypress

```
cd ./frontend
npm install cypress --save-dev
```

## Mode interactif

```
npx cypress open
```

- Cliquer sur « E2E Testing »
- Choisir un navigateur
- Sélectionner le script à tester

## Mode headless (dans le terminal)

Exécuter tous les tests :

```
npx cypress run
```

# Générer le rapport de tests

Le rapport est généré au format HTML avec **cypress-mochawesome-reporter**.

## 1. Installer le reporter

```
cd ./frontend
npm install --save-dev cypress-mochawesome-reporter
```

## 2. Lancer les tests

```
npx cypress run
```

## 3. Ouvrir le rapport

Ouvrir ce fichier dans un navigateur :

```
cypress/reports/index.html
```

Il contient le nombre de tests réussis et en échec, la durée de chaque test et les captures d'écran des échecs.

# Auteur

Projet réalisé par Kamel BELOUAD, dans le cadre du projet d'automatisation de tests avec Cypress (OpenClassrooms).

Version : v1.0.0 – tests automatisés avec Cypress.
