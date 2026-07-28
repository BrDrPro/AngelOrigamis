#!/bin/bash
set -e

REPO_DIR="/root/AngelOrigamis"
CLIENT_DIR="$REPO_DIR/client"
SERVER_DIR="$REPO_DIR/server"
NGINX_ROOT="/var/www/angelorigamis"
PM2_NAME="angel-backend"

echo "== Sincronizando código com origin/main =="
cd "$REPO_DIR"
git fetch origin
git reset --hard origin/main

echo "== Instalando dependências do backend =="
cd "$SERVER_DIR"
npm install

echo "== Compilando backend (TypeScript -> JS) =="
npm run build

echo "== Instalando dependências do frontend =="
cd "$CLIENT_DIR"
npm install

echo "== Buildando frontend =="
npm run build

echo "== Publicando build no Nginx =="
sudo rsync -a --delete "$CLIENT_DIR/build/" "$NGINX_ROOT/"
sudo chown -R www-data:www-data "$NGINX_ROOT"

echo "== Reiniciando backend =="
NODE_ENV=production pm2 restart "$PM2_NAME" --update-env

echo "== Deploy concluído =="
pm2 list
