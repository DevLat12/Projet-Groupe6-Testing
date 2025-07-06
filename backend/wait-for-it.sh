FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Copier le script d'attente MySQL
COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

# Définir la commande à exécuter au démarrage du conteneur
CMD ["sh", "/wait-for-mysql.sh"]
