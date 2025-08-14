#!/bin/bash

echo "📦 Compilando aplicação..."
./mvnw clean package -DskipTests || { echo "❌ Erro ao compilar"; exit 1; }

echo "🧹 Limpando containers e volumes..."
docker-compose down -v

echo "🚀 Subindo banco e aplicação..."
docker-compose up --build
