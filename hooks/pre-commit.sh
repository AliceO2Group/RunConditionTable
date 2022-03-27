
#!/bin/bash

NOTEBOOK_PATH="database/mock/mockData.ipynb"
if ! git diff --cached --quiet -- "$NOTEBOOK_PATH"; then
echo $USER
# if ! command -v jupyter &> /dev/null; then
# echo "Changing mockData.ipynb requires convertion to python script on commit" >&2
# echo "Unable to perform because can not find jupyter nbconvert" >&2
# exit 1
# fi
echo "Converting $NOTEBOOK_FILE to python script"
jupyter nbconvert $NOTEBOOK_PATH --to script
fi
