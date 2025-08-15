#!/bin/bash

echo "🔍 Diagnosticando tela branca..."

# Verificar estrutura básica
echo "📁 Verificando estrutura de arquivos:"
echo "index.html na raiz: $([ -f index.html ] && echo "✅" || echo "❌")"
echo "src/index.js: $([ -f src/index.js ] && echo "✅" || echo "❌")"
echo "src/App.js: $([ -f src/App.js ] && echo "✅" || echo "❌")"
echo "package.json: $([ -f package.json ] && echo "✅" || echo "❌")"

# Verificar dependências críticas
echo -e "\n📦 Verificando dependências:"
echo "React: $(npm list react --depth=0 2>/dev/null | grep react || echo "❌ Não encontrado")"
echo "Vite: $(npm list vite --depth=0 2>/dev/null | grep vite || echo "❌ Não encontrado")"

# Verificar problemas de import
echo -e "\n🔍 Procurando imports problemáticos:"
PROCESS_ENV=$(grep -r "process\.env" src/ 2>/dev/null | wc -l)
REQUIRE_CALLS=$(grep -r "require(" src/ 2>/dev/null | wc -l)

echo "process.env encontrados: $PROCESS_ENV $([ $PROCESS_ENV -gt 0 ] && echo "⚠️ PRECISA CORRIGIR" || echo "✅")"
echo "require() encontrados: $REQUIRE_CALLS $([ $REQUIRE_CALLS -gt 0 ] && echo "⚠️ PRECISA CORRIGIR" || echo "✅")"

# Verificar variáveis de ambiente
echo -e "\n🌍 Verificando variáveis de ambiente:"
echo ".env existe: $([ -f .env ] && echo "✅" || echo "❌ CRIAR")"

echo -e "\n🚀 Para continuar diagnóstico, execute:"
echo "npm run dev"
echo "E abra o console do navegador (F12)"