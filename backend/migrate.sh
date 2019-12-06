#!/bin/bash

until psql -h "postgis" -U "postgres" -c '\q'; do
  echo "Postgres is unavailable - sleeping"
  sleep 3
done
echo "postgres is up"

create_cmd="bundle exec rails db:create db:schema:load db:seed"
migrate_cmd="bundle exec rails db:migrate"

ceqr_tables=$(psql -h "postgis" -U "postgres" -lqt | cut -d \| -f 1 | grep ceqr)

if [ -z "$ceqr_tables" ]; then
  echo "and ceqr databases do not exist - executing command: $create_cmd"
  $create_cmd
fi

echo "ceqr dbs exist - migrating ceqr_rails DB : $migrate_cmd"
$migrate_cmd

echo "migrating ceqr_test DB: $migrate_cmd"
DATABASE_URL=$(echo $DATABASE_URL | sed 's/\(.*\)ceqr_rails/\1ceqr_test/') $migrate_cmd
