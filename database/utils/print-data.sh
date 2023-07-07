#!/bin/bash

USER=postgres
DB=rct-db
cmd="select table_name::varchar from information_schema.tables where table_Schema='public';"

selects=$(psql -U $USER -d $DB -At -c "$cmd");


len=0
while IFS= read -r line || [[ -n $line ]]; do
    if [[ ${#line} -gt $len ]]; then
        len=${#line};
    fi
done < <(printf '%s' "$selects")

echo "--- Counts for all tables ---"
while IFS= read -r line || [[ -n $line ]]; do
    n=$(psql -U $USER -d $DB -At -c "Select count(*) from $line;");
    printf "%-$len""s :  %s\n" "$line" $n
done < <(printf '%s' "$selects")