### STAGE 1: Définir le répertoire de travail ###
FROM node:alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm install
COPY . .

RUN npm run build

### STAGE 2: ###
FROM nginx:alpine
COPY --from=build /app/dist/OrleanStay /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
# Démarrer le serveur Nginx
CMD ["nginx", "-g", "daemon off;"]