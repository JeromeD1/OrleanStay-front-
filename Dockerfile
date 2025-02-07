# Étape 1 : Construction de l'application Angular
FROM node:18 AS build

WORKDIR /app

# Copier les fichiers de package et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# Construire l'application Angular en mode production
# Si vous utilisez Angular Universal, assurez-vous de construire uniquement la partie navigateur
RUN npm run build -- --configuration production

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

# Supprimer la configuration par défaut de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copier votre configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers construits de l'application depuis l'étape précédente
COPY --from=build /app/dist/OrleanStay/browser /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
