
FIND_EXCLUDE_PHRASE=""
for igp in $(cat .gitignore); do
    FIND_EXCLUDE_PHRASE="$FIND_EXCLUDE_PHRASE -not -path './$igp*'"
done;

FIND_EXCLUDE_PHRASE="$FIND_EXCLUDE_PHRASE -not -path './.git/*'"
FIND_EXCLUDE_PHRASE="$FIND_EXCLUDE_PHRASE -not -path '*.png'"
FIND_EXCLUDE_PHRASE="$FIND_EXCLUDE_PHRASE -not -path './database/exported/*'"
FIND_EXCLUDE_PHRASE="$FIND_EXCLUDE_PHRASE -not -path './app/public/styles/images/favicon/favicon.ico'" # it seems to be binary but for some reason `find ... -type f` finds it 
FINDCMD="find . -type f $FIND_EXCLUDE_PHRASE"

f() {
    for p in $(bash -c "$FINDCMD"); do
        test $(tail -c1 "$p" | tr $'\n' '_') != '_' && echo "No newline at end of $p";
        test "$(tail -c2 "$p" | tr $'\n' '_')" = '__' && echo "More than one newline at the end of $p";
    done;
}

res=$(f)

if [ -n "$res" ]; then
    echo "$res"
    exit 1;
fi;
