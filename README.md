# TP304

# Propelize Vehicle API

API de gestion des véhicules pour l’entreprise Propelize, développée en Node.js avec Express et MySQL. Ce projet utilise Sequelize comme ORM et inclut des tests unitaires et d'intégration avec Jest et Supertest. Le tout est conteneurisé avec Docker.

## 📦 Stack Technique

- **Backend** : Node.js + Express  
- **Base de données** : MySQL  
- **ORM** : Sequelize  
- **Tests** : Vitest 
- **Conteneurs** : Docker + Docker Compose

## 🚀 Lancer le projet

### 1. Cloner le dépôt

```bash
git clone <repo-url>
cd propelize-vehicle-api
```

### 2. Lancer avec Docker

```bash
docker-compose up --build
```

Le serveur sera accessible sur [http://localhost:3000](http://localhost:3000).

### 3. Lancer les seeders

```bash
docker exec -it <container_api_name> node seeders/seed.js
```

> Remplace `<container_api_name>` par le nom réel du conteneur de l’API.

## 🔬 Lancer les tests

```bash
npm test
```

## 🛠️ Endpoints de l’API

| Méthode | Endpoint         | Description                    |
|---------|------------------|--------------------------------|
| POST    | `/vehicles`      | Créer un véhicule              |
| GET     | `/vehicles`      | Lister tous les véhicules      |
| GET     | `/vehicles/:id`  | Obtenir un véhicule par ID     |
| PUT     | `/vehicles/:id`  | Modifier un véhicule           |
| DELETE  | `/vehicles/:id`  | Supprimer un véhicule          |

## ⚙️ Configuration

Le fichier `.env` contient les paramètres de connexion à la base de données :

```env
DB_NAME=propelize
DB_USER=root
DB_PASS=
DB_HOST=localhost
```

## 📁 Structure du projet

```
.
├── app.js
├── config/
├── controllers/
├── models/
├── routes/
├── tests/
├── seeders/
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```
