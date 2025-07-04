# Propelize - Frontend (HTML + Playwright)

Ce projet fournit une interface web statique pour Propelize, avec tests automatisés Playwright et pipeline CI/CD GitHub Actions.

## Structure du projet

```
frontend/
  src/
    login.html         # Page de connexion
    vehicles.html      # Tableau de bord des véhicules
    users.html         # Gestion des utilisateurs
  tests/
    login.spec.js      # Tests Playwright pour login
    vehicles.spec.js   # Tests Playwright pour véhicules
    users.spec.js      # Tests Playwright pour utilisateurs
  package.json         # Dépendances (Playwright)
  README.md            # Documentation
.github/workflows/ci.yml # Pipeline CI/CD
```

## Lancer les tests Playwright en local

Dans le dossier `frontend` :

```sh
npm install         # Installer les dépendances si pas déjà fait
npx playwright install --with-deps
npx playwright test tests/*.spec.js
```

## Identifiants de test
- **Email** : `admin@propelize.com`
- **Mot de passe** : `admin123`

## Pipeline CI/CD (GitHub Actions)
- Déclencheur : push/pull request sur `main`
- Étapes :
  - Installation Node/Playwright
  - Exécution des tests Playwright
- Voir `.github/workflows/ci.yml`

## Prise en main des interfaces
- Ouvrir les fichiers HTML dans un navigateur (`src/login.html`, etc)
- Bootstrap 5 utilisé pour le design

## Aller plus loin
- Ajouter des tests d’accessibilité ou responsive
- Ajouter un linter HTML/CSS (ex : htmlhint, stylelint)
- Déploiement automatique (Netlify, Vercel…)

---

**Propelize - Projet L3 ICT304**

