#!/bin/bash
set -e

REPO_DIR="/root/AngelOrigamis"
CLIENT_DIR="$REPO_DIR/client"
SERVER_DIR="$REPO_DIR/server"
NGINX_ROOT="/var/www/angelorigamis"
PM2_NAME="angel-backend"
BACKUP_DIR="/root/db_backups"
BACKUPS_TO_KEEP=15

echo "== Backup do banco de dados antes do deploy =="
mkdir -p "$BACKUP_DIR"
ENV_FILE="$SERVER_DIR/.env"

if [ -f "$ENV_FILE" ]; then
  DB_NAME=$(grep -E '^DB_NAME=' "$ENV_FILE" | cut -d '=' -f2-)
  DB_USER=$(grep -E '^DB_USER=' "$ENV_FILE" | cut -d '=' -f2-)
  DB_PASS=$(grep -E '^DB_PASS=' "$ENV_FILE" | cut -d '=' -f2-)
  DB_HOST=$(grep -E '^DB_HOST=' "$ENV_FILE" | cut -d '=' -f2-)
  DB_HOST=${DB_HOST:-localhost}

  if [ -n "$DB_NAME" ] && [ -n "$DB_USER" ]; then
    BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$(date +%Y%m%d_%H%M%S).dump"
    if PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -F c -f "$BACKUP_FILE"; then
      echo "Backup salvo em $BACKUP_FILE"
      # Mantém só os backups mais recentes, apaga o resto.
      ls -1t "$BACKUP_DIR/${DB_NAME}"_*.dump 2>/dev/null | tail -n +$((BACKUPS_TO_KEEP + 1)) | xargs -r rm --
    else
      echo "AVISO: backup do banco falhou! Seguindo com o deploy mesmo assim, mas sem rede de segurança dessa vez."
    fi
  else
    echo "AVISO: não encontrei DB_NAME/DB_USER em $ENV_FILE, pulando backup."
  fi
else
  echo "AVISO: $ENV_FILE não encontrado, pulando backup."
fi

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
# --delete apaga da pasta do Nginx tudo que não existir no build novo - mas
# imagens de produto e de conteúdo do site são enviadas em runtime pelo
# backend, nunca fazem parte do build. Sem excluir essas pastas, todo deploy
# apagaria esses uploads. As pastas excluídas são lidas do .env pra não
# depender de nome fixo.
RSYNC_EXCLUDES=(--exclude 'assets/site-content')

PRODUCTS_DIR_ENV=$(grep -E '^PRODUCTS_UPLOAD_DIR=' "$ENV_FILE" 2>/dev/null | cut -d '=' -f2-)
if [ -n "$PRODUCTS_DIR_ENV" ] && [[ "$PRODUCTS_DIR_ENV" == "$NGINX_ROOT"/* ]]; then
  REL_PRODUCTS_DIR="${PRODUCTS_DIR_ENV#$NGINX_ROOT/}"
  RSYNC_EXCLUDES+=(--exclude "$REL_PRODUCTS_DIR")
fi

SITE_CONTENT_DIR_ENV=$(grep -E '^SITE_CONTENT_UPLOAD_DIR=' "$ENV_FILE" 2>/dev/null | cut -d '=' -f2-)
if [ -n "$SITE_CONTENT_DIR_ENV" ] && [[ "$SITE_CONTENT_DIR_ENV" == "$NGINX_ROOT"/* ]]; then
  REL_SITE_CONTENT_DIR="${SITE_CONTENT_DIR_ENV#$NGINX_ROOT/}"
  RSYNC_EXCLUDES+=(--exclude "$REL_SITE_CONTENT_DIR")
fi

sudo rsync -a --delete "${RSYNC_EXCLUDES[@]}" "$CLIENT_DIR/build/" "$NGINX_ROOT/"
sudo chown -R www-data:www-data "$NGINX_ROOT"

echo "== Reiniciando backend =="
NODE_ENV=production pm2 restart "$PM2_NAME" --update-env

echo "== Deploy concluído =="
pm2 list
