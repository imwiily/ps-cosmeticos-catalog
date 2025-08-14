#!/bin/bash

echo "📦 Compilando aplicação..."
./mvnw clean package -DskipTests || { echo "❌ Erro ao compilar"; exit 1; }

echo "🧼 Removendo apenas o container da aplicação..."
docker rm -f psapi-app 2>/dev/null || echo "ℹ️ Container antigo não encontrado"

echo "🚀 Subindo apenas a aplicação..."
docker-compose up --build app
