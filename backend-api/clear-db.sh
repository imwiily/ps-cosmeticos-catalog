#!/bin/bash

echo "💣 Apagando todas as tabelas do banco PostgreSQL..."

docker exec -i db-postgres psql -U psuser -d allaya_company_ps_cosmeticos_api <<EOF
DO \$\$
DECLARE
    r RECORD;
BEGIN
    -- Desabilita constraints temporariamente
    EXECUTE 'SET session_replication_role = replica';

    -- Deleta todas as tabelas
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Reativa constraints
    EXECUTE 'SET session_replication_role = DEFAULT';
END
\$\$;
EOF
